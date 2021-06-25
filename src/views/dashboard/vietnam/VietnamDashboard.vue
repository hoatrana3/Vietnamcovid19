<template>
    <div class="dashboard-wrapper vietnam-dashboard-wrapper container-fluid">
        <div class="row">
            <div class="col-lg-8">
                <div class="body-main-side">
                    <div class="case-overview-wrapper">
                        <div class="row">
                            <div class="col-md-3 col-6">
                                <CaseTotalCard icon="fas fa-virus" variant="case-total"
                                               :text="$t('cases.confirmed')"
                                               :total="vnCovidSummary.total_case"
                                               :addition="vnCovidSummary.total_case_new"/>
                            </div>
                            <div class="col-md-3 col-6">
                                <CaseTotalCard icon="fas fa-hospital" variant="case-active"
                                               :text="$t('cases.being-treated')"
                                               :total="vnCovidSummary.total_case_active"/>
                            </div>
                            <div class="col-md-3 col-6">
                                <CaseTotalCard icon="fas fa-heart" variant="case-discharge"
                                               :text="$t('cases.recovered')"
                                               :total="vnCovidSummary.total_discharge"/>
                            </div>
                            <div class="col-md-3 col-6">
                                <CaseTotalCard icon="fas fa-heart-broken" variant="case-dead"
                                               :text="$t('cases.dead')"
                                               :total="vnCovidSummary.total_dead"/>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <SeeMoreVietnamAlert/>
                        </div>
                        <div class="col-md-12">
                            <DashboardCustomCard :title="$t('dashboard.body.cases-overview')"
                                                 :sub-title="$t('dashboard.body.cases-chart-tracking')">
                                <apexchart type="area" height="500"
                                           :options="caseStatisticsChartInfo.chartOptions"
                                           :series="caseStatisticsChartInfo.series">
                                </apexchart>
                            </DashboardCustomCard>
                        </div>

                        <div class="col-md-6">
                            <DashboardCustomCard :title="$t('general.age')"
                                                 :sub-title="$t('dashboard.body.distribution-by', [($t('general.age').toLowerCase())])">
                                <apexchart type="bar" height="385" class="mt-3"
                                           :options="ageStatisticsChartInfo.chartOptions"
                                           :series="ageStatisticsChartInfo.series">
                                </apexchart>
                            </DashboardCustomCard>
                        </div>

                        <div class="col-md-6">
                            <DashboardCustomCard :title="$t('general.gender')"
                                                 :sub-title="$t('dashboard.body.distribution-by', [($t('general.gender').toLowerCase())])">
                                <div class="show-type-hint"><b>{{$t('hints.hint')}}: </b>{{$t('gender.select-gender-to-see-more')}}
                                </div>
                                <div id="gender-amchart"></div>
                            </DashboardCustomCard>
                        </div>

                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <DashboardCustomCard :title="$t('general.city-or-province')"
                                                         :sub-title="$t('dashboard.body.distribution-by', [($t('general.city-or-province').toLowerCase())])">
                                        <apexchart type="bar" height="700" class="mt-3"
                                                   :options="provinceStatisticsChartInfo.chartOptions"
                                                   :series="provinceStatisticsChartInfo.series">
                                        </apexchart>
                                    </DashboardCustomCard>
                                </div>
                                <div class="col-md-12">
                                    <DashboardCustomCard :title="$t('general.infection-source')"
                                                         :sub-title="$t('dashboard.body.distribution-by', [($t('general.infection-source').toLowerCase())])">
                                        <apexchart type="bar" height="583" class="mt-3"
                                                   :options="sourceNationStatisticsChartInfo.chartOptions"
                                                   :series="sourceNationStatisticsChartInfo.series">
                                        </apexchart>
                                    </DashboardCustomCard>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <DashboardCustomCard :title="$t('general.treatment-place')"
                                                 :sub-title="$t('dashboard.body.distribution-by', [($t('general.treatment-place').toLowerCase())])">
                                <apexchart type="bar" height="1460" class="mt-3"
                                           :options="hospitalStatisticsChartInfo.chartOptions"
                                           :series="hospitalStatisticsChartInfo.series">
                                </apexchart>
                            </DashboardCustomCard>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="body-feed-side">
                    <div class="row">
                        <div class="col-12">
                            <BoldHeadHrTitle :title="$t('dashboard.news.lastest-news')" :has-head-right="true">
                                <template slot="head-right">
                                    <router-link to="/dashboard/vietnam/news">{{$t('general.see-all')}} ({{
                                        vnCovidNews.length }})
                                    </router-link>
                                </template>
                            </BoldHeadHrTitle>
                            <div class="news-post-wrapper">
                                <ul class="list-unstyled mb-0">
                                    <CustomNewsMedia v-for="(news, index) in newsPostToShow" :key="index"
                                                     :title="news.title" :link="news.link" :img-source="news.image_link"
                                                     :created-time="news.created_at" :news-type="news.type_new"
                                                     :classes="'dashboard-responsive'"/>
                                </ul>
                            </div>
                        </div>

                        <div class="col-12">
                            <BoldHeadHrTitle :title="$t('general.social')" classes="mt-5"/>
                            <div id="fb-group-wrapper"></div>
                        </div>

                        <div class="col-12">
                            <BoldHeadHrTitle :title="$t('dashboard.body.covid19-timeline')" classes="mt-5"
                                             :has-head-right="true">
                                <template slot="head-right">
                                    <router-link to="/dashboard/vietnam/timeline">{{$t('general.see-all')}}
                                    </router-link>
                                </template>
                            </BoldHeadHrTitle>
                            <div class="timeline-wrapper">
                                <CovidTimeline :data="vnCovidTimeline"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vuex from 'vuex';
    import CaseTotalCard from "../../../components/dashboard/widgets/cards/CaseTotalCard";
    import BoldHeadHrTitle from "../../../components/dashboard/widgets/horizontalRules/BoldHeadHrTitle";
    import DashboardUtils from "../../../utils/DashboardUtils";
    import FbGroupShareModel from "../../../utils/models/FbGroupShareModel";
    import StringUtils from "../../../utils/StringUtils";
    import CustomNewsMedia from "../../../components/dashboard/widgets/CustomNewsMedia";
    import TimeUtils from "../../../utils/TimeUtils";
    import DashboardCustomCard from "../../../components/dashboard/widgets/cards/DashboardCustomCard";
    import DeviceUtils from "../../../utils/DeviceUtils";
    import CovidTimeline from "../../../components/dashboard/widgets/CovidTimeline";
    import NumeralUtils from "../../../utils/NumeralUtils";

    import * as am4core from '@amcharts/amcharts4/core.js';
    import * as am4charts from '@amcharts/amcharts4/charts.js';
    import am4themes_animated from '@amcharts/amcharts4/themes/animated.js';
    import SeeMoreVietnamAlert from "../../../components/dashboard/widgets/alerts/SeeMoreVietnamAlert";

    am4core.useTheme(am4themes_animated);

    export default {
        name: "VietnamDashboard",
        components: {
            SeeMoreVietnamAlert,
            CovidTimeline, DashboardCustomCard, CustomNewsMedia, BoldHeadHrTitle, CaseTotalCard},
        data() {
            return {
                getDataInterval: null,
                intervalTime: DashboardUtils.DASHBOARD_TIME_REFRESH_DATA,

                caseStatisticsChartInfo: {
                    series: [
                        {
                            name: this.$t('cases.confirmed'),
                            data: []
                        },
                        {
                            name: this.$t('cases.being-treated'),
                            data: []
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: []
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: []
                        }
                    ],
                    chartOptions: {
                        chart: {
                            height: 500,
                            type: 'area',
                            toolbar: {
                                tools: {
                                    download: false
                                },
                                autoSelected: 'pan'
                            }
                        },
                        legend: {
                            offsetY: 10,
                            itemMargin: {
                                vertical: 5
                            }
                        },
                        colors: ['#c30037', '#0059c0', '#00cd7e', '#6e3d6a'],
                        dataLabels: {
                            enabled: true,
                            formatter: (val) => {
                                return NumeralUtils.formatCommonNumber(val)
                            }
                        },
                        stroke: {
                            curve: 'smooth'
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shadeIntensity: 1,
                                inverseColors: false,
                                opacityFrom: 0.45,
                                opacityTo: 0.05,
                                stops: [20, 100, 100, 100]
                            },
                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                format: 'dd/MM/yyyy'
                            },
                            min: TimeUtils.getCurrentMoment().subtract(DeviceUtils.isUsingMobileOrTablet() ? 7 : 14, 'days').unix() * 1000
                        },
                        yaxis: {
                            title: {
                                text: this.$t('general.number-of-case')
                            },
                            labels: {
                                formatter: (val) => {
                                    return NumeralUtils.formatCommonNumber(val)
                                }
                            }
                        },
                        tooltip: {
                            x: {
                                format: 'dd/MM/yyyy'
                            },
                            y: {
                                formatter: (val) => {
                                    return NumeralUtils.formatCommonNumber(val)
                                }
                            }
                        },
                    }
                },

                provinceStatisticsChartInfo: {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: []
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: []
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: []
                        }
                    ],
                    chartOptions: {
                        chart: {
                            height: 700,
                            type: 'bar',
                            stacked: true,
                            toolbar: {
                                show: false
                            }
                        },
                        plotOptions: {
                            bar: {
                                barHeight: '100%',
                                horizontal: true
                            }
                        },
                        legend: {
                            position: 'top'
                        },
                        colors: ['#78cdff', '#82ff8a', '#cb9eef'],
                        dataLabels: {
                            enabled: true,
                            style: {
                                colors: ['#393939']
                            },
                            formatter: (val) => {
                                return val
                            },
                            offsetX: 0
                        },
                        stroke: {
                            width: 1,
                            colors: ['#fff']
                        },
                        xaxis: {
                            title: {
                                text: this.$t('general.number-of-case')
                            },
                            categories: [],
                        },
                        yaxis: {
                            labels: {
                                show: true,
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            }
                        },
                        tooltip: {
                            x: {
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            },
                            y: {
                                formatter: (val) => {
                                    return `${val} ${this.$t('general.short-cases')}`
                                }
                            }
                        }
                    }
                },

                sourceNationStatisticsChartInfo: {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: []
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: []
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: []
                        }
                    ],
                    chartOptions: {
                        chart: {
                            height: 583,
                            type: 'bar',
                            stacked: true,
                            toolbar: {
                                show: false
                            }
                        },
                        plotOptions: {
                            bar: {
                                barHeight: '100%',
                                horizontal: true
                            }
                        },
                        legend: {
                            position: 'top'
                        },
                        colors: ['#78cdff', '#82ff8a', '#cb9eef'],
                        dataLabels: {
                            enabled: true,
                            style: {
                                colors: ['#393939']
                            },
                            formatter: (val) => {
                                return val
                            },
                            offsetX: 0
                        },
                        stroke: {
                            width: 1,
                            colors: ['#fff']
                        },
                        xaxis: {
                            title: {
                                text: this.$t('general.number-of-case')
                            },
                            categories: []
                        },
                        yaxis: {
                            labels: {
                                show: true,
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            }
                        },
                        tooltip: {
                            x: {
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            },
                            y: {
                                formatter: (val) => {
                                    return `${val} ${this.$t('general.short-cases')}`
                                }
                            }
                        }
                    }
                },

                hospitalStatisticsChartInfo: {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: []
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: []
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: []
                        }
                    ],
                    chartOptions: {
                        chart: {
                            height: 1460,
                            type: 'bar',
                            stacked: true,
                            toolbar: {
                                show: false
                            }
                        },
                        plotOptions: {
                            bar: {
                                barHeight: '100%',
                                horizontal: true
                            }
                        },
                        legend: {
                            position: 'top'
                        },
                        colors: ['#78cdff', '#82ff8a', '#cb9eef'],
                        dataLabels: {
                            enabled: true,
                            style: {
                                colors: ['#393939']
                            },
                            formatter: (val) => {
                                return val
                            },
                            offsetX: 0
                        },
                        stroke: {
                            width: 1,
                            colors: ['#fff']
                        },
                        xaxis: {
                            title: {
                                text: this.$t('general.number-of-case')
                            },
                            categories: []
                        },
                        yaxis: {
                            labels: {
                                show: true,
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            }
                        },
                        tooltip: {
                            x: {
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            },
                            y: {
                                formatter: (val) => {
                                    return `${val} ${this.$t('general.short-cases')}`
                                }
                            }
                        }
                    }
                },

                genderStatisticsChartInfo: {
                    container: null,
                    gChart: {chart: null, series: null, selectedSlice: null, hoveredSlice: null},
                    dChart: {chart: null, series: null, selectedSlice: null, hoveredSlice: null},
                    line1: null,
                    line2: null
                },

                ageStatisticsChartInfo: {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: []
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: []
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: []
                        }
                    ],
                    chartOptions: {
                        chart: {
                            height: 385,
                            type: 'bar',
                            stacked: true,
                            toolbar: {
                                show: false
                            }
                        },
                        plotOptions: {
                            bar: {
                                barHeight: '100%',
                                horizontal: true
                            }
                        },
                        legend: {
                            position: 'top'
                        },
                        colors: ['#78cdff', '#82ff8a', '#cb9eef'],
                        dataLabels: {
                            enabled: true,
                            style: {
                                colors: ['#393939']
                            },
                            formatter: (val) => {
                                return val
                            },
                            offsetX: 0
                        },
                        stroke: {
                            width: 1,
                            colors: ['#fff']
                        },
                        xaxis: {
                            title: {
                                text: this.$t('general.number-of-case')
                            },
                            categories: []
                        },
                        yaxis: {
                            labels: {
                                show: true,
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            }
                        },
                        tooltip: {
                            x: {
                                formatter: (value) => {
                                    return StringUtils.isEmpty(value) ? this.$t('general.undefined') : value
                                }
                            },
                            y: {
                                formatter: (val) => {
                                    return `${val} ${this.$t('general.short-cases')}`
                                }
                            }
                        }
                    }
                },
            }
        },
        computed: {
            ...Vuex.mapGetters(['vnCovidSummary', 'vnCovidTypeStatistics', 'vnCovidNews', 'vnCovidTimeline']),

            caseStatistics() {
                return this.$store.getters.vnCovidCaseStatistics;
            },

            provinceStatistics() {
                return this.vnCovidTypeStatistics.province
            },

            hospitalStatistics() {
                return this.vnCovidTypeStatistics.hospital
            },

            sourceNationStatistics() {
                return this.vnCovidTypeStatistics.sourceNation
            },

            genderStatistics() {
                return this.vnCovidTypeStatistics.gender
            },

            ageStatistics() {
                return this.vnCovidTypeStatistics.age
            },

            newsPostToShow() {
                let res = [];

                if (this.vnCovidNews.length > 0) {
                    for (let index = 0; index < 5; ++index)
                        res.push(this.vnCovidNews[index]);
                }

                return res;
            }
        },
        watch: {
            caseStatistics() {
                this.setCaseStatisticsChartInfo();
            },

            provinceStatistics() {
                this.setProvinceStatisticsChartInfo();
            },

            hospitalStatistics() {
                this.setHospitalStatisticsChartInfo();
            },

            sourceNationStatistics() {
                this.setSourceNationStatisticsChartInfo();
            },

            genderStatistics() {
                this.setGenderStatisticsChartInfo();
            },

            ageStatistics() {
                this.setAgeStatisticsChartInfo();
            }
        },
        created() {
            this.doGetData();
            this.setIntervalGetData();
        },
        mounted() {
            this.setFbShareGroup();

            this.setCaseStatisticsChartInfo();
            this.setProvinceStatisticsChartInfo();
            this.setHospitalStatisticsChartInfo();
            this.setSourceNationStatisticsChartInfo();
            this.setGenderStatisticsChartInfo();
            this.setAgeStatisticsChartInfo();
        },
        beforeDestroy() {
            clearInterval(this.getDataInterval);

            this.genderStatisticsChartInfo.gChart.chart.dispose();
            this.genderStatisticsChartInfo.dChart.chart.dispose();
            this.genderStatisticsChartInfo.container.dispose()
        },
        methods: {
            ...Vuex.mapActions([
                'GET_VIETNAM_COVID_SUMMARY',
                'GET_VIETNAM_COVID_CASE_STATISTICS',
                'GET_VIETNAM_COVID_TYPE_STATISTICS',
                'GET_VIETNAM_COVID_NEWS',
                'GET_VIETNAM_COVID_TIMELINE'
            ]),

            /**
             * DATA HANDLE FUNCTIONS
             */
            setIntervalGetData() {
                this.getDataInterval = setInterval(this.doGetData, this.intervalTime);
            },
            doGetData() {
                this.GET_VIETNAM_COVID_SUMMARY();
                this.GET_VIETNAM_COVID_CASE_STATISTICS();
                this.GET_VIETNAM_COVID_TYPE_STATISTICS();
                this.GET_VIETNAM_COVID_NEWS();
                this.GET_VIETNAM_COVID_TIMELINE();
            },

            /**
             * MAIN FUNCTIONS
             */
            setCaseStatisticsChartInfo() {

                const totalCaseData = [];
                const activeCaseData = [];
                const recoverCaseData = [];
                const deathCaseData = [];

                this.caseStatistics.total.forEach(t => {
                    totalCaseData.push({
                        x: t.dataDate,
                        y: t.count
                    });
                });
                this.caseStatistics.active.forEach(a => {
                    activeCaseData.push({
                        x: a.dataDate,
                        y: a.count
                    });
                });
                this.caseStatistics.recover.forEach(r =>
                    recoverCaseData.push({
                        x: r.dataDate,
                        y: r.count
                    })
                );
                this.caseStatistics.death.forEach(d =>
                    deathCaseData.push({
                        x: d.dataDate,
                        y: d.count
                    })
                );

                this.caseStatisticsChartInfo = {
                    ...this.caseStatisticsChartInfo,

                    series: [
                        {
                            name: this.$t('cases.confirmed'),
                            data: totalCaseData
                        },
                        {
                            name: this.$t('cases.being-treated'),
                            data: activeCaseData
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: recoverCaseData
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: deathCaseData
                        }
                    ]
                };
            },

            setProvinceStatisticsChartInfo() {

                const provinceData = {
                    active: [],
                    recovered: [],
                    dead: []
                };
                const provinceLabels = [];

                this.provinceStatistics.forEach(s => {
                    provinceData.active.push(s.count_active);
                    provinceData.recovered.push(s.count_recover);
                    provinceData.dead.push(s.count_death);
                    provinceLabels.push(s.province)
                });

                this.provinceStatisticsChartInfo = {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: provinceData.active
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: provinceData.recovered
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: provinceData.dead
                        }
                    ],
                    chartOptions: {
                        xaxis: {
                            categories: provinceLabels
                        }
                    }
                }
            },

            setSourceNationStatisticsChartInfo() {

                const sourceNationData = {
                    active: [],
                    recovered: [],
                    dead: []
                };
                const sourceNationLabels = [];

                this.sourceNationStatistics.forEach(s => {
                    sourceNationData.active.push(s.count_active);
                    sourceNationData.recovered.push(s.count_recover);
                    sourceNationData.dead.push(s.count_death);
                    sourceNationLabels.push(s.source_national)
                });

                this.sourceNationStatisticsChartInfo = {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: sourceNationData.active
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: sourceNationData.recovered
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: sourceNationData.dead
                        }
                    ],
                    chartOptions: {
                        xaxis: {
                            categories: sourceNationLabels
                        }
                    }
                }
            },

            setHospitalStatisticsChartInfo() {

                const hospitalData = {
                    active: [],
                    recovered: [],
                    dead: []
                };
                const hospitalLabels = [];

                this.hospitalStatistics.forEach(s => {
                    hospitalData.active.push(s.count_active);
                    hospitalData.recovered.push(s.count_recover);
                    hospitalData.dead.push(s.count_death);
                    hospitalLabels.push(s.hospital)
                });

                this.hospitalStatisticsChartInfo = {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: hospitalData.active
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: hospitalData.recovered
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: hospitalData.dead
                        }
                    ],
                    chartOptions: {
                        xaxis: {
                            categories: hospitalLabels
                        }
                    }
                }
            },

            setGenderStatisticsChartInfo() {
                // We use amchart instead of apexchart for this chart, so the code is diffirent !!!

                const vm = this;

                function selectGenderSlice(dataItem) {

                    const container = vm.genderStatisticsChartInfo.container;
                    const dChart = vm.genderStatisticsChartInfo.dChart;
                    const gChart = vm.genderStatisticsChartInfo.gChart;

                    if (dataItem.slice === gChart.selectedSlice) return;

                    gChart.selectedSlice = dataItem.slice;

                    dChart.selectedSlice = null;
                    dChart.chart.data = dataItem.dataContext.subData;
                    dChart.series.appear();

                    let middleAngle = gChart.selectedSlice.middleAngle;
                    let firstAngle = gChart.series.slices.getIndex(0).startAngle;

                    const extraAngle = container.layout === 'vertical' ? 90 : 0;

                    let animationLine1 = gChart.series.animate([{
                        property: "startAngle",
                        to: firstAngle - middleAngle + extraAngle
                    }, {
                        property: "endAngle",
                        to: firstAngle - middleAngle + extraAngle + 360
                    }], 600, am4core.ease.sinOut);
                    animationLine1.events.on("animationprogress", updateLines);

                    gChart.selectedSlice.events.on("transformed", updateLines);

                    let animationLine2 = dChart.chart.animate({
                        property: "dx",
                        from: -container.pixelWidth / 2,
                        to: 0
                    }, 1000, am4core.ease.elasticOut);
                    animationLine2.events.on("animationprogress", updateLines);
                }

                function updateLines() {
                    const container = vm.genderStatisticsChartInfo.container;
                    const gChart = vm.genderStatisticsChartInfo.gChart;
                    const dChart = vm.genderStatisticsChartInfo.dChart;
                    const line1 = vm.genderStatisticsChartInfo.line1;
                    const line2 = vm.genderStatisticsChartInfo.line2;

                    if (gChart.selectedSlice) {
                        let p11 = {
                            x: gChart.selectedSlice.radius * am4core.math.cos(gChart.selectedSlice.startAngle),
                            y: gChart.selectedSlice.radius * am4core.math.sin(gChart.selectedSlice.startAngle)
                        };
                        let p12 = {
                            x: gChart.selectedSlice.radius * am4core.math.cos(gChart.selectedSlice.startAngle + gChart.selectedSlice.arc),
                            y: gChart.selectedSlice.radius * am4core.math.sin(gChart.selectedSlice.startAngle + gChart.selectedSlice.arc)
                        };

                        p11 = am4core.utils.spritePointToSvg(p11, gChart.selectedSlice);
                        p12 = am4core.utils.spritePointToSvg(p12, gChart.selectedSlice);

                        let p21 = {x: 0, y: -dChart.series.pixelRadius};
                        let p22 = {x: 0, y: dChart.series.pixelRadius};

                        if (container.layout === 'vertical') {
                            p21 = {x: dChart.series.pixelRadius, y: 0};
                            p22 = {x: -dChart.series.pixelRadius, y: 0};
                        }

                        p21 = am4core.utils.spritePointToSvg(p21, dChart.series);
                        p22 = am4core.utils.spritePointToSvg(p22, dChart.series);

                        line1.x1 = p11.x;
                        line1.x2 = p21.x;
                        line1.y1 = p11.y;
                        line1.y2 = p21.y;

                        line2.x1 = p12.x;
                        line2.x2 = p22.x;
                        line2.y1 = p12.y;
                        line2.y2 = p22.y;
                    }
                }

                function hideSliceTooltip(selectedSlice) {
                    if (selectedSlice != null) {
                        selectedSlice.tooltip.hide();
                        selectedSlice.tooltipText = "";
                    }
                }

                function showSliceTooltip(selectedSlice) {
                    if (selectedSlice != null) {
                        selectedSlice.tooltipText = "[font-size: 0.8em]{category}[/]\n[bold]{value} ({value.percent.formatNumber('#.#')}%)[/]";
                        selectedSlice.showTooltip();
                    }
                }

                // Format stored data to suit with chart
                const genderData = {
                    male: {confirmed: 0, active: 0, recovered: 0, death: 0},
                    female: {confirmed: 0, active: 0, recovered: 0, death: 0}
                };
                this.genderStatistics.forEach(s => {
                    if (s.gender === "Nam") {
                        genderData.male.active += s.count_active;
                        genderData.male.recovered += s.count_recover;
                        genderData.male.death += s.count_death;
                    } else if (s.gender === "Nữ") {
                        genderData.female.active += s.count_active;
                        genderData.female.recovered += s.count_recover;
                        genderData.female.death += s.count_death;
                    }
                });
                genderData.male.confirmed = genderData.male.active + genderData.male.recovered + genderData.male.death;
                genderData.female.confirmed = genderData.female.active + genderData.female.recovered + genderData.female.death;

                const genderChartData = [
                    {
                        gender: "Nam",
                        confirmed: genderData.male.confirmed,
                        color: am4core.color("#3BB03C"),
                        subData: [
                            {
                                type: this.$t('cases.being-treated'),
                                value: genderData.male.active,
                                color: am4core.color("#78cdff")
                            },
                            {
                                type: this.$t('cases.recovered'),
                                value: genderData.male.recovered,
                                color: am4core.color("#82ff8a")
                            },
                            {
                                type: this.$t('cases.dead'),
                                value: genderData.male.death,
                                color: am4core.color("#cb9eef")
                            }
                        ]
                    },
                    {
                        gender: "Nữ",
                        confirmed: genderData.female.confirmed,
                        color: am4core.color("#BBD036"),
                        subData: [
                            {
                                type: this.$t('cases.being-treated'),
                                value: genderData.female.active,
                                color: am4core.color("#78cdff")
                            },
                            {
                                type: this.$t('cases.recovered'),
                                value: genderData.female.recovered,
                                color: am4core.color("#82ff8a")
                            },
                            {
                                type: this.$t('cases.dead'),
                                value: genderData.female.death,
                                color: am4core.color("#cb9eef")
                            }
                        ]
                    }
                ];

                if (this.genderStatisticsChartInfo.container == null) {

                    const sInfo = this.genderStatisticsChartInfo;
                    sInfo.container = am4core.create("gender-amchart", am4core.Container);

                    // Container for charts
                    const container = sInfo.container;
                    container.width = am4core.percent(100);
                    container.height = am4core.percent(100);
                    container.layout = DeviceUtils.isUsingMobileOrTablet() ? "vertical" : "horizontal";

                    // Gender chart
                    const gChart = sInfo.gChart;
                    gChart.chart = container.createChild(am4charts.PieChart);
                    gChart.chart.width = am4core.percent(50);
                    gChart.chart.radius = am4core.percent(80);
                    gChart.chart.align = "center";
                    gChart.chart.valign = "middle";

                    gChart.chart.data = genderChartData;

                    gChart.series = gChart.chart.series.push(new am4charts.PieSeries());
                    gChart.series.dataFields.value = "confirmed";
                    gChart.series.dataFields.category = "gender";
                    gChart.series.slices.template.propertyFields.fill = "color";
                    gChart.series.slices.template.states.getKey("active").properties.shiftRadius = 0;
                    gChart.series.alignLabels = false;
                    gChart.series.ticks.template.disabled = true;
                    gChart.series.labels.template.radius = am4core.percent(-40);
                    gChart.series.labels.template.fill = am4core.color("#000");
                    gChart.series.labels.template.text = "{category}\n[bold font-size: 1.1em]{value}[/]";
                    gChart.series.labels.template.fontSize = "0.8em";
                    gChart.series.slices.template.tooltipText = "";
                    gChart.series.slices.template.alwaysShowTooltip = true;

                    gChart.series.labels.template.adapter.add("radius", (radius, target) => {
                        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                            return 0;
                        }
                        return radius;
                    });
                    gChart.series.labels.template.adapter.add("fill", (color, target) => {
                        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                            return am4core.color("#000");
                        }
                        return color;
                    });
                    gChart.series.slices.template.events.on("hit", (e) => {
                        hideSliceTooltip(gChart.selectedSlice);
                        hideSliceTooltip(gChart.hoveredSlice);

                        selectGenderSlice(e.target.dataItem);

                        showSliceTooltip(gChart.selectedSlice);
                    });
                    gChart.series.slices.template.events.on("over", (e) => {
                        if (gChart.hoveredSlice !== gChart.selectedSlice)
                            hideSliceTooltip(gChart.hoveredSlice);

                        gChart.hoveredSlice = e.target;

                        showSliceTooltip(gChart.hoveredSlice);
                    });
                    gChart.series.slices.template.events.on("out", () => {
                        if (gChart.hoveredSlice !== gChart.selectedSlice)
                            hideSliceTooltip(gChart.hoveredSlice);
                    });
                    gChart.chart.events.on("datavalidated", () => {
                        setTimeout(() => {
                            selectGenderSlice(gChart.series.dataItems.getIndex(0));
                        }, 2000);
                    });

                    // Details chart
                    const dChart = sInfo.dChart;
                    dChart.chart = container.createChild(am4charts.PieChart);
                    dChart.chart.width = am4core.percent(100);
                    dChart.chart.radius = am4core.percent(90);
                    dChart.chart.align = "center";
                    dChart.chart.valign = "middle";

                    dChart.series = dChart.chart.series.push(new am4charts.PieSeries());
                    dChart.series.dataFields.value = "value";
                    dChart.series.dataFields.category = "type";
                    dChart.series.slices.template.propertyFields.fill = "color";
                    dChart.series.slices.template.states.getKey("active").properties.shiftRadius = 0;
                    dChart.series.labels.template.radius = am4core.percent(-40);
                    dChart.series.labels.template.fill = am4core.color("#000");
                    dChart.series.labels.template.text = "{category}\n[bold font-size: 1.5em]{value}[/]";
                    dChart.series.ticks.template.disabled = true;
                    dChart.series.alignLabels = false;
                    dChart.series.labels.template.fontSize = "0.8em";
                    dChart.series.slices.template.tooltipText = "";
                    dChart.series.slices.template.alwaysShowTooltip = true;

                    dChart.series.events.on("positionchanged", updateLines);

                    dChart.series.labels.template.adapter.add("radius", (radius, target) => {
                        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                            return 0;
                        }
                        return radius;
                    });
                    dChart.series.labels.template.adapter.add("fill", (color, target) => {
                        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                            return am4core.color("#000");
                        }
                        return color;
                    });
                    dChart.series.slices.template.events.on("hit", (e) => {
                        hideSliceTooltip(dChart.selectedSlice);
                        hideSliceTooltip(dChart.hoveredSlice);

                        dChart.selectedSlice = e.target;

                        showSliceTooltip(dChart.selectedSlice);
                    });
                    dChart.series.slices.template.events.on("over", (e) => {
                        if (dChart.hoveredSlice !== dChart.selectedSlice)
                            hideSliceTooltip(dChart.hoveredSlice);

                        dChart.hoveredSlice = e.target;

                        showSliceTooltip(dChart.hoveredSlice);
                    });
                    dChart.series.slices.template.events.on("out", () => {
                        if (dChart.hoveredSlice !== dChart.selectedSlice)
                            hideSliceTooltip(dChart.hoveredSlice);
                    });

                    let interfaceColors = new am4core.InterfaceColorSet();

                    sInfo.line1 = container.createChild(am4core.Line);
                    sInfo.line1.strokeDasharray = "2,2";
                    sInfo.line1.strokeOpacity = 0.5;
                    sInfo.line1.stroke = interfaceColors.getFor("alternativeBackground");
                    sInfo.line1.isMeasured = false;

                    sInfo.line2 = container.createChild(am4core.Line);
                    sInfo.line2.strokeDasharray = "2,2";
                    sInfo.line2.strokeOpacity = 0.5;
                    sInfo.line2.stroke = interfaceColors.getFor("alternativeBackground");
                    sInfo.line2.isMeasured = false;

                    // Hide all tooltips when click outside
                    am4core.getInteraction().body.events.on("hit", () => {
                        hideSliceTooltip(gChart.selectedSlice);
                        hideSliceTooltip(dChart.selectedSlice);

                        hideSliceTooltip(gChart.hoveredSlice);
                        hideSliceTooltip(dChart.hoveredSlice);
                    });
                } else {
                    const gChart = this.genderStatisticsChartInfo.gChart;

                    am4core.array.each(gChart.chart.data, (item, index) => {
                        item.confirmed = genderChartData[index].confirmed;
                        item.subData = genderChartData[index].subData;
                    });

                    gChart.chart.invalidateRawData();
                }
            },

            setAgeStatisticsChartInfo() {

                const ageData = {
                    active: [],
                    recovered: [],
                    dead: []
                };
                const ageLabels = [];

                this.ageStatistics.forEach(s => {
                    ageData.active.push(s.count_active);
                    ageData.recovered.push(s.count_recover);
                    ageData.dead.push(s.count_death);
                    ageLabels.push(s.age)
                });

                this.ageStatisticsChartInfo = {
                    series: [
                        {
                            name: this.$t('cases.being-treated'),
                            data: ageData.active
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: ageData.recovered
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: ageData.dead
                        }
                    ],
                    chartOptions: {
                        xaxis: {
                            categories: ageLabels
                        }
                    }
                }
            },

            setFbShareGroup() {
                const domNode = DashboardUtils.getFacebookGroupShareModel().domNode;
                const domParent = document.getElementById('fb-group-wrapper');

                domParent.appendChild(domNode);
                FbGroupShareModel.showDomNode(domNode);
            }
        }
    }
</script>
