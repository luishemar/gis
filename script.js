

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
    attribution: '© IGN',
    tms: true
});

// Capa híbrida del Instituto Geográfico Nacional
const ignLayerHib = L.tileLayer('https://www.ign.es/wmts/ign-base?layer=IGNBaseOrto&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}', [[40.5, -4], [40.3, -3.5]], {
    maxZoom: 21,
    attribution: '© IGN'
});

// Control de capas
const baseMaps = {
    "OpenStreetMap": osmLayer,
    "IGN Cartografía": ignLayerCarto,
    "IGN Imagen": ignLayerImg,
    "IGN Híbrido": ignLayerHib
};

L.control.layers(baseMaps).addTo(map);
