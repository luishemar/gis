
// Variable global para almacenar el marcador de ubicación
let userLocationMarker = null;

document.addEventListener('DOMContentLoaded', function() {

    // Inicializar el mapa
    const map = L.map('map', {
        center: [40.4168, -3.7038], // Coordenadas de Madrid
        zoom: 6,
    });
    
    // Capa de OpenStreetMap
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 21,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    // Capa cartografía del Instituto Geográfico Nacional
    const ignLayerCarto = L.tileLayer('https://www.ign.es/wmts/mapa-raster?layer=MTN&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}', [[40.5, -4], [40.3, -3.5]], {
        maxZoom: 21,
        attribution: '© IGN'
    });
    
    // Capa imagen raster del Instituto Geográfico Nacional
    const ignLayerImg = L.tileLayer('https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg', [[40.5, -4], [40.3, -3.5]], {
        maxZoom: 21,
        attribution: '© IGN'
    });
    
    // Capa callejero transparente del Instituto Geográfico Nacional
    const ignLayerXpar = L.tileLayer('https://www.ign.es/wmts/ign-base?layer=IGNBaseOrto&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}', [[40.5, -4], [40.3, -3.5]], {
        maxZoom: 21,
        attribution: '© IGN',
        transparent: true,
        format: 'image/png'
    });
    
    // Capa híbrida creada por superposición de dos capas
    const ignLayerHib = L.layerGroup([
        ignLayerImg,
        ignLayerXpar
    ])
    
    // Control de selección de capas
    const baseMaps = {
        "OpenStreetMap": osmLayer,
        "IGN Cartografía": ignLayerCarto,
        "IGN Imagen": ignLayerImg,
        "IGN Híbrido": ignLayerHib
    };
    
    
    
    // Eventos para lanzar la geocodificación
    document.getElementById('searchButton').addEventListener('click', lanzarGeocod);
    document.getElementById('search').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            lanzarGeocod();
        }
    });
    
    // Eventos para el icono de aspa
    const searchInput = document.getElementById('search');
    const clearButton = document.getElementById('clearButton');
    
    searchInput.addEventListener('input', function() {
        clearButton.style.display = searchInput.value ? 'inline' : 'none'; // Mostrar u ocultar el icono aspa
    });
    
    clearButton.addEventListener('click', function() {
        searchInput.value = ''; // Borrar el contenido del campo de búsqueda
        clearButton.style.display = 'none'; // Ocultar el icono
        limpiarResultados(); // Borra la lista de resultados
    });
    
    // Función para realizar la geocodificación
    function lanzarGeocod() {
        var query = document.getElementById('search').value;
        if (query) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    limpiarResultados();
                
                    if (data.length > 0) {
                        data.forEach(result => {
                            var li = document.createElement('li');
                            li.textContent = result.display_name;
                            li.onclick = function() {
                                map.setView([result.lat, result.lon], 16);
                                limpiarResultados();
                            };
                            document.getElementById('results').appendChild(li);
                        });
                    } else {
                        alert('No se encontraron resultados.');
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }
    
    // Función para limpiar resultados de geocodificación
    function limpiarResultados() {
        document.getElementById('results').innerHTML = '';
    }
    
    
    
    // Evento para el botón de ubicación
    document.getElementById('locateButton').addEventListener('click', ubicarUsuario);
    
    // Función para ubicar al usuario
    function ubicarUsuario() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    map.setView([lat, lon], 16); // Centrar el mapa en la ubicación del usuario

                    // Si ya existe un marcador, elimínalo
                    if (userLocationMarker) {
                        map.removeLayer(userLocationMarker);
                    }
                    
                    // Crear un nuevo marcador en la ubicación del usuario
                    userLocationMarker = L.marker([lat, lon], { icon: iconMyLocation }).addTo(map);
                },
                () => {
                    alert('No se pudo obtener la ubicación.');
                },
                {
                    enableHighAccuracy: true, // Intenta obtener la ubicación más precisa
                    timeout: 5000, // Tiempo de espera para obtener la ubicación
                    maximumAge: 0 // No usar una ubicación en caché
                }                
            );
        } else {
            alert('La geolocalización no es soportada por este navegador.');
        }
    }
    
    
    
    // Función para cargar archivo Ldis en formato GeoJSON
    function cargarArchivoLdis() {
        fetch('ldis.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el archivo JSON');
                }
                return response.json();
            })
            .then(data => {
                // Añadir la capa GeoJSON al mapa
                L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        // Obtener el icono según la clasificación
                        const icon = iconMap[feature.properties.clasificacion] || iconMap['default'];
                        return L.marker(latlng, { icon: icon });
                    },
                    onEachFeature: function (feature, layer) {
                        // Agregar un popup con el nombre y la URL
                        if (feature.properties && feature.properties.nombre) {
                            layer.bindPopup(`<strong>${feature.properties.nombre}</strong><br><a href="${feature.properties.url}" target="_blank">Más información</a>`);
                        }
                    }
                }).addTo(map);
            })
            .catch(error => console.error('Error al cargar el archivo GeoJSON:', error));
    }
    
    
    
    L.control.layers(baseMaps).addTo(map);
    
    // Llamar a la función para cargar las coordenadas
    cargarArchivoLdis();

});
