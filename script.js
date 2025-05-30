
// Variable global para almacenar el marcador de ubicación
let userLocationMarker = null;

// Array para almacenar los features
let geojsonFeatures = [];


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
    
    // Eventos para el icono de aspa de la caja de geocodificación
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
                                //map.setView([result.lat, result.lon], 16);
                                map.flyTo([result.lat, result.lon], 16);
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
                    //map.setView([lat, lon], 16); // Centrar el mapa en la ubicación del usuario
                    map.flyTo([lat, lon], 16); // Centrar el mapa en la ubicación del usuario
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
                    //enableHighAccuracy: true, // Intenta obtener la ubicación más precisa
                    timeout: 20000, // Tiempo de espera para obtener la ubicación
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
                geojsonFeatures = data.features; // Almacenar los features
                // Añadir la capa GeoJSON al mapa
                L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        const icon = iconMap[feature.properties.clasificacion] || iconMap['default'];
                        return L.marker(latlng, { icon: icon });
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('click', function() {
                            // Cerrar cualquier popup abierto
                            map.closePopup();
                
                            // Mostrar el popup para el feature clicado
                            mostrarPopupPaginado(feature, layer);
                        });
                    }
                }).addTo(map);
            })
            .catch(error => console.error('Error al cargar el archivo GeoJSON:', error));
    }

    function mostrarPopupPaginado(clickedFeature, clickedLayer) {
        
        const featuresInSameLocation = geojsonFeatures.filter(feature => {
            return feature.geometry.coordinates[0] === clickedFeature.geometry.coordinates[0] &&
                feature.geometry.coordinates[1] === clickedFeature.geometry.coordinates[1];
        });
    
        const itemsPerPage = 3;
        let currentPage = 0;
    
        function renderPage(page) {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const itemsToShow = featuresInSameLocation.slice(start, end);
    
            let popupContent = '<div>';
            itemsToShow.forEach(feature => {
                popupContent += `<strong>${feature.properties.nombre || 'Sin nombre'}</strong>`;
                if (feature.properties.clasificacion) {
                    popupContent += `<br>${feature.properties.clasificacion}`;
                }
                if (feature.properties.telefono) {
                    popupContent += `<br>${feature.properties.telefono}`;
                }
                if (feature.properties.url1) {
                    popupContent += `<br><a href="${feature.properties.url1}" target="_blank">URL1</a>`;
                }
                if (feature.properties.url2) {
                    popupContent += `<br><a href="${feature.properties.url2}" target="_blank">URL2</a>`;
                }
                popupContent += `<hr>`;
            });
            popupContent += '</div>';
    
            const totalPages = Math.ceil(featuresInSameLocation.length / itemsPerPage);
            if (totalPages > 1) {
                popupContent += `<div class="pagination">`;
                if (page > 0) {
                    popupContent += `<button class="pagination-btn" data-page="${page - 1}">Anterior</button>`;
                }
                if (page < totalPages - 1) {
                    popupContent += `<button class="pagination-btn" data-page="${page + 1}">Siguiente</button>`;
                }
                popupContent += `</div>`;
            }
    
            clickedLayer.bindPopup(popupContent).openPopup();
    
            // Esperar a que el popup se abra antes de añadir eventos
            clickedLayer.once('popupopen', () => {
                const buttons = document.querySelectorAll('.pagination-btn');
                buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const newPage = parseInt(e.target.getAttribute('data-page'), 10);
                        currentPage = newPage;
                        renderPage(currentPage);
                    });
                });
            });
        }
    
        renderPage(currentPage);
    }


    
    L.control.layers(baseMaps).addTo(map);
    
    // Llamar a la función para cargar las coordenadas
    cargarArchivoLdis();

});
