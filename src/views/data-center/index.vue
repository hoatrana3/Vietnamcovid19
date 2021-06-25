<template>
    <div id="covid-data-center-container">

        <DashboardTopbar :offset-up-to-show="500" :start-hide-point="dataCenterMapChartHeight"
                         :scroll-container="dataCenterContainer" :is-dark="true"/>

        <div id="center-map-wrapper">
            <div id="map-container" ref="map-container"></div>
        </div>

        <div class="center-body">
            <div class="body-top">
                <div class="map-text-date">
                    <datetime
                            type="date"
                            v-model="currentDate"
                            value-zone="local"
                            :phrases="{ok: $t('general.select'), cancel: $t('general.exit')}"
                            :min-datetime="minDate"
                            :max-datetime="maxDate"
                            input-class="custom-datetime-input"
                            auto
                            class="custom-datetime"
                    ></datetime>
                </div>
                <div class="map-options">
                    <i class="fas mr-3" :class="!isInGlobeMode ? 'fa-globe' : 'fa-map'"
                       @click="isInGlobeMode = !isInGlobeMode"></i>
                    <i class="fas mr-3" :class="!isInPerMillionMode ? 'fa-percentage' : 'fa-layer-group'"
                       @click="isInPerMillionMode = !isInPerMillionMode"></i>
                    <i class="fas" :class="!isPlayingHistory ? 'fa-play-circle' : 'fa-pause-circle'"
                       @click="isPlayingHistory = !isPlayingHistory"></i>
                </div>
            </div>
            <div class="body-main row">
                <div class="col-12">
                    <DashboardCustomCard>
                        <template slot="card-before-link">
                            <div class="row">
                                <div class="col-md-4">
                                    <CountryViewAndSelect :country-id.sync="currentCountry.id"/>
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="col-lg-3 col-sm-6 mb-3 mb-lg-0">
                                            <CaseViewTotal :text="$t('cases.confirmed')"
                                                           :is-active="currentType === 'confirmed'"
                                                           variant="case-total"
                                                           @onClick="() => changeDataType('confirmed')"
                                                           :total="currentCountry.data.confirmed"
                                                           :sub-total="getCurrentWorldData().confirmed"/>
                                        </div>
                                        <div class="col-lg-3 col-sm-6 mb-3 mb-lg-0">
                                            <CaseViewTotal :text="$t('cases.being-treated')"
                                                           :is-active="currentType === 'active'"
                                                           variant="case-active"
                                                           @onClick="() => changeDataType('active')"
                                                           :total="currentCountry.data.active"
                                                           :sub-total="getCurrentWorldData().active"/>
                                        </div>
                                        <div class="col-lg-3 col-sm-6 mb-3 mb-lg-0">
                                            <CaseViewTotal :text="$t('cases.recovered')"
                                                           :is-active="currentType === 'recovered'"
                                                           variant="case-discharge"
                                                           @onClick="() => changeDataType('recovered')"
                                                           :total="currentCountry.data.recovered"
                                                           :sub-total="getCurrentWorldData().recovered"/>
                                        </div>
                                        <div class="col-lg-3 col-sm-6 mb-3 mb-lg-0">
                                            <CaseViewTotal :text="$t('cases.dead')"
                                                           :is-active="currentType === 'deaths'"
                                                           variant="case-dead"
                                                           @onClick="() => changeDataType('deaths')"
                                                           :total="currentCountry.data.deaths"
                                                           :sub-total="getCurrentWorldData().deaths"/>
                                        </div>
                                        <div class="col-12">
                                            <vs-button class="float-right mb-3 mt-0 mt-lg-3"
                                                       to="/dashboard/vietnam" v-show="currentCountryId === 'VN'"
                                                       size="small"
                                                       color="rgb(59,176,60)">
                                                <span>{{$t('redirect.go-to-vn-dashboard')}}</span>
                                                <i class="fas fa-arrow-right ml-2"></i>
                                            </vs-button>
                                            <vs-button class="float-right mb-3 mt-0 mt-lg-3"
                                                       to="/map" v-show="currentCountryId === 'VN'"
                                                       size="small"
                                                       color="rgb(59,176,60)">
                                                <span>{{$t('redirect.go-to-vn-map')}}</span>
                                                <i class="fas fa-arrow-right ml-2"></i>
                                            </vs-button>
                                            <vs-button class="float-right mb-3 mt-0 mt-lg-3"
                                                       to="/dashboard/world" v-show="currentCountryId === 'WORLD'"
                                                       size="small"
                                                       color="rgb(59,176,60)">
                                                <span>{{$t('redirect.go-to-world-dashboard')}}</span>
                                                <i class="fas fa-arrow-right ml-2"></i>
                                            </vs-button>
                                            <vs-button class="float-right mb-3 mt-0 mt-lg-3"
                                                       flat size="small" @click="toggleUserManual()"
                                                       :active="isShowingUserManual"
                                                       color="rgb(0,133,1)">
                                                <span>{{$t('hints.user-manual')}}</span>
                                                <i class="fas fa-address-book ml-2"></i>
                                            </vs-button>
                                            <vs-button class="float-right mb-3 mt-0 mt-lg-3"
                                                       flat size="small" @click="toggleNotesOnData()"
                                                       :active="isShowingNotesOnData"
                                                       color="rgb(135,122,0)">
                                                <span>{{$t('hints.notes-on-data')}}</span>
                                                <i class="fas fa-sticky-note ml-2"></i>
                                            </vs-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DashboardCustomCard>
                </div>
                <div class="col-12">
                    <UserManualAlert ref="user-manual-alert" :is-showing.sync="isShowingUserManual"/>
                </div>
                <div class="col-12">
                    <SomeDataNoteAlert ref="notes-on-data-alert" :is-showing.sync="isShowingNotesOnData"/>
                </div>
                <div class="col-12">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-6">
                                    <DashboardCustomCard :title="$t('center.total-cases-by-day')"
                                                         :sub-title="getTitleCurrentCountry()">
                                        <CaseTotalByDayChart ref="case-total-by-day-chart"/>
                                    </DashboardCustomCard>
                                </div>
                                <div class="col-md-6">
                                    <DashboardCustomCard :title="$t('center.changes-total-cases-by-day')"
                                                         :sub-title="getTitleCurrentCountry()">
                                        <CaseChangeByDayChart ref="case-change-by-day-chart"/>
                                    </DashboardCustomCard>
                                </div>
                            </div>
                        </div>
                        <!--                        <div class="col-md-4">-->

                        <!--                        </div>-->
                    </div>
                </div>
            </div>
        </div>

        <ScrollToTopButton :offset-show="halfOfDataCenter" :scroll-container="dataCenterContainer"/>

        <DashboardFooter/>
    </div>
</template>

<script>
    import DashboardCustomCard from "../../components/dashboard/widgets/cards/DashboardCustomCard";
    import * as am4core from '@amcharts/amcharts4/core.js';
    import * as am4maps from '@amcharts/amcharts4/maps.js';
    import am4themes_animated from '@amcharts/amcharts4/themes/animated.js';
    import am4themes_dark from '@amcharts/amcharts4/themes/dark.js';
    import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow.js';
    import am4geodata_data_countries2 from '@amcharts/amcharts4-geodata/data/countries2.js';

    import _ from 'lodash';
    import Vuex from "vuex";
    import CaseViewTotal from "../../components/data-center/widgets/CaseViewTotal";
    import TimeUtils from "../../utils/TimeUtils";
    import DashboardUtils from "../../utils/DashboardUtils";
    import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
    import ScrollToTopButton from "../../components/dashboard/widgets/ScrollToTopButton";
    import DashboardFooter from "../../components/dashboard/DashboardFooter";
    import StringUtils from "../../utils/StringUtils";
    import CaseTotalByDayChart from "../../components/data-center/widgets/charts/CaseTotalByDayChart";
    import CaseChangeByDayChart from "../../components/data-center/widgets/charts/CaseChangeByDayChart";
    import CountryViewAndSelect from "../../components/data-center/widgets/CountryViewAndSelect";
    import UserManualAlert from "../../components/data-center/widgets/alerts/UserManualAlert";
    import SomeDataNoteAlert from "../../components/data-center/widgets/alerts/SomeDataNoteAlert";
    import NotificationUtils from "../../utils/NotificationUtils";
    import LStorageUtils from "../../utils/LStorageUtils";

    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_dark);

    export default {
        name: "CovidDataCenter",
        components: {
            SomeDataNoteAlert,
            UserManualAlert,
            CountryViewAndSelect,
            CaseChangeByDayChart,
            CaseTotalByDayChart,
            DashboardFooter, ScrollToTopButton, DashboardTopbar, CaseViewTotal, DashboardCustomCard
        },
        props: ['initialCountryIso'],
        data() {
            return {

                // For main
                dataCenterContainer: null,
                dataCenterMapChartHeight: 100,

                halfOfDataCenter: 500,

                isShowingUserManual: LStorageUtils.getShowUserManual() == null || LStorageUtils.getShowUserManual() === 'YES',
                isShowingNotesOnData: LStorageUtils.getShowNotesOnData() == null || LStorageUtils.getShowNotesOnData() === 'YES',

                // For amchart charts

                getDataInterval: null,
                intervalTime: DashboardUtils.DASHBOARD_TIME_REFRESH_DATA,
                isFirstTimeGetData: true,

                baseColors: {
                    background: am4core.color("#17263C"),

                    active: am4core.color("#0059c0"),
                    confirmed: am4core.color("#c30037"),
                    recovered: am4core.color("#00cd7e"),
                    deaths: am4core.color("#6e3d6a"),

                    country: am4core.color("#242F3E"),
                    countryStroke: am4core.color("#798292"),

                    buttonStroke: am4core.color("#ffffff"),
                    countryHover: am4core.color("#121824"),
                    activeCountry: am4core.color("#0a0f24")
                },

                mapData: [],
                countryIndexMap: {},

                max: {confirmed: 0, recovered: 0, deaths: 0, active: 0}, // For relative size of bubble
                maxPC: {confirmed: 0, recovered: 0, deaths: 0, active: 0}, // For relative color of polygon

                container: null, // Main container
                mapChart: null, // Big map chart
                polygonSeries: null,
                bubbleSeries: null,
                circle: null,

                isInGlobeMode: false,
                isInPerMillionMode: false,

                isPlayingHistory: false,
                playHistoryInterval: null,

                currentCountry: {
                    id: "",
                    name: "",
                    polygon: null,
                    data: {confirmed: 0, recovered: 0, deaths: 0, active: 0}
                },
                currentDate: TimeUtils.getCurrentTime(TimeUtils.ISO_8601_DATE_ONLY),
                countryDataTimeout: null,
                currentDataIndex: null,
                currentType: "confirmed",
                currentTypeName: ""
            }
        },
        computed: {
            ...Vuex.mapGetters(['allCountries']),

            dataCenter() {
                return this.$store.getters.dataCenter
            },

            totalTimeline() {
                return this.dataCenter.totalTimeline
            },

            worldTimeline() {
                return this.dataCenter.worldTimeline
            },

            countryGeoData() {
                return am4geodata_data_countries2;
            },

            currentCountryId() {
                return this.currentCountry.id
            },

            minDate() {
                if (this.totalTimeline.length > 0) return this.totalTimeline[0].date;

                return "2020-01-22"
            },
            maxDate() {
                if (this.totalTimeline.length > 0) return this.totalTimeline[this.totalTimeline.length - 1].date;

                return TimeUtils.getCurrentTime(TimeUtils.ISO_8601_DATE_ONLY);
            },

            isSelectingWorld() {
                return this.currentCountryId === 'WORLD'
            }
        },
        watch: {
            dataCenter: {

                handler(newVal) {

                    if (newVal.totalTimeline.length > 0 && newVal.worldTimeline.length > 0) {
                        this.prepareData();

                        if (this.isFirstTimeGetData) {
                            this.setupEverything();
                            this.isFirstTimeGetData = false
                        } else {

                            this.updateMapData(this.getDateData(this.currentDataIndex).list);

                            if (this.currentCountry.polygon != null) {
                                const oldPolygon = this.currentCountry.polygon;

                                // Re-select when new data refresh
                                this.currentCountry.polygon = null;
                                this.selectCountry(oldPolygon)
                            }
                        }
                    }
                },
                deep: true
            },

            currentCountryId() {
                if (!StringUtils.isEmpty(this.currentCountry.id)) {

                    if (this.currentCountry.id === "WORLD") this.showWorld();
                    else this.selectCountry(this.polygonSeries.getPolygonById(this.currentCountry.id));
                }
            },

            isInGlobeMode() {
                if (this.mapChart != null) {
                    if (this.isInGlobeMode) {
                        this.mapChart.projection = new am4maps.projections.Orthographic;
                        this.mapChart.backgroundSeries.show();
                        this.mapChart.panBehavior = "rotateLongLat";
                        this.polygonSeries.exclude = [];
                    } else {
                        this.mapChart.projection = new am4maps.projections.Miller;
                        this.mapChart.backgroundSeries.hide();
                        this.mapChart.panBehavior = "move";
                        this.removeAntarctica(this.mapData);
                        this.polygonSeries.data = this.mapData;
                        this.polygonSeries.exclude = ["AQ"];
                    }
                }
            },
            isInPerMillionMode() {
                if (this.isInPerMillionMode) {

                    this.bubbleSeries.hide(0);
                    this.bubbleSeries.interpolationDuration = 0;
                    this.polygonSeries.heatRules.getIndex(0).max = this.baseColors[this.currentType];
                    this.polygonSeries.heatRules.getIndex(0).maxValue = this.maxPC[this.currentType];
                    this.polygonSeries.mapPolygons.template.applyOnClones = true;

                    this.updateCountryTooltip();

                } else {

                    this.polygonSeries.interpolationDuration = 0;
                    this.bubbleSeries.interpolationDuration = 1000;
                    this.bubbleSeries.show();
                    this.polygonSeries.heatRules.getIndex(0).max = this.baseColors.country;
                    this.polygonSeries.mapPolygons.template.tooltipText = undefined;
                }

                this.polygonSeries.mapPolygons.each((mapPolygon) => {

                    mapPolygon.fill = _.clone(mapPolygon.fill);
                    mapPolygon.defaultState.properties.fill = undefined;
                })
            },

            isPlayingHistory() {
                if (this.isPlayingHistory) this.playHistory();
                else this.pauseHistory()
            },

            currentDataIndex() {
                if (this.currentDataIndex != null
                    && this.currentDataIndex <= this.totalTimeline.length - 1) {

                    const totalData = this.totalTimeline[this.currentDataIndex];
                    this.currentDate = totalData.date;

                    this.updateMapData(this.getDateData(this.currentDataIndex).list);
                    this.setCountryData(this.countryIndexMap[this.currentCountryId]);
                }
            },
            currentDate() {
                this.currentDate = TimeUtils.formatTimeWithPattern(this.currentDate, TimeUtils.ISO_8601_FULL, TimeUtils.ISO_8601_DATE_ONLY);

                const totalData = this.totalTimeline[this.currentDataIndex];

                if (totalData != null && totalData.date !== this.currentDate) {

                    const dateIndex = this.totalTimeline.findIndex(data => data.date === this.currentDate);

                    if (dateIndex >= 0) this.currentDataIndex = dateIndex;
                    else this.currentDate = this.totalTimeline[this.currentDataIndex].date;
                }
            }
        },
        created() {

            // I just need to get this data once when come into page
            this.$store.dispatch('GET_ALL_COUNTRIES', () => {

                this.doGetData();
                this.setIntervalGetData();
            });
        },
        mounted() {
            this.dataCenterContainer = document.getElementById('covid-data-center-container');
            if (this.dataCenterContainer != null) this.halfOfDataCenter = this.dataCenterContainer.offsetHeight / 2;

            const mapChartDom = document.getElementById('center-map-wrapper');
            if (mapChartDom != null) this.dataCenterMapChartHeight = mapChartDom.offsetHeight;
        },
        beforeDestroy() {
            clearInterval(this.getDataInterval);
            clearInterval(this.playHistoryInterval);

            this.mapChart.dispose();
            this.container.dispose();
        },
        methods: {
            ...Vuex.mapActions([
                'OPEN_LOADING',
                'CLOSE_LOADING',
                'GET_DATA_CENTER_TOTAL_TIMELINE',
                'GET_DATA_CENTER_WORLD_TIMELINE'
            ]),

            /**
             * DATA HANDLE FUNCTIONS
             */
            setIntervalGetData() {
                this.getDataInterval = setInterval(this.doGetData, this.intervalTime);
            },
            doGetData() {
                // We do not want get new data when we are playing history!!!
                if (!this.isPlayingHistory) {
                    this.GET_DATA_CENTER_TOTAL_TIMELINE();
                    this.GET_DATA_CENTER_WORLD_TIMELINE()
                }
            },

            /**
             * AMCHART FUNCTIONS
             */
            prepareData() {
                this.OPEN_LOADING();

                if (this.currentDataIndex == null) this.currentDataIndex = this.totalTimeline.length - 1;

                // Make a map of country indexes for later use
                this.countryIndexMap = {};

                const list = this.worldTimeline[this.worldTimeline.length - 1].list;
                list.forEach((country, index) => this.countryIndexMap[country.id] = index);

                // Calculated active cases in world data (active = confirmed - recovered)
                this.totalTimeline.forEach(date => date.active = date.confirmed - date.recovered);

                this.mapData = this.getDateData().list;

                // remove items with 0 values for better performance
                for (let i = this.mapData.length - 1; i >= 0; --i) {
                    if (this.mapData[i].confirmed === 0) {
                        this.mapData.splice(i, 1);
                    }
                }

                // The last day will have most
                this.mapData.forEach(data => {
                    if (data.confirmed > this.max.confirmed) this.max.confirmed = data.confirmed;
                    if (data.recovered > this.max.recovered) this.max.recovered = data.recovered;
                    if (data.deaths > this.max.deaths) this.max.deaths = data.deaths;

                    this.max.active = this.max.confirmed;
                });
            },
            setupEverything() {
                this.setupContainer();
                this.setupMapChart();
            },
            setupContainer() {

                // Main container
                // https://www.amcharts.com/docs/v4/concepts/svg-engine/containers/
                this.container = am4core.create(this.$refs['map-container'], am4core.Container);
                this.container.width = am4core.percent(100);
                this.container.height = am4core.percent(100);

                this.container.tooltip = new am4core.Tooltip();
                this.container.tooltip.background.fill = am4core.color("#000000");
                this.container.tooltip.background.stroke = this.baseColors.active;
                this.container.tooltip.fontSize = "0.9em";
                this.container.tooltip.getFillFromObject = false;
                this.container.tooltip.getStrokeFromObject = false;
            },
            setupMapChart() {

                // MAP CHART
                // https://www.amcharts.com/docs/v4/chart-types/map/
                this.mapChart = this.container.createChild(am4maps.MapChart);
                this.mapChart.height = am4core.percent(100);
                this.mapChart.zoomControl = new am4maps.ZoomControl();
                this.mapChart.zoomControl.align = "right";
                this.mapChart.zoomControl.marginRight = 15;
                this.mapChart.zoomControl.valign = "middle";
                this.mapChart.homeGeoPoint = {longitude: 0, latitude: 10};

                // by default minus button zooms out by one step, but we modify the behavior so when user clicks on minus, the map would fully zoom-out and show world data
                this.mapChart.zoomControl.minusButton.events.on("hit", this.showWorld);
                // clicking on a "sea" will also result a full zoom-out
                this.mapChart.seriesContainer.background.events.on("hit", this.showWorld);
                this.mapChart.seriesContainer.background.events.on("over", this.resetHover);
                this.mapChart.seriesContainer.background.fillOpacity = 0;
                this.mapChart.zoomEasing = am4core.ease.sinOut;

                // https://www.amcharts.com/docs/v4/chart-types/map/#Map_data
                // you can use more accurate world map or map of any other country - a wide selection of maps available at: https://github.com/amcharts/amcharts4-geodata
                this.mapChart.geodata = am4geodata_worldLow;

                // Set projection
                // https://www.amcharts.com/docs/v4/chart-types/map/#Setting_projection
                // instead of Miller, you can use Mercator or many other projections available: https://www.amcharts.com/demos/map-using-d3-projections/
                this.mapChart.projection = new am4maps.projections.Miller();
                this.mapChart.panBehavior = "move";

                // when map is globe, background is made visible
                this.mapChart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.05;
                this.mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
                this.mapChart.backgroundSeries.hidden = true;

                // You can have pacific - centered map if you set this to -154.8
                this.mapChart.deltaLongitude = -8;

                this.setupPolygonSeries();
                this.setupBubbleSeries();
            },
            setupPolygonSeries() {

                // Map polygon series (defines how country areas look and behave)
                this.polygonSeries = this.mapChart.series.push(new am4maps.MapPolygonSeries());
                this.polygonSeries.interpolationDuration = 0;

                this.polygonSeries.dataFields.id = "id";
                this.polygonSeries.dataFields.value = "confirmedPC";

                this.polygonSeries.exclude = ["AQ"]; // Antarctica is excluded in non-globe projection
                this.polygonSeries.useGeodata = true;
                this.polygonSeries.nonScalingStroke = true;
                this.polygonSeries.strokeWidth = 0.5;

                // this helps to place bubbles in the visual middle of the area
                this.polygonSeries.calculateVisualCenter = true;
                this.polygonSeries.data = this.mapData;

                let polygonTemplate = this.polygonSeries.mapPolygons.template;
                polygonTemplate.fill = this.baseColors.country;
                polygonTemplate.fillOpacity = 1;
                polygonTemplate.stroke = this.baseColors.countryStroke;
                polygonTemplate.strokeOpacity = 0.15;
                polygonTemplate.setStateOnChildren = true;
                polygonTemplate.tooltipPosition = "fixed";

                polygonTemplate.events.on("hit", this.handleCountryHit);
                polygonTemplate.events.on("over", this.handleCountryOver);
                polygonTemplate.events.on("out", this.handleCountryOut);

                this.polygonSeries.heatRules.push({
                    "target": polygonTemplate,
                    "property": "fill",
                    "min": this.baseColors.country,
                    "max": this.baseColors.country,
                    "dataField": "value"
                });

                // polygon states
                let polygonHoverState = polygonTemplate.states.create("hover");
                polygonHoverState.transitionDuration = 1400;
                polygonHoverState.properties.fill = this.baseColors.countryHover;

                let polygonActiveState = polygonTemplate.states.create("active");
                polygonActiveState.properties.fill = this.baseColors.activeCountry;
            },
            setupBubbleSeries() {

                // Bubble series
                this.bubbleSeries = this.mapChart.series.push(new am4maps.MapImageSeries());
                this.bubbleSeries.data = _.cloneDeep(this.mapData);

                this.bubbleSeries.dataFields.id = "id";
                this.bubbleSeries.dataFields.value = "confirmed";

                // adjust tooltip
                this.bubbleSeries.tooltip.animationDuration = 0;
                this.bubbleSeries.tooltip.showInViewport = false;
                this.bubbleSeries.tooltip.background.fillOpacity = 0.2;
                this.bubbleSeries.tooltip.getStrokeFromObject = true;
                this.bubbleSeries.tooltip.getFillFromObject = false;
                this.bubbleSeries.tooltip.background.fillOpacity = 0.2;
                this.bubbleSeries.tooltip.background.fill = am4core.color("#000000");

                let imageTemplate = this.bubbleSeries.mapImages.template;

                // If you want bubbles to become bigger when zoomed, set this to false
                imageTemplate.nonScaling = true;
                imageTemplate.strokeOpacity = 0;
                imageTemplate.fillOpacity = 0.55;
                imageTemplate.tooltipText = "[bold]{name}:\n{value}[/]";
                imageTemplate.applyOnClones = true;

                imageTemplate.events.on("over", this.handleImageOver);
                imageTemplate.events.on("out", this.handleImageOut);
                imageTemplate.events.on("hit", this.handleImageHit);

                // This is needed for the tooltip to point to the top of the circle instead of the middle
                imageTemplate.adapter.add("tooltipY", (tooltipY, target) => {
                    return -target.children.getIndex(0).radius;
                });

                // When hovered, circles become non-opaque
                let imageHoverState = imageTemplate.states.create("hover");
                imageHoverState.properties.fillOpacity = 1;

                // Add circle inside the image
                this.circle = imageTemplate.createChild(am4core.Circle);

                // This makes the circle to pulsate a bit when showing it
                this.circle.hiddenState.properties.scale = 0.0001;
                this.circle.hiddenState.transitionDuration = 2000;
                this.circle.defaultState.transitionDuration = 2000;
                this.circle.defaultState.transitionEasing = am4core.ease.elasticOut;

                // Later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
                this.circle.applyOnClones = true;

                // Heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
                this.bubbleSeries.heatRules.push({
                    "target": this.circle,
                    "property": "radius",
                    "min": 3,
                    "max": 30,
                    "dataField": "value"
                });

                this.bubbleSeries.events.on("beforedatavalidated", () => {
                    this.OPEN_LOADING();
                });

                // When data items validated, hide 0 value bubbles (because min size is set)
                this.bubbleSeries.events.on("dataitemsvalidated", () => {

                    this.bubbleSeries.dataItems.each((dataItem) => {
                        let mapImage = dataItem.mapImage;
                        let circle = mapImage.children.getIndex(0);

                        if (mapImage.dataItem.value === 0) circle.hide(0);
                        else if (circle.isHidden || circle.isHiding) circle.show();
                    });

                    this.changeDataType(this.currentType);

                    this.CLOSE_LOADING();
                });

                // On bubble series appeared on the map
                this.bubbleSeries.events.on("appeared", () => {

                    if (!StringUtils.isEmpty(this.initialCountryIso)) this.currentCountry.id = this.initialCountryIso;
                    else this.currentCountry.id = 'WORLD';

                    this.updateMapData(this.getDateData(this.currentDataIndex).list);

                    this.CLOSE_LOADING();
                });

                // This places bubbles at the visual center of a country
                imageTemplate.adapter.add("latitude", (latitude, target) => {

                    let polygon = this.polygonSeries.getPolygonById(target.dataItem.id);

                    if (polygon) {
                        target.disabled = false;
                        return polygon.visualLatitude;
                    } else target.disabled = true;

                    return latitude;
                });

                imageTemplate.adapter.add("longitude", (longitude, target) => {

                    let polygon = this.polygonSeries.getPolygonById(target.dataItem.id);

                    if (polygon) {
                        target.disabled = false;
                        return polygon.visualLongitude;
                    } else target.disabled = true;

                    return longitude;
                })
            },

            showWorld() {
                // Show world data

                // Set cases total number for world
                const totalData = this.totalTimeline[this.currentDataIndex];

                if (totalData == null) return;

                this.currentCountry = {
                    id: "WORLD",
                    name: this.$t('places.worldwide'),
                    polygon: null,
                    data: {
                        active: totalData.active,
                        confirmed: totalData.confirmed,
                        deaths: totalData.deaths,
                        recovered: totalData.recovered
                    }
                };

                // Set world's charts
                this.refreshCaseChartsInfo();

                // Reset all hover polygon in map
                this.resetHover();

                if (this.countryDataTimeout) {
                    clearTimeout(this.countryDataTimeout);
                }

                // Make all inactive
                this.polygonSeries.mapPolygons.each((polygon) => {
                    polygon.isActive = false;
                });

                this.mapChart.goHome();
            },

            resetHover() {
                this.polygonSeries.mapPolygons.each((polygon) => {
                    polygon.isHover = false;
                });

                this.bubbleSeries.mapImages.each((image) => {
                    image.isHover = false;
                })
            },

            updateMapData(data) {
                // Update map data

                //Modifying instead of setting new data for a nice animation
                this.bubbleSeries.dataItems.each((dataItem) => {
                    dataItem.dataContext.confirmed = 0;
                    dataItem.dataContext.deaths = 0;
                    dataItem.dataContext.recovered = 0;
                    dataItem.dataContext.active = 0;
                });

                this.maxPC = {active: 0, confirmed: 0, deaths: 0, recovered: 0};

                for (let i = 0; i < data.length; i++) {
                    let di = data[i];
                    let image = this.bubbleSeries.getImageById(di.id);
                    let polygon = this.polygonSeries.getPolygonById(di.id);

                    if (image) {
                        image.dataItem.dataContext.confirmed = di.confirmed;
                        image.dataItem.dataContext.deaths = di.deaths;
                        image.dataItem.dataContext.recovered = di.recovered;
                        image.dataItem.dataContext.active = di.confirmed - di.recovered - di.deaths;
                    }

                    if (polygon) {

                        let country = this.allCountries[polygon.dataItem.dataContext.id];
                        let population = 1;
                        if (country != null) population = country.population;

                        polygon.dataItem.dataContext.confirmedPC = di.confirmed / population * 1000000;
                        polygon.dataItem.dataContext.deathsPC = di.deaths / population * 1000000;
                        polygon.dataItem.dataContext.recoveredPC = di.recovered / population * 1000000;
                        polygon.dataItem.dataContext.active = di.confirmed - di.recovered - di.deaths;
                        polygon.dataItem.dataContext.activePC = polygon.dataItem.dataContext.active / population * 1000000;

                        if (population > 100000) {
                            if (polygon.dataItem.dataContext.confirmedPC > this.maxPC.confirmed) {
                                this.maxPC.confirmed = polygon.dataItem.dataContext.confirmedPC;
                            }
                            if (polygon.dataItem.dataContext.deathsPC > this.maxPC.deaths) {
                                this.maxPC.deaths = polygon.dataItem.dataContext.deathsPC;
                            }
                            if (polygon.dataItem.dataContext.recoveredPC > this.maxPC.recovered) {
                                this.maxPC.recovered = polygon.dataItem.dataContext.recoveredPC;
                            }
                            if (polygon.dataItem.dataContext.activePC > this.maxPC.active) {
                                this.maxPC.active = polygon.dataItem.dataContext.activePC;
                            }
                        }
                    }

                    this.bubbleSeries.heatRules.getIndex(0).maxValue = this.max[this.currentType];
                    this.polygonSeries.heatRules.getIndex(0).maxValue = this.maxPC[this.currentType];

                    this.bubbleSeries.invalidateRawData();
                    this.polygonSeries.invalidateRawData();
                }
            },

            changeDataType(name) {
                // Change data type (active/confirmed/recovered/deaths)

                this.currentType = name;

                switch (name) {
                    case "confirmed":
                        this.currentTypeName = this.$t('cases.confirmed');
                        break;
                    case "active":
                        this.currentTypeName = this.$t('cases.being-treated');
                        break;
                    case "recovered":
                        this.currentTypeName = this.$t('cases.recovered');
                        break;
                    case "deaths":
                        this.currentTypeName = this.$t('cases.dead');
                        break;
                    default:
                        this.currentTypeName = this.$t('general.undefined');
                        break;
                }

                this.bubbleSeries.mapImages.template.tooltipText = "[bold]{name}:\n{value}[/] [font-size:10px] " + this.currentTypeName;

                // Tell series new field name
                this.bubbleSeries.dataFields.value = name;
                this.polygonSeries.dataFields.value = name + "PC";

                this.bubbleSeries.dataItems.each((dataItem) => {
                    dataItem.setValue("value", dataItem.dataContext[this.currentType]);
                });

                this.polygonSeries.dataItems.each((dataItem) => {
                    dataItem.setValue("value", dataItem.dataContext[this.currentType + "PC"]);
                    dataItem.mapPolygon.defaultState.properties.fill = undefined;
                });


                // Change color of bubbles
                // Setting colors on mapImage for tooltip colors
                this.bubbleSeries.mapImages.template.fill = this.baseColors[name];
                this.bubbleSeries.mapImages.template.stroke = this.baseColors[name];

                // First child is circle
                this.bubbleSeries.mapImages.template.children.getIndex(0).fill = this.baseColors[name];

                // Update heat rule's maxValue
                this.bubbleSeries.heatRules.getIndex(0).maxValue = this.max[this.currentType];
                this.polygonSeries.heatRules.getIndex(0).maxValue = this.maxPC[this.currentType];

                // Update per million mode
                if (this.isInPerMillionMode) {
                    this.polygonSeries.heatRules.getIndex(0).max = this.baseColors[name];
                    this.updateCountryTooltip();
                }
            },

            selectCountry(mapPolygon) {
                // Select a country

                if (mapPolygon == null) {
                    NotificationUtils.notify(NotificationUtils.getCountryNotUpdatedNotification());
                    this.currentCountry.id = 'WORLD';
                    return;
                }

                this.resetHover();
                this.polygonSeries.hideTooltip();

                // if the same country is clicked show world, return
                if (this.currentCountry.polygon === mapPolygon) return;

                // make others inactive
                this.polygonSeries.mapPolygons.each((polygon) => {
                    polygon.isActive = false;
                });

                // Save and get current country data
                let countryIndex = this.countryIndexMap[mapPolygon.dataItem.id];
                this.currentCountry.id = mapPolygon.dataItem.id;
                this.currentCountry.name = mapPolygon.dataItem.dataContext.name;
                this.currentCountry.polygon = mapPolygon;

                // clear timeout if there is one
                if (this.countryDataTimeout) {
                    clearTimeout(this.countryDataTimeout);
                }

                // we delay change of data for better performance (so that data is not changed while zooming)
                this.countryDataTimeout = setTimeout(() => {
                    this.setCountryData(countryIndex);
                }, 1000); // you can adjust number, 1000 is one second

                mapPolygon.isActive = true;

                // Meaning it's globe
                if (this.isInGlobeMode) {
                    // Animate deltas (results the map to be rotated to the selected country)
                    if (this.mapChart.zoomLevel !== 1) {
                        this.mapChart.goHome();
                        this.rotateAndZoom(mapPolygon);
                    } else {
                        this.rotateAndZoom(mapPolygon);
                    }
                }
                // If it's not a globe, simply zoom to the country
                else {
                    this.mapChart.zoomToMapObject(mapPolygon, this.getZoomLevel(mapPolygon));
                }
            },
            setCountryData(countryIndex) {

                let di = this.worldTimeline[this.currentDataIndex].list;
                let countryData =
                    this.isSelectingWorld ?
                        this.totalTimeline[this.currentDataIndex] :
                        di[countryIndex];

                if (countryData) {

                    this.currentCountry.data = {
                        confirmed: countryData.confirmed,
                        active: countryData.confirmed - (countryData.recovered + countryData.deaths),
                        recovered: countryData.recovered,
                        deaths: countryData.deaths
                    };
                } else {
                    this.currentCountry.data = {
                        confirmed: 0,
                        active: 0,
                        recovered: 0,
                        deaths: 0
                    }
                }

                this.refreshCaseChartsInfo(countryIndex);
            },

            refreshCaseChartsInfo(countryIndex) {
                this.$refs['case-total-by-day-chart'].refreshChartInfo(countryIndex);
                this.$refs['case-change-by-day-chart'].refreshChartInfo(countryIndex)
            },

            getCurrentWorldData() {

                let worldData = {
                    confirmed: null,
                    active: null,
                    recovered: null,
                    deaths: null
                };

                if (this.isSelectingWorld) return worldData;

                let currentTotal = this.totalTimeline[this.currentDataIndex];

                if (currentTotal) {
                    worldData = {
                        confirmed: currentTotal.confirmed,
                        active: currentTotal.confirmed - (currentTotal.recovered + currentTotal.deaths),
                        recovered: currentTotal.recovered,
                        deaths: currentTotal.deaths
                    }
                }

                return worldData;
            },

            handleImageOver(event) {
                this.rollOverCountry(this.polygonSeries.getPolygonById(event.target.dataItem.id));
            },
            handleImageOut(event) {
                this.rollOutCountry(this.polygonSeries.getPolygonById(event.target.dataItem.id));
            },
            handleImageHit(event) {
                this.selectCountry(this.polygonSeries.getPolygonById(event.target.dataItem.id));
            },
            handleCountryHit(event) {
                this.selectCountry(event.target);
            },
            handleCountryOver(event) {
                this.rollOverCountry(event.target);
            },
            handleCountryOut(event) {
                this.rollOutCountry(event.target);
            },

            rollOverCountry(mapPolygon) {
                // What happens when a country is rolled-over

                this.resetHover();

                if (mapPolygon) {
                    mapPolygon.isHover = true;

                    // make bubble hovered too
                    let image = this.bubbleSeries.getImageById(mapPolygon.dataItem.id);
                    if (image) {
                        image.dataItem.dataContext.name = mapPolygon.dataItem.dataContext.name;
                        image.isHover = true;
                    }
                }
            },
            rollOutCountry(mapPolygon) {
                // What happens when a country is rolled-out

                let image = this.bubbleSeries.getImageById(mapPolygon.dataItem.id);

                this.resetHover();
                if (image) image.isHover = false;
            },
            rotateAndZoom(mapPolygon) {
                // Rotate and zoom

                this.polygonSeries.hideTooltip();

                let animation = this.mapChart.animate([{
                    property: "deltaLongitude",
                    to: -mapPolygon.visualLongitude
                }, {property: "deltaLatitude", to: -mapPolygon.visualLatitude}], 1000);
                animation.events.on("animationended", () => {
                    this.mapChart.zoomToMapObject(mapPolygon, this.getZoomLevel(mapPolygon));
                })
            },
            getZoomLevel(mapPolygon) {
                // Calculate zoom level (default is too close)

                let w = mapPolygon.polygon.bbox.width;
                let h = mapPolygon.polygon.bbox.width;

                // Change 2 to smaller walue for a more close zoom
                return Math.min(this.mapChart.seriesWidth / (w * 2), this.mapChart.seriesHeight / (h * 2))
            },

            getDateData(index) {
                // Function that returns current slide
                // if index is not set, get last slide

                if (index == null) index = this.worldTimeline.length - 1;

                let data = this.worldTimeline[index];
                data.list.forEach(item => item.name = this.idToName(item.id));

                return _.cloneDeep(data);
            },

            updateCountryTooltip() {
                this.polygonSeries.mapPolygons.template.tooltipText =
                    "[bold]{name}:\n{value.formatNumber('#.')}[/] [font-size:10px]"
                    + this.currentTypeName + " " + this.$t('general.ppm')
            },

            playHistory() {

                if (this.currentDataIndex === this.totalTimeline.length - 1) this.currentDataIndex = 0;

                this.playHistoryInterval = setInterval(() => {

                    if (this.currentDataIndex <= this.totalTimeline.length - 1) {
                        this.currentDataIndex++;
                    } else {
                        // Set back to last index
                        this.currentDataIndex = this.totalTimeline.length - 1;

                        this.isPlayingHistory = false;
                        this.pauseHistory()
                    }
                }, 500)
            },
            pauseHistory() {
                if (this.playHistoryInterval != null) clearInterval(this.playHistoryInterval);
                this.playHistoryInterval = null;
            },

            idToName(id) {

                const countryAmchartGeoName = this.countryGeoData[id] ? this.countryGeoData[id].country : (id === "XX" ? "Others" : id);
                const countryRapidApiName = this.allCountries[id] ? this.allCountries[id].name : "";

                return StringUtils.isEmpty(countryRapidApiName) ? countryAmchartGeoName : countryRapidApiName;
            },

            removeAntarctica(mapData) {
                for (var i = mapData.length - 1; i >= 0; i--) {
                    if (mapData[i].id === "AQ") {
                        mapData.splice(i, 1);
                    }
                }
            },

            /**
             * MAIN FUCNTIONS
             */
            getTitleCurrentCountry() {
                if (this.isSelectingWorld) return this.$t('places.around-world');

                return this.$t('places.in-nation', [this.currentCountry.name])
            },

            toggleUserManual() {
                this.isShowingUserManual = !this.isShowingUserManual;

                if (this.isShowingUserManual) {
                    this.$refs['user-manual-alert'].$el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
                }
            },

            toggleNotesOnData() {
                this.isShowingNotesOnData = !this.isShowingNotesOnData;

                if (this.isShowingNotesOnData) {
                    this.$refs['notes-on-data-alert'].$el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
                }
            }
        }
    }

    // TODO:
    // 1. Datetime picker for the day showing (DONE)
    // 2. Added more details and chart (ADDED 2)
    // 3. Use other API instead of amchart API (HMMMM)
    // 4. Add per capital mode (DONE)
    // 5. Auto scroll on doing somethings in page
    // 6. Setup page layout (DONE)
    // 7. Think where to put this page (DONE)
    // 8. Make a button on the top left to open left side bar, make a left sidebar too
    // make a top nav like googleencov to selec country and choose date and open left sidebar
    // 9. Add additional info for selected country, use vuesax alert hiding
    // 10. Add notice about data like Google below of the page (DONE)
    // 11. Lock the name of page and change everything as that name : router, styles, file name, classes,...
    // 12. Add vue trend to card view total
    // 13. Try to find out the way for country view and select component (DONE)
    // 14. Check if whether selected country, or query in router country is exists, find the way to notify
    // 15. API Backup
    // 16. Add button for notice in this page, because we dont want it always show when closed before...
</script>
