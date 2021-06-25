import L from 'leaflet'
import {antPath} from 'leaflet-ant-path'

var DRAWED = [];

function drawSimpleAntPathBetweenTwoPositions(pos1, pos2, map) {
    const latlngs = [pos1, pos2];
    const options = {
        use: L.polyline,
        delay: 600,
        dashArray: [10, 20],
        weight: 5,
        color: "#6375ff",
        pulseColor: "#cac5ff",
        opacity: .8
    };
    const path = antPath(latlngs, options);

    path.addTo(map);

    DRAWED.push(path);

    return path;
}

function drawSimpleAntPathBetweenTwoMarkers(marker1, marker2, map) {
    return drawSimpleAntPathBetweenTwoPositions(marker1.getLatLng(), marker2.getLatLng(), map);
}

function clear(map) {
    DRAWED.forEach(draw => {
        draw.onRemove();
        draw.remove();
        draw.removeFrom(map);
        map.removeLayer(draw);
    });
}

export default {
    drawSimpleAntPathBetweenTwoPositions,
    drawSimpleAntPathBetweenTwoMarkers,
    clear
}
