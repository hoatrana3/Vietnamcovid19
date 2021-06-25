<template>
    <div class="lcovid-map-wrapper" :class="isInDayMode ? '' : 'map-wrapper-night'">
        <div id="lcovid-map"></div>

        <MapAutocomplete class="map-autocomplete-wrapper"
                         :isOpenSearchProps.sync="isOpenSearch"
                         :covid-data="covidData"
                         v-model="searchedPlace.place"
                         @onSelectedDestination="onSelectedNewSearchPlace"
                         ref="mapAutoComplete"/>

        <div class="exit-marker-selected-wrapper" :class="(selectingMarker.marker != null) ? 'exit-show' : ''">
            <span class="d-block text-center font-weight-bold hint" :class="isInDayMode ? 'text-dark' : 'text-white'">
                {{$t('map.press')}}
                <span class="text-danger">"{{$t('map.exit')}}"</span>
                {{mapSettings.clickOutsideQuitDetails ? $t('map.click-on-the-map') : ''}} {{$t('map.to-exit-detail-mode')}}.
            </span>
            <b-button class="btn-exit" variant="danger" pill
                      size="sm" @click="callUnselectedMarker()">
                <div class="d-flex justify-content-center align-items-center px-2">
                    <i class="fas fa-times mr-2"></i>
                    <span>{{$t('map.exit')}}</span>
                </div>
            </b-button>
        </div>

        <MapDayNightSwitcher class="map-daynight-switch" :class="isOpenSearch ? 'switch-hide' : ''"
                             v-model="isInDayMode"/>

        <LanguageSelector class="map-language-selector"
                          :class="isOpenSearch ? 'selector-hide' : ''"
                          :is-minimize="true" />

        <MapBonusOptionsBar
                class="map-bonus-options-wrapper"
                :item-on-click-handlers="[
                        () => centerToDefault(),
                        () => centerToDeviceLocation(),
                        () => openMapSettings()
                    ]"
                :is-in-day-mode="isInDayMode"
                :map="lMap"/>

        <MapLegend class="map-legend" :map-icons="mapIcons"
                   :summary-info="vnCovidSummary"
                   :callback-toggle="toggleFilterCases"
                   :class="mapSettings.showSummary ? '' : 'legend-hide'"/>

        <MapBottomNavigation class="map-bottom-navigation-wrapper"/>

        <b-modal ref="modal-settings" centered hide-header hide-footer size="sm">
            <h5 class="w-100 text-center m-0 font-weight-semibold">{{$t('map.map-settings')}}</h5>
            <hr>
            <div class="modal-setting-item">
                <span>{{$t('map.settings.show-info-board')}}</span>
                <div class="pretty p-default p-round p-thick custom-checkbox">
                    <input type="checkbox" v-model="mapSettings.showSummary"/>
                    <div class="state p-primary-o">
                        <label></label>
                    </div>
                </div>
            </div>
            <div class="modal-setting-item">
                <span>{{$t('map.settings.collapse-cases')}}</span>
                <div class="pretty p-default p-round p-thick custom-checkbox">
                    <input type="checkbox" v-model="mapSettings.useCluster"/>
                    <div class="state p-primary-o">
                        <label></label>
                    </div>
                </div>
            </div>
            <div class="modal-setting-item">
                <span>{{$t('map.settings.click-map-to-exit-detail')}}</span>
                <div class="pretty p-default p-round p-thick custom-checkbox">
                    <input type="checkbox" v-model="mapSettings.clickOutsideQuitDetails"/>
                    <div class="state p-primary-o">
                        <label></label>
                    </div>
                </div>
            </div>
            <div class="modal-setting-item">
                <span>{{$t('map.settings.auto-adjust-day-and-night')}}</span>
                <div class="pretty p-default p-round p-thick custom-checkbox">
                    <input type="checkbox" v-model="mapSettings.autoSetStyleByTime"/>
                    <div class="state p-primary-o">
                        <label></label>
                    </div>
                </div>
            </div>
            <div class="modal-setting-item">
                <span>{{$t('map.settings.cover-all-relation')}}</span>
                <div class="pretty p-default p-round p-thick custom-checkbox">
                    <input type="checkbox" v-model="mapSettings.autoBoundRelations"/>
                    <div class="state p-primary-o">
                        <label></label>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import L from 'leaflet'
    import LMapUtils from "../../utils/LMapUtils";
    import Vuex from "vuex";
    import MapLegend from "./widgets/MapLegend";
    import MapDayNightSwitcher from "./widgets/MapDayNightSwitcher";
    import TimeUtils from "../../utils/TimeUtils";
    import StringUtils from "../../utils/StringUtils";
    import MapBonusOptionsBar from "./widgets/MapBonusOptionsBar";
    import NotificationUtils from "../../utils/NotificationUtils";
    import LogUtils from "../../utils/LogUtils";
    import LDrawUtils from "../../utils/LDrawUtils";
    import MapAutocomplete from "./widgets/MapAutocomplete";
    import LStorageUtils from "../../utils/LStorageUtils";
    import _ from 'lodash';
    import GMapUtils from "../../utils/GMapUtils";
    import MapBottomNavigation from "./widgets/MapBottomNavigation";
    import LanguageSelector from "../dashboard/widgets/LanguageSelector";
    import i18n from '../../i18n'

    export default {
        name: "LCovidMap",
        components: {
            LanguageSelector,
            MapBottomNavigation, MapAutocomplete, MapBonusOptionsBar, MapDayNightSwitcher, MapLegend},
        data() {
            return {
                lMap: null,
                lTileLayer: null,
                lMapStyle: null,
                lGoogleMutant: null,

                mapSettings: LMapUtils.MAP_DEFAULT_SETTINGS,

                covidMarkers: [],
                covidMarkersShowingInDetails: [],
                clusterManager: LMapUtils.getTemplateObjectCaseType(null),

                getDataInterval: null,
                intervalTime: 10 * 60000,
                isRequestGetDataInQueue: false,

                isInDayMode: LStorageUtils.getDefaultMapStyle() === "day",

                isOpenSearch: false,

                selectingMarker: {
                    marker: null,
                    index: null,
                    relationMarkers: []
                },

                searchedPlace: {
                    place: null,
                    marker: null
                },

                userLocation: {
                    location: null,
                    marker: null
                },

                isCheckedInFilter: LMapUtils.getTemplateObjectCaseType(true)
            }
        },
        computed: {
            ...Vuex.mapGetters(['vnCovidSummary']),

            // For watcher
            covidData() {
                return this.$store.getters.vnCovidData
            },

            mapIcons() {
                return LMapUtils.MAP_ICONS
            },

            getSelectingMarker() {
                return this.selectingMarker.marker
            },

            mapUseCluster() {
                return this.mapSettings.useCluster;
            },

            mapAutoSetStyle() {
                return this.mapSettings.autoSetStyleByTime;
            }
        },
        watch: {
            covidData() {
                this.clearOldMapDatas();
                this.initCovidMarkers();
            },

            isInDayMode() {
                const savedDefaultStyle = LStorageUtils.getDefaultMapStyle();

                if (savedDefaultStyle != null) this.toggleMapStyle();

                LStorageUtils.saveDefaultMapStyle(this.isInDayMode);
            },

            getSelectingMarker() {
                if (this.selectingMarker.marker == null) this.onUnselectedMarker()
            },

            mapSettings: {
                handler(val) {

                    this.mapSettings = val;
                    if (val === LMapUtils.MAP_DEFAULT_SETTINGS) return;

                    LStorageUtils.saveMapSettings(this.mapSettings);
                },
                deep: true
            },

            mapUseCluster() {
                this.toggleClusterOnMap(this.mapSettings.useCluster);
            }
        },
        created() {
            this.initMapSettings();

            this.doGetData();
            this.setIntervalGetData();
        },
        mounted() {
            this.initMap();
            this.initMapStyle();
        },
        beforeDestroy() {
            clearInterval(this.getDataInterval);
        },

        methods: {
            ...Vuex.mapActions(['GET_VIETNAM_COVID_DATA', 'GET_VIETNAM_COVID_SUMMARY', 'OPEN_LOADING', 'CLOSE_LOADING', 'HIDE_INFO_DRAWER']),

            /**
             * MAP FUNCTIONS
             */
            initMap() {
                this.lMap = L.map('lcovid-map', {
                    center: LMapUtils.MAP_CENTER,
                    zoom: LMapUtils.MAP_ZOOM,
                    zoomControl: false,
                    minZoom: LMapUtils.MAP_MIN_ZOOM,
                    maxZoom: LMapUtils.MAP_MAX_ZOOM,
                    attributionControl: false
                });

                this.centerToDefault();

                this.lMap.on('click dragstart zoomstart', () => this.HIDE_INFO_DRAWER());
            },
            initMapStyle() {
                this.OPEN_LOADING();

                let onFinishedInitStyle = () => {
                    LMapUtils.getUserCurrentLocation(
                        position => this.putMarkerToDeviceLocation(position),
                        error => {
                            LogUtils.e(error);
                            // NotificationUtils.notify(NotificationUtils.getFailToGetDeviceLocationNotification());
                        }
                    );
                    this.putVietNamIslandMarkers();

                    this.CLOSE_LOADING();
                };

                let initMaptilerStyle = () => {
                    this.lMapStyle = this.isInDayMode ? LMapUtils.MAP_DAY_STYLE : LMapUtils.MAP_NIGHT_STYLE;

                    this.lMapStyle.addTo(this.lMap);

                    this.lMapStyle.getMapboxMap().on('load', () => onFinishedInitStyle());
                };

                let initGoogleMutantStyle = () => {
                    this.lGoogleMutant = L.gridLayer.googleMutant({
                        styles: this.isInDayMode ? GMapUtils.MAP_DAY_STYLES : GMapUtils.MAP_NIGHT_STYLES
                    }).addTo(this.lMap);

                    this.lGoogleMutant.on('load', () => onFinishedInitStyle());
                };

                if (LMapUtils.MAP_USE_OSM) initMaptilerStyle();
                else initGoogleMutantStyle();
            },
            toggleMapStyle() {
                let toggleMaptilerStyle = () => {
                    const nextStyle = this.isInDayMode ? LMapUtils.MAP_DAY_STYLE : LMapUtils.MAP_NIGHT_STYLE;

                    if (nextStyle !== this.lMapStyle) {
                        nextStyle.addTo(this.lMap);

                        nextStyle.getMapboxMap().on('load', () => {
                            this.lMap.removeLayer(this.lMapStyle);
                            this.lMapStyle = nextStyle;

                            this.CLOSE_LOADING();
                        });
                    } else {
                        this.CLOSE_LOADING();
                    }
                };

                let toggleGoogleMutantStyle = () => {
                    const oldMutantLayer = this.lGoogleMutant;

                    this.lGoogleMutant = L.gridLayer.googleMutant({
                        styles: this.isInDayMode ? GMapUtils.MAP_DAY_STYLES : GMapUtils.MAP_NIGHT_STYLES
                    }).addTo(this.lMap);

                    this.lGoogleMutant.on('load', () => {
                        this.lMap.removeLayer(oldMutantLayer);

                        this.CLOSE_LOADING();
                    });
                };

                this.OPEN_LOADING();

                if (LMapUtils.MAP_USE_OSM) toggleMaptilerStyle();
                else toggleGoogleMutantStyle();
            },
            centerToDefault() {
                this.lMap.fitBounds(LMapUtils.MAP_VIEWPORT);
            },
            initMapSettings() {
                const savedSettings = LStorageUtils.getFromKey(LStorageUtils.KEY_MAP_SETTINGS, true);

                if (savedSettings != null) this.mapSettings = savedSettings;
                else this.mapSettings = _.clone(LMapUtils.MAP_DEFAULT_SETTINGS);

                if (this.mapSettings.autoSetStyleByTime) this.isInDayMode = TimeUtils.isDay();
            },


            /**
             * MAP HANDLE FUNCTIONS
             */
            initCovidMarkers() {

                this.initCovidMarkerCluster();

                this.covidData.forEach((data, index) => {
                    const marker = this.generateSingleMarker(this.covidData[index], index);

                    // marker.addTo(this.lMap);

                    this.covidMarkers.push(marker);
                    this.clusterManager[data.caseType].addLayer(marker);
                });

                // Currently we don't want to show suspected cases more
                this.toggleFilterCases(LMapUtils.CASETYPE_SUSPECTED_CASE_STR, false);

                Object.keys(this.clusterManager).forEach(key => {
                    if (this.isCheckedInFilter[key]) this.lMap.addLayer(this.clusterManager[key]);
                });

                this.toggleClusterOnMap(this.mapSettings.useCluster);
            },
            initCovidMarkerCluster() {
                Object.keys(this.clusterManager).forEach(key => {
                    if (this.clusterManager[key] == null) {
                        this.clusterManager[key] = L.markerClusterGroup({
                            iconCreateFunction: function (cluster) {
                                return L.divIcon({
                                    className: `covid-cluster-wrapper cluster-${key}`,
                                    html: `
                                    <div class="covid-cluster cluster-${key}">
                                        <div class="cluster-bg">
                                            <span class="bg-1"></span>
                                            <span class="bg-2"></span>
                                            <span class="bg-3"></span>
                                            <span class="bg-4"></span>
                                            <div class="cluster-count">${cluster.getChildCount()}</div>
                                        </div>
                                    </div>
                                `
                                });
                            }
                        });
                    }
                });
            },
            generateSingleMarker(data, index = null) {

                const vm = this;

                function isNotMainCase(info) {
                    return info.caseType === LMapUtils.CASETYPE_SUSPECTED_CASE_STR || info.caseType === LMapUtils.CASETYPE_ISOLATED_PLACE_STR;
                }

                function isSearchFlag(info) {
                    return info.caseType === LMapUtils.SEARCH_STR
                }

                function isVietnamFlag(info) {
                    return info.caseType === LMapUtils.VIETNAM_STR
                }

                function isUserLocationFlag(info) {
                    return info.caseType === LMapUtils.USER_STR
                }

                function isDisableDetailMode(info) {
                    return isVietnamFlag(info) || isNotMainCase(info) || isUserLocationFlag(info) || isSearchFlag(info)
                }

                function getMarkerTitle(info) {
                    var title = StringUtils.isEmpty(info.case_no) ? vm.$t('cases.case-suspected') : `${vm.$t('cases.case-num')} ${StringUtils.formatData(info.case_no)}`;

                    if (isVietnamFlag(info) || isUserLocationFlag(info)) title = info.placeName;
                    if (isSearchFlag(info)) title = info.label;

                    return title;
                }

                let icon = LMapUtils.getIconMarkerByType(data.caseType);
                let markerOptions = LMapUtils.getCustomMarkerOptions(icon);

                markerOptions.title = getMarkerTitle(data);

                let marker = new L.Marker(data.position, markerOptions);
                let popup = this.getMarkerInfoPopup(data);

                marker.bindPopup(popup.content, popup.options);

                marker.on('dblclick', () => {
                    LMapUtils.setViewMapToPosition(this.lMap, data.position);
                });

                marker.on("click", () => {

                    this.lMap.on("click", () => {
                        if (!isDisableDetailMode(data) && this.mapSettings.clickOutsideQuitDetails) this.callUnselectedMarker()
                    });

                    if (!isDisableDetailMode(data))
                        this.onSelectedMarker(index);

                });

                LMapUtils.setZIndexForMarker(marker, data.caseType);

                return marker;
            },
            getMarkerInfoPopup(data) {

                const vm = this;

                function formatCurrentstatus(info) {
                    if (info.is_discharge === "Y") return vm.$t('cases.recovered');
                    if (info.is_dead === "Y") return vm.$t('cases.dead');
                    if (
                        info.caseType === LMapUtils.CASETYPE_OLD_CASE_STR ||
                        info.caseType === LMapUtils.CASETYPE_NEW_CASE_STR
                    ) return vm.$t('cases.being-treated');
                    if (info.caseType === LMapUtils.CASETYPE_SUSPECTED_CASE_STR) return vm.$t('cases.suspected');
                    if (info.caseType === LMapUtils.CASETYPE_ISOLATED_PLACE_STR) return vm.$t('cases.being-isolated');

                    return "";
                }

                function getStatusShowContent(info) {
                    return info.is_discharge === "Y" ?
                        `<div><span>${vm.$t('cases.discharge-date')}: </span>${TimeUtils.formatCovidDataTime(info.date_discharge)}</div>`
                        : (
                            info.is_dead === "Y" ?
                                `<div><span>${vm.$t('cases.dead-date')}: </span>${TimeUtils.formatCovidDataTime(info.date_dead)}</div>`
                                : `<div><span>${vm.$t('cases.treatment-place')}: </span>${data.hospital}</div>`

                        )
                }

                let contentStr = "";

                switch (data.caseType) {
                    case LMapUtils.SEARCH_STR:
                        contentStr = `<div class="content-wrapper">
                                     <div><span>${i18n.t('map.address')}: </span>${data.label}</div>
                                     <div><span>${i18n.t('map.coordinate')}: </span>(${data.y}, ${data.x})</div>
                                </div>`;
                        break;
                    case LMapUtils.VIETNAM_STR:
                        contentStr = `<div class="content-wrapper">
                                    <div><span>${i18n.t('map.address')}: </span>${StringUtils.formatData(data.placeName)}</div>
                                    <div><span>${i18n.t('map.belong-to-nation')}: </span>${i18n.t('places.vn')}</div>
                                </div>`;
                        break;
                    case LMapUtils.USER_STR:
                        contentStr = `<div class="content-wrapper">
                                    <div><span>${data.placeName}</span></div>
                                </div>`;
                        break;
                    case LMapUtils.CASETYPE_SUSPECTED_CASE_STR:
                        contentStr = `<div class="content-wrapper">
                                    <div><span>${i18n.t('map.address')}: </span>${StringUtils.formatData(data.address_location)}</div>
                                    <div><span>${i18n.t('cases.status')}: </span>${formatCurrentstatus(data)}</div>
                                </div>`;
                        break;
                    case LMapUtils.CASETYPE_ISOLATED_PLACE_STR:
                        contentStr = `<div class="content-wrapper">
                                    <div><span>${i18n.t('map.address')}: </span>${StringUtils.formatData(data.address_location)}</div>
                                    <div><span>${i18n.t('cases.isolated-date')}: </span>${TimeUtils.formatCovidDataTime(data.confirm_date)}</div>
                                    <div><span>${i18n.t('cases.status')}: </span>${formatCurrentstatus(data)}</div>
                                    <div><span>${i18n.t('cases.note')}: </span>${StringUtils.formatData(data.router)}</div>
                                </div>`;
                        break;
                    default:
                        contentStr = `<div class="content-wrapper">
                                    <div><span>${i18n.t('cases.case-num')}: </span>${StringUtils.formatData(data.case_no)}</div>
                                    <div><span>${i18n.t('general.city-or-province')}: </span>${StringUtils.formatData(data.province)}</div>
                                    <div><span>${i18n.t('cases.confirmed-date')}: </span>${TimeUtils.formatCovidDataTime(data.confirm_date)}</div>
                                    <div><span>${i18n.t('general.age')}: </span>${StringUtils.formatData(data.age)}</div>
                                    <div><span>${i18n.t('general.gender')}: </span>${StringUtils.formatData(data.gender)}</div>
                                    <div><span>${i18n.t('cases.nationality')}: </span>${StringUtils.formatData(data.national)}</div>
                                    <div><span>${i18n.t('cases.status')}: </span>${formatCurrentstatus(data)}</div>
                                    ${getStatusShowContent(data)}
                                    <div><span>${i18n.t('cases.infected-from')}: </span>${StringUtils.formatData(data.ref_case_no)}</div>
                                    <div><span>${i18n.t('cases.infected-to')}: </span>${StringUtils.formatData(data.related_case_no)}</div>
                                    <div><span>${i18n.t('cases.route')}: </span>${StringUtils.formatData(data.router)}</div>
                                    <div class="bonus-options">
                                        <button class="option-button" id="button-related-${data.case_no}">${i18n.t('cases.see-all-relations')}</button>
                                        <button class="option-button" id="button-selecting-${data.case_no}">${i18n.t('cases.zoom-to-case')}</button>
                                    </div>
                                </div>`;
                        break;
                }

                return {
                    content: contentStr,
                    options: {
                        className: 'covid-marker-popup-custom' // Just for using if needed
                    }
                }
            },
            toggleClusterOnMap(isEnable) {
                Object.keys(this.clusterManager).forEach(key => {
                    if (this.clusterManager[key]) {
                        if (isEnable) {
                            this.clusterManager[key].enableClustering();
                        } else {
                            this.clusterManager[key].disableClustering();
                        }
                    }
                });
            },
            clearOldMapDatas() {
                Object.keys(this.clusterManager).forEach(key => {
                    if (this.clusterManager[key] != null) {
                        this.clusterManager[key].clearLayers();
                    }
                });
            },
            onSelectedMarker(index) {

                const data = this.covidData[index];
                const marker = this.covidMarkers[index];

                if (marker !== this.selectingMarker.marker) {
                    // We need target selected marker will show on the top, and reset all current selecting marker z-index in details mode (not in normal mode)
                    LMapUtils.setZIndexForMarker(marker, '', true);
                    if (this.selectingMarker.marker != null)
                        LMapUtils.setZIndexForMarker(
                            this.selectingMarker.marker,
                            this.covidData[this.selectingMarker.index].caseType
                        );

                    // We need remove selecting markers here because maybe we choose other marker when you're still in details mode
                    if (this.covidMarkersShowingInDetails.length > 0) this.clearShowingMarkers();

                    let relationship = this.getRelatedMarkers(data);
                    relationship.indexes.forEach(si => {
                        const tMarker = this.covidMarkers[parseInt(si)];
                        if (tMarker) this.covidMarkersShowingInDetails.push(tMarker);
                    });
                    // We will push the selected marker to the last of showing list
                    this.covidMarkersShowingInDetails.push(marker);

                    // We remove all current cluster --> remove all current markers on map in normal mode
                    Object.keys(this.clusterManager).forEach(key => {
                        if (this.isCheckedInFilter[key]) this.lMap.removeLayer(this.clusterManager[key]);
                    });

                    // Then we add temporary showing markers
                    this.covidMarkersShowingInDetails.forEach(marker => this.lMap.addLayer(marker));

                    // After added, we open selected marker's popup
                    marker.openPopup();

                    this.selectingMarker.index = index;

                    this.linkMarkerToRelations(marker, relationship.relations)
                } else {
                    this.selectingMarker.marker.openPopup();
                }

                // We bind events for buttons inside marker's popup after it is opened
                const buttonRelated = document.getElementById(`button-related-${data.case_no}`);
                const buttonSelecting = document.getElementById(`button-selecting-${data.case_no}`);
                buttonRelated.onclick = () => this.zoomToAllRelatedCase();
                buttonSelecting.onclick = () => LMapUtils.setViewMapToPosition(this.lMap, data.position);
            },
            callUnselectedMarker() {
                if (this.selectingMarker.marker != null) {

                    LMapUtils.setZIndexForMarker(
                        this.selectingMarker.marker,
                        this.covidData[this.selectingMarker.index].caseType
                    );

                    this.selectingMarker = {
                        marker: null,
                        index: null,
                        relationMarkers: []
                    }
                }
            },
            onUnselectedMarker() {

                LDrawUtils.clear(this.lMap);

                this.clearShowingMarkers();

                Object.keys(this.clusterManager).forEach(key => {
                    if (this.isCheckedInFilter[key]) this.lMap.addLayer(this.clusterManager[key]);
                });

                if (this.isRequestGetDataInQueue) {
                    this.doGetData();
                    this.setIntervalGetData();
                }
            },
            clearShowingMarkers() {
                this.covidMarkersShowingInDetails.forEach(marker => this.lMap.removeLayer(marker));
                this.covidMarkersShowingInDetails = [];
            },
            getRelatedMarkers(data) {

                let refIndexes = data.refCasesArrayIdxs;
                let relatedIndexes = data.relatedCaseArrayIdxs;

                let relations = [];
                let indexes = [];

                refIndexes.forEach(index => {
                    const tMarker = this.covidMarkers[index];

                    if (tMarker) {
                        relations.push({
                            marker: tMarker,
                            type: 'ref'
                        });

                        if (!indexes.indexOf(index) >= 0) indexes.push(index)
                    }
                });

                relatedIndexes.forEach(index => {
                    const tMarker = this.covidMarkers[index];

                    if (tMarker) {
                        relations.push({
                            marker: tMarker,
                            type: 'related'
                        });

                        if (!indexes.indexOf(index) >= 0) indexes.push(index)
                    }
                });

                return {
                    indexes: indexes,
                    relations: relations
                }
            },
            linkMarkerToRelations(marker, relations) {

                LDrawUtils.clear(this.lMap);

                var relationsMarkers = [];
                relations.forEach(r => relationsMarkers.push(r.marker));

                this.selectingMarker.marker = marker;
                this.selectingMarker.relationMarkers = [marker, ...relationsMarkers];

                if (this.mapSettings.autoBoundRelations) this.zoomToAllRelatedCase(false);

                relations.forEach(r => {
                    if (r.type === 'related') LDrawUtils.drawSimpleAntPathBetweenTwoMarkers(marker, r.marker, this.lMap);
                    else LDrawUtils.drawSimpleAntPathBetweenTwoMarkers(r.marker, marker, this.lMap)
                })
            },
            zoomToAllRelatedCase(closePopup = true) {
                const markers = this.selectingMarker.relationMarkers;

                if (!LMapUtils.isMapBoundsMarkers(this.lMap, markers)) {
                    LMapUtils.fitBoundMarkers(this.lMap, markers);
                }

                if (closePopup) this.selectingMarker.marker.closePopup();
            },

            /**
             * DATA HANDLE FUNCTIONS
             */
            setIntervalGetData() {
                this.getDataInterval = setInterval(() => {
                    if (this.selectingMarker.marker == null) this.doGetData();
                    else {
                        this.isRequestGetDataInQueue = true;
                        clearInterval(this.getDataInterval);
                    }
                }, this.intervalTime);
            },
            doGetData() {
                this.isRequestGetDataInQueue = false;
                this.GET_VIETNAM_COVID_DATA();
                this.GET_VIETNAM_COVID_SUMMARY();
            },


            /**
             * FUNCTIONS HANDLE USER DEVICE LOCATION
             */

            putMarkerToDeviceLocation(location) {

                if (this.userLocation.marker != null) this.lMap.removeLayer(this.userLocation.marker);

                if (location == null) {
                    NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('errors.failed-locate'), i18n.t('errors.cant-get-your-location')));
                    return;
                }

                let marker = this.generateSingleMarker({
                    position: location,
                    placeName: i18n.t('map.you-are-here'),
                    caseType: LMapUtils.USER_STR
                });
                marker.addTo(this.lMap);

                this.userLocation.marker = marker;
            },

            centerToDeviceLocation(location = LMapUtils.USER_LOCATION) {
                if (location != null) {
                    LMapUtils.setViewMapToPosition(this.lMap, location);
                    this.putMarkerToDeviceLocation(location)
                } else LMapUtils.getUserCurrentLocation(
                    position => {
                        this.centerToDeviceLocation(position);
                        this.putMarkerToDeviceLocation(position)
                    },
                    error => {
                        LogUtils.e(error);
                        NotificationUtils.notify(NotificationUtils.getFailToGetDeviceLocationNotification());
                    }
                );
            },


            /**
             * FUNCTIONS HANDLE VIETNAM PLACES LOCATION
             */

            putMarkerToVietnamPlace(place) {
                let marker = this.generateSingleMarker(place);
                marker.addTo(this.lMap);
            },
            putVietNamIslandMarkers() {
                this.putMarkerToVietnamPlace({
                    position: LMapUtils.VIETNAM_PARACEL_ISLAND_POSITION,
                    placeName: i18n.t('map.paracel-islands'),
                    caseType: LMapUtils.VIETNAM_STR
                });

                this.putMarkerToVietnamPlace({
                    position: LMapUtils.VIETNAM_SPRATLY_ISLAND_POSITION,
                    placeName: i18n.t('map.spratly-islands'),
                    caseType: LMapUtils.VIETNAM_STR
                })
            },


            /**
             * FUNCTIONS HANDLE SEARCH PLACE
             */

            onSelectedNewSearchPlace(newPlace) {

                if (newPlace.tag === LMapUtils.AUTOCOMPLETE_CASE_TAG) {
                    LMapUtils.setViewMapToPosition(this.lMap, this.covidData[newPlace.caseIndex].position);
                    this.covidMarkers[newPlace.caseIndex].fire('click');
                } else {
                    if (this.searchedPlace.marker != null)
                        this.lMap.removeLayer(this.searchedPlace.marker);

                    this.searchedPlace.place = newPlace;
                    this.putMarkerToSearchedPlace();
                }
            },
            putMarkerToSearchedPlace() {

                let place = this.searchedPlace.place;
                let data = {
                    ...place,
                    caseType: LMapUtils.SEARCH_STR,
                    position: [place.x, place.y]
                };
                let marker = this.generateSingleMarker(data);
                marker.addTo(this.lMap);
                marker.fire('click');

                this.searchedPlace.marker = marker;

                LMapUtils.setViewMapToPosition(this.lMap, data.position);
            },


            /**
             * OTHER FUNCTIONS
             */
            toggleFilterCases(caseType, isChecked) {
                this.isCheckedInFilter[caseType] = isChecked;

                if (isChecked) this.lMap.addLayer(this.clusterManager[caseType]);
                else this.lMap.removeLayer(this.clusterManager[caseType]);
            },
            openMapSettings() {
                this.$refs["modal-settings"].show();
            }
        }
    }


    // TODO: distance in path...
</script>
