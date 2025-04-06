
var iconMyLocation = L.divIcon({
    className: 'myLocation-icon',
    html: '<div style="position: relative; width: 30px; height: 30px; text-align: center; color: black;">' +
    '<i class="material-icons" style="font-size: 30px;">my_location</i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});


// Icono para Ruta
var iconRuta = L.divIcon({
    className: 'custom-icon',
    html: '<div style="color: blue;"><i class="material-icons" style="font-size: 24px;">moving</i></div>', // Ejemplo de icono
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Icono para Ruta-AS
var iconRuta_AS = L.divIcon({
    className: 'custom-icon',
    html: '<div style="color: red;"><i class="material-icons" style="font-size: 24px;">moving</i></div>', // Ejemplo de icono
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Icono para LDI
var iconLDI = L.divIcon({
    className: 'custom-icon',
    html: '<div style="color: blue;"><i class="material-icons" style="font-size: 24px;">local_activity</i></div>', // Ejemplo de icono
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Icono para LDI-AS
var iconLDI_AS = L.divIcon({
    className: 'custom-icon',
    html: '<div style="color: red;"><i class="material-icons" style="font-size: 24px;">local_activity</i></div>', // Ejemplo de icono
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
    'Ruta':     iconRuta,
    'Ruta_AS':  iconRuta_AS,
    'LDI':      iconLDI,
    'LDI_AS':   iconLDI_AS, 
    'default': iconDefault // Para otros tipos
};