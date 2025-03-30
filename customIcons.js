var iconMyLocationHtml = '<div style="position: relative; width: 30px; height: 30px; text-align: center; color: black;">' +
               '<i class="material-icons" style="font-size: 30px;">my_location</i>' +
               '</div>';

var iconMyLocation = L.divIcon({
    className: 'custom-icon',
    html: iconMyLocationHtml,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});
