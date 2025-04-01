
var iconMyLocation = L.divIcon({
    className: 'myLocation-icon',
    html: '<div style="position: relative; width: 30px; height: 30px; text-align: center; color: black;">' +
    '<i class="material-icons" style="font-size: 30px;">my_location</i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});


// Icono para AS-PDI
var iconAS_PDI = L.divIcon({
    className: 'custom-icon',
    html: '<div style="color: blue;"><i class="material-icons" style="font-size: 24px;">star</i></div>', // Ejemplo de icono
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Icono para LU-PDI
var iconLU_PDI = L.divIcon({
    className: 'custom-icon',
    html: '<div style="color: green;"><i class="material-icons" style="font-size: 24px;">place</i></div>', // Ejemplo de icono
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Icono para otros tipos
var iconDefault = L.divIcon({
    className: 'custom-icon',
    html: '<div style="color: red;"><i class="material-icons" style="font-size: 24px;">help</i></div>', // Ejemplo de icono
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Mapeo de clasificaciones a iconos
var iconMap = {
    'AS-PDI': iconAS_PDI,
    'LU-PDI': iconLU_PDI,
    'default': iconDefault // Para otros tipos
};