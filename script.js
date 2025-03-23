// Inicializar el mapa
const map = L.map('map', {
    center: [40.4168, -3.7038], // Coordenadas de Madrid
    zoom: 6,
});

// Capa de OpenStreetMap
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Capa de imagen del Instituto Geográfico de España
const igeLayer = L.imageOverlay('https://tms-mapa-raster.ign.es/1.0.0/mapa-raster/{z}/{x}/{-y}.jpeg', [[40.5, -4], [40.3, -3.5]], {
    opacity: 0.5
});

// Control de capas
const baseMaps = {
    "OpenStreetMap": osmLayer,
    "IGE": igeLayer
};

L.control.layers(baseMaps).addTo(map);
