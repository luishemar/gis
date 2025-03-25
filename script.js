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

// Capa de imagen del Instituto Geográfico de España
const ignLayer = L.tileLayer('https://www.ign.es/wmts/mapa-raster?layer=MTN&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}', [[40.5, -4], [40.3, -3.5]], {
    maxZoom: 21,
    attribution: '© IGN'
});

// Control de capas
const baseMaps = {
    "OpenStreetMap": osmLayer,
    "IGN": ignLayer
};

L.control.layers(baseMaps).addTo(map);
