// Inicializa el mapa
var map = L.map('map').setView([51.505, -0.09], 13);

// Agrega una capa de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Agrega un marcador
var marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindPopup('<b>¡Hola mundo!</b><br>Estoy en Londres.').openPopup();
