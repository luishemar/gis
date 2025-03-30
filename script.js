
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

// Capa cartografia del Instituto Geográfico Nacional
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

// Control de capas
const baseMaps = {
    "OpenStreetMap": osmLayer,
    "IGN Cartografía": ignLayerCarto,
    "IGN Imagen": ignLayerImg,
    "IGN Híbrido": ignLayerHib
};

document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Evento para el ícono de aspa
const clearButton = document.getElementById('clearButton');
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', function() {
    clearButton.style.display = searchInput.value ? 'inline' : 'none'; // Mostrar u ocultar el ícono
});

clearButton.addEventListener('click', function() {
    searchInput.value = ''; // Borrar el contenido del campo de búsqueda
    clearButton.style.display = 'none'; // Ocultar el ícono
    clearResults(); // Borra la lista de resultados
});

// Función para realizar la búsqueda
function performSearch() {
    var query = document.getElementById('search').value;
    if (query) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                clearResults();

                if (data.length > 0) {
                    data.forEach(result => {
                        var li = document.createElement('li');
                        li.textContent = result.display_name;
                        li.onclick = function() {
                            map.setView([result.lat, result.lon], 16);
                            clearResults();
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

function clearResults() {
    document.getElementById('results').innerHTML = '';
}


L.control.layers(baseMaps).addTo(map);
