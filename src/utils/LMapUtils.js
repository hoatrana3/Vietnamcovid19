import L from 'leaflet';
import _ from 'lodash';
import 'mapbox-gl-leaflet';
import i18n from '../i18n'

/**
 * MAP OPTIONS
 */
const MAP_USE_OSM = false; // Use OSM -> OSM + Leaflet + Maptiler; Use Google -> Google Mutant + Leaflet
const MAP_CENTER = [14.058324, 108.277199]; // Vietnam location
const MAP_ZOOM = 3;
const MAP_MAX_ZOOM = 22;
const MAP_MIN_ZOOM = 3;
const MAP_MARKER_VIEW_ZOOM = 20;
const MAP_VIEWPORT = [
    [23.3926504, 109.6765], // northeast
    [8.195200099999999, 102.1439156] // southwest
];
const MAP_ZOOM_PER_LEVEL = 1;
const MAP_DEFAULT_SETTINGS = {
    useCluster: true,
    showSummary: true,
    clickOutsideQuitDetails: true,
    autoSetStyleByTime: true,
    autoBoundRelations: false
};

/**
 * MAP AUTOCOMPLETE OPTIONS
 */
const AUTOCOMPLETE_DELAY_SEARCH = 200; // in milliseconds
const AUTOCOMPLETE_MAX_RESULTS = 5;
const AUTOCOMPLETE_PLACE_TAG = "place";
const AUTOCOMPLETE_CASE_TAG = "case";

/**
 * MAP INITIALIZATION
 */
const MAP_TILELAYER_ATTRIBUTION = "<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>";
const MAP_MAPBOX_TOKEN = "pk.eyJ1IjoiaG9hdHJhbmEzMTcwOSIsImEiOiJjazgwZWU3dzUwNnJiM2xudWcwdmo0c3hnIn0.k0TfM-Wem4FotX3WJg-YJw";

/**
 * MAP STYLES
 */
const MAP_DAY_STYLE = L.mapboxGL({
    attribution: MAP_TILELAYER_ATTRIBUTION,
    accessToken: 'not-needed',
    style: "https://api.maptiler.com/maps/063492e3-1501-4b15-8629-615556b8a536/style.json?key=pbFzgdwjyNF6F1prjicc"
});
const MAP_NIGHT_STYLE = L.mapboxGL({
    attribution: MAP_TILELAYER_ATTRIBUTION,
    accessToken: 'not-needed',
    style: "https://api.maptiler.com/maps/cddffcc9-039f-4e98-b987-0272dac23392/style.json?key=pbFzgdwjyNF6F1prjicc"
});

/**
 * MAP COVID INFO
 */
const CASETYPE_NEW_CASE = 1; // ca moi nhiem
const CASETYPE_OLD_CASE = 2; // ca nhiem cu
const CASETYPE_DISCHARGE_CASE = 3; // ca da khoi
const CASETYPE_SUSPECTED_CASE = 4; // ca nghi nhiem
const CASETYPE_DEAD_CASE = 5; // ca tu vong
const CASETYPE_ISOLATED_PLACE = 6; // dia diem cach li

const CASETYPE_NEW_CASE_STR = "newCase";
const CASETYPE_OLD_CASE_STR = "oldCase";
const CASETYPE_DISCHARGE_CASE_STR = "dischargeCase";
const CASETYPE_SUSPECTED_CASE_STR = "suspectedCase";
const CASETYPE_DEAD_CASE_STR = "deadCase";
const CASETYPE_ISOLATED_PLACE_STR = "isolatedPlace";
const USER_STR = "user";
const SEARCH_STR = "search";
const VIETNAM_STR = "vietnam";

const MAP_SUSPECTED_CASE_ZINDEX = 1;
const MAP_ISOLATED_PLACE_ZINDEX = MAP_SUSPECTED_CASE_ZINDEX + 5;
const MAP_USER_ZINDEX = MAP_ISOLATED_PLACE_ZINDEX + 10;
const MAP_SEARCH_ZINDEX = MAP_USER_ZINDEX + 15;
const MAP_VIETNAM_ZINDEX = MAP_SEARCH_ZINDEX + 20;
const MAP_DEAD_CASE_ZINDEX = MAP_VIETNAM_ZINDEX + 25;
const MAP_DISCHARGE_CASE_ZINDEX = MAP_DEAD_CASE_ZINDEX + 30;
const MAP_OLD_CASE_ZINDEX = MAP_DISCHARGE_CASE_ZINDEX + 35;
const MAP_NEW_CASE_ZINDEX = MAP_OLD_CASE_ZINDEX + 40;
const MAP_MARKER_HIGHEST_Z_INDEX = 999999999;

const MAP_ICONS = {
    newCase: {
        name: i18n.t('cases.type.new-case'),
        icon: '../assets/img/map/marker/marker_new_case.svg',
        shadow: '../assets/img/map/marker/shadow_new_case.svg'
    },
    oldCase: {
        name: i18n.t('cases.type.old-case'),
        icon: '../assets/img/map/marker/marker_old_case.svg',
        shadow: '../assets/img/map/marker/shadow_old_case.svg'
    },
    dischargeCase: {
        name: i18n.t('cases.type.discharge-case'),
        icon: '../assets/img/map/marker/marker_discharge_case.svg',
        shadow: '../assets/img/map/marker/shadow_discharge_case.svg'
    },
    // deadCase: {
    //     name: 'Ca tử vong',
    //     icon: '',
    //     shadow: ''
    // },
    isolatedPlace: {name: i18n.t('cases.type.isolated-place'), icon: '../assets/img/map/marker/marker_isolated_place.svg', shadow: ''},
    suspectedCase: {name: '', icon: '../assets/img/map/marker/marker_suspected_case.svg', shadow: ''}, // Ca nghi nhiễm : Currently we don't want to use this so we set it name as empty string
    user: {
        name: i18n.t('map.your-location'),
        icon: '../assets/img/map/marker/marker_user.svg',
        shadow: '../assets/img/map/marker/shadow_user.svg'
    },
    search: {
        name: i18n.t('map.searched-place'),
        icon: '../assets/img/map/marker/marker_search.svg',
        shadow: '../assets/img/map/marker/shadow_search.svg'
    },
    vietnam: {name: '', icon: '../assets/img/map/marker/marker_vietnam.svg', shadow: ''},
};

/**
 * Location
 */
var USER_LOCATION = null;
const VIETNAM_PARACEL_ISLAND_POSITION = {lat: 16.292489, lng: 112.479346}; // Hoang Sa Vietnam
const VIETNAM_SPRATLY_ISLAND_POSITION = {lat: 10.531940, lng: 115.731757}; // Truong Sa Vietnam

/**
 * Supporting Methods
 */

function getCaseTypeNameById(id) {
    switch (id) {
        case CASETYPE_NEW_CASE:
            return CASETYPE_NEW_CASE_STR;
        case CASETYPE_OLD_CASE:
            return CASETYPE_OLD_CASE_STR;
        case CASETYPE_DISCHARGE_CASE:
            return CASETYPE_DISCHARGE_CASE_STR;
        case CASETYPE_SUSPECTED_CASE:
            return CASETYPE_SUSPECTED_CASE_STR;
        case CASETYPE_ISOLATED_PLACE:
            return CASETYPE_ISOLATED_PLACE_STR;
        case CASETYPE_DEAD_CASE:
            return CASETYPE_DEAD_CASE_STR;
    }
}

function getTemplateObjectCaseType(initValue) {

    return {
        dischargeCase: _.clone(initValue),
        suspectedCase: _.clone(initValue),
        isolatedPlace: _.clone(initValue),
        oldCase: _.clone(initValue),
        newCase: _.clone(initValue),
    };
}

function getUserCurrentLocation(onSuccess, onFailure) {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            USER_LOCATION = [position.coords.latitude, position.coords.longitude];

            onSuccess(USER_LOCATION);
        }, error => {
            onFailure(error.message);
        });
    } else {
        onFailure("Trình duyệt không hỗ trợ xác định vị trí!");
    }
}

function getIconMarkerByType(type) {

    function getIconAnchor(iconType) {
        switch (iconType) {
            case CASETYPE_SUSPECTED_CASE_STR:
            case CASETYPE_ISOLATED_PLACE_STR:
                return [15, 15];
            case VIETNAM_STR:
                return [13, 13];
            default:
                return [13, 40]
        }
    }

    function getPopupAnchor(iconType) {
        switch (iconType) {
            case CASETYPE_SUSPECTED_CASE_STR:
            case CASETYPE_ISOLATED_PLACE_STR:
                return [0, -12];
            case VIETNAM_STR:
                return [0, -10];
            default:
                return [0, -38]
        }
    }

    return L.divIcon({
        iconUrl: MAP_ICONS[type].icon,
        shadowUrl: MAP_ICONS[type].shadow,

        className: "marker-icon-wrapper",
        html: `
        <div class="marker-icon">
            <div class="icon-shadow">
                <img src="${MAP_ICONS[type].shadow}" alt="">
            </div>
            <div class="icon-main ${type}">
                 <img src="${MAP_ICONS[type].icon}" alt="">
            </div>
        </div>
        `,

        // className: className,
        iconAnchor: getIconAnchor(type),
        // shadowAnchor: [18, 12],
        popupAnchor: getPopupAnchor(type)
    })
}

function getCustomMarkerOptions(icon) {
    return {
        icon: icon,
    };
}

function fitBoundMarkers(map, markers) {

    let bounds = L.latLngBounds();

    markers.forEach(marker => {
        bounds.extend(marker.getLatLng())
    });

    map.fitBounds(bounds);
}

function fitBoundLocations(map, locations) {
    let bounds = [];

    locations.forEach(l => bounds.push(l));

    map.fitBounds(bounds);
}

function isMapBoundsMarkers(map, markers) {
    for (let i = 0; i < markers.length; ++i) {
        if (!isMapContainsPosition(map, markers[i].getLatLng())) return false;
    }

    return true;
}

function isMapContainsPosition(map, position) {
    return map.getBounds().contains(position);
}

const rad = function (x) {
    return x * Math.PI / 180;
};

function calcDistanceBetweenTwoMarkers(marker1, marker2) {
    let p1 = marker1.getLatLng();
    let p2 = marker2.getLatLng();
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = rad(p2.lat - p1.lat);
    let dLong = rad(p2.lng - p1.lng);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(3); // returns the distance in meter
}

function setZIndexForMarker(marker, type, isHighest = false) {
    if (isHighest) {
        marker.setZIndexOffset(MAP_MARKER_HIGHEST_Z_INDEX);
        return;
    }

    var targetZIndex = 0;

    switch (type) {
        case CASETYPE_NEW_CASE_STR:
            targetZIndex = MAP_NEW_CASE_ZINDEX;
            break;
        case CASETYPE_OLD_CASE_STR:
            targetZIndex = MAP_OLD_CASE_ZINDEX;
            break;
        case CASETYPE_DISCHARGE_CASE_STR:
            targetZIndex = MAP_DISCHARGE_CASE_ZINDEX;
            break;
        case CASETYPE_SUSPECTED_CASE_STR:
            targetZIndex = MAP_SUSPECTED_CASE_ZINDEX;
            break;
        case CASETYPE_ISOLATED_PLACE_STR:
            targetZIndex = MAP_ISOLATED_PLACE_ZINDEX;
            break;
        case CASETYPE_DEAD_CASE_STR:
            targetZIndex = MAP_DEAD_CASE_ZINDEX;
            break;
        case SEARCH_STR:
            targetZIndex = MAP_SEARCH_ZINDEX;
            break;
        case USER_STR:
            targetZIndex = MAP_USER_ZINDEX;
            break;
        case VIETNAM_STR:
            targetZIndex = MAP_VIETNAM_ZINDEX;
            break;
    }

    marker.setZIndexOffset(targetZIndex);
}

function setViewMapToPosition(map, position) {
    map.setView(position, MAP_MARKER_VIEW_ZOOM);
}

export default {
    MAP_CENTER,
    MAP_ZOOM,
    MAP_MAX_ZOOM,
    MAP_MIN_ZOOM,
    MAP_MARKER_VIEW_ZOOM,
    MAP_VIEWPORT,
    MAP_DEFAULT_SETTINGS,
    MAP_ZOOM_PER_LEVEL,

    AUTOCOMPLETE_DELAY_SEARCH,
    AUTOCOMPLETE_MAX_RESULTS,
    AUTOCOMPLETE_PLACE_TAG,
    AUTOCOMPLETE_CASE_TAG,

    MAP_TILELAYER_ATTRIBUTION,
    MAP_USE_OSM,
    MAP_DAY_STYLE,
    MAP_NIGHT_STYLE,
    MAP_MAPBOX_TOKEN,

    CASETYPE_NEW_CASE,
    CASETYPE_OLD_CASE,
    CASETYPE_DISCHARGE_CASE,
    CASETYPE_SUSPECTED_CASE,
    CASETYPE_ISOLATED_PLACE,
    CASETYPE_DEAD_CASE,

    CASETYPE_NEW_CASE_STR,
    CASETYPE_OLD_CASE_STR,
    CASETYPE_DISCHARGE_CASE_STR,
    CASETYPE_SUSPECTED_CASE_STR,
    CASETYPE_ISOLATED_PLACE_STR,
    CASETYPE_DEAD_CASE_STR,
    USER_STR,
    SEARCH_STR,
    VIETNAM_STR,

    MAP_SUSPECTED_CASE_ZINDEX,
    MAP_ISOLATED_PLACE_ZINDEX,
    MAP_USER_ZINDEX,
    MAP_SEARCH_ZINDEX,
    MAP_VIETNAM_ZINDEX,
    MAP_DEAD_CASE_ZINDEX,
    MAP_DISCHARGE_CASE_ZINDEX,
    MAP_OLD_CASE_ZINDEX,
    MAP_NEW_CASE_ZINDEX,
    MAP_MARKER_HIGHEST_Z_INDEX,

    MAP_ICONS,

    USER_LOCATION,
    VIETNAM_PARACEL_ISLAND_POSITION,
    VIETNAM_SPRATLY_ISLAND_POSITION,

    getCaseTypeNameById,
    getTemplateObjectCaseType,
    getUserCurrentLocation,
    getIconMarkerByType,
    getCustomMarkerOptions,
    fitBoundMarkers,
    fitBoundLocations,
    isMapBoundsMarkers,
    isMapContainsPosition,
    calcDistanceBetweenTwoMarkers,
    setZIndexForMarker,
    setViewMapToPosition
}
