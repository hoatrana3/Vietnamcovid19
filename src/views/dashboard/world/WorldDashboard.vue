<template>
    <div class="dashboard-wrapper world-dashboard-wrapper container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="body-main-side">
                    <div class="row">
                        <div class="col-md-9">
                            <div class="case-overview-wrapper">
                                <div class="row">
                                    <div class="col-lg-3 col-6">
                                        <CaseTotalCard icon="fas fa-virus" variant="case-total"
                                                       :text="$t('cases.confirmed')"
                                                       :total="globCovidSummary.totalCase"
                                                       :addition="globCovidSummary.newCase"/>
                                    </div>
                                    <div class="col-lg-3 col-6">
                                        <CaseTotalCard icon="fas fa-hospital" variant="case-active"
                                                       :text="$t('cases.being-treated')"
                                                       :total="globCovidSummary.activeCase" has-more-under>
                                            <template slot="more-under-content">
                                                <ul class="ml-3" style="list-style-type:square;">
                                                    <li class="mb-2">
                                                        <h6 class="text-success d-inline-block">
                                                            <b>
                                                                {{ mildConditionActiveCase.total }}
                                                            </b>
                                                            <small>({{ mildConditionActiveCase.percentage }})</small>
                                                        </h6>
                                                        <span> {{$t('cases.in-mild-condition')}}</span>
                                                    </li>
                                                    <li class="mb-2">
                                                        <h6 class="text-danger d-inline-block">
                                                            <b>
                                                                {{ seriousConditionActiveCase.total }}
                                                            </b>
                                                            <small>({{ seriousConditionActiveCase.percentage }})</small>
                                                        </h6>
                                                        <span> {{$t('cases.in-serious-condition')}}</span>
                                                    </li>
                                                </ul>
                                            </template>
                                        </CaseTotalCard>
                                    </div>
                                    <div class="col-lg-3 col-6">
                                        <CaseTotalCard icon="fas fa-heart" variant="case-discharge"
                                                       :text="$t('cases.recovered')"
                                                       :total="globCovidSummary.totalRecovered"/>
                                    </div>
                                    <div class="col-lg-3 col-6">
                                        <CaseTotalCard icon="fas fa-heart-broken" variant="case-dead"
                                                       :text="$t('cases.dead')"
                                                       :total="globCovidSummary.totalDeaths"
                                                       :addition="globCovidSummary.newDeaths"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-3"></div>
                        <div class="col-12">
                            <SeeMoreWorldAlert/>
                        </div>
                        <div class="col-12">
                            <DashboardCustomCard
                                    :title="$t('dashboard.body.data-sheet-by', [($t('places.regions').toLowerCase())])"
                                    :sub-title="$t('dashboard.body.tracking-covid19-data-in', [($t('places.world-regions').toLowerCase())])">
                                <WorldRegionCovidDataTable/>
                            </DashboardCustomCard>
                        </div>
                        <div class="col-12">
                            <DashboardCustomCard
                                    :title="$t('dashboard.body.data-sheet-by', [($t('places.g8-nations'))])"
                                    :sub-title="$t('dashboard.body.tracking-covid19-data-in', [($t('places.g8-nations'))])">
                                <G8CovidDataTable/>
                            </DashboardCustomCard>
                        </div>
                        <div class="col-12">
                            <DashboardCustomCard
                                    :title="$t('dashboard.body.data-sheet-by', [($t('places.g20-nations'))])"
                                    :sub-title="$t('dashboard.body.tracking-covid19-data-in', [($t('places.g20-nations'))])">
                                <G20CovidDataTable/>
                            </DashboardCustomCard>
                        </div>
                        <div class="col-12">
                            <DashboardCustomCard
                                    :title="$t('dashboard.body.data-sheet-by', [($t('places.nations').toLowerCase())])"
                                    :sub-title="$t('dashboard.body.tracking-covid19-data-in', [($t('places.world-nations').toLowerCase())])">
                                <WorldCovidDataTable/>
                            </DashboardCustomCard>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="body-feed-side">
                    <div class="row">
                        <div class="col-md-12">
                            <BoldHeadHrTitle :title="$t('dashboard.news.lastest-news')" :has-head-right="true">
                                <template slot="head-right">
                                    <router-link to="/dashboard/world/news">{{$t('general.see-all')}} ({{
                                        globCovidNews.length }})
                                    </router-link>
                                </template>
                            </BoldHeadHrTitle>
                            <div class="news-post-wrapper">
                                <ul class="list-unstyled mb-0 row">
                                    <CustomNewsMedia v-for="(news, index) in newsPostToShow" :key="index"
                                                     :title="news.title" :link="news.link" :img-source="news.image_link"
                                                     :created-time="news.created_at" :news-type="news.type_new"
                                                     :classes="'col-md-4 dashboard-responsive'"/>
                                </ul>
                            </div>
                        </div>
                        <!--                        <div class="col-md-8 mt-5 mt-md-0">-->
                        <!--                            <BoldHeadHrTitle :title="$t('dashboard.youtube.covid-on-youtube')"></BoldHeadHrTitle>-->
                        <!--                            <div class="youtube-list-wrapper">-->
                        <!--                                <div class="row" v-if="globCovidYoutube != null">-->
                        <!--                                    <CardYoutubeVideo v-for="(video, index) in globCovidYoutube.items"-->
                        <!--                                                      :key="index" :data="video" :is-full="index === showingVideo"-->
                        <!--                                                      @onClick="() => changeShowingVideo(index)"-->
                        <!--                                                      :classes="`${index === showingVideo ? 'col-12 order-xl-0' : 'col-xl-6 order-xl-1'} col-lg-12`"/>-->
                        <!--                                </div>-->
                        <!--                            </div>-->
                        <!--                        </div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CaseTotalCard from "../../../components/dashboard/widgets/cards/CaseTotalCard";
    import Vuex from "vuex";
    import NumeralUtils from "../../../utils/NumeralUtils";
    import DashboardCustomCard from "../../../components/dashboard/widgets/cards/DashboardCustomCard";
    import WorldRegionCovidDataTable from "../../../components/dashboard/widgets/tables/WorldRegionCovidDataTable";
    import DashboardUtils from "../../../utils/DashboardUtils";
    import WorldCovidDataTable from "../../../components/dashboard/widgets/tables/WorldCovidDataTable";
    import BoldHeadHrTitle from "../../../components/dashboard/widgets/horizontalRules/BoldHeadHrTitle";
    import CustomNewsMedia from "../../../components/dashboard/widgets/CustomNewsMedia";
    import TimeUtils from "../../../utils/TimeUtils";
    import SeeMoreWorldAlert from "../../../components/dashboard/widgets/alerts/SeeMoreWorldAlert";
    import G8CovidDataTable from "../../../components/dashboard/widgets/tables/G8CovidDataTable";
    import G20CovidDataTable from "../../../components/dashboard/widgets/tables/G20CovidDataTable";

    export default {
        name: "WorldDashboard",
        components: {
            G20CovidDataTable,
            G8CovidDataTable,
            SeeMoreWorldAlert,
            CustomNewsMedia,
            BoldHeadHrTitle,
            WorldCovidDataTable,
            WorldRegionCovidDataTable, DashboardCustomCard, CaseTotalCard
        },
        data() {
            return {
                getDataInterval: null,
                intervalTime: DashboardUtils.DASHBOARD_TIME_REFRESH_DATA,

                showingVideo: 0
            }
        },
        computed: {
            ...Vuex.mapGetters(['globCovidSummary', 'globCovidNews', 'globCovidYoutube']),

            mildConditionActiveCase() {
                const activeTotal = this.globCovidSummary.activeCase;
                const mildTotal = activeTotal - this.globCovidSummary.seriousCritical;
                const mildPercentage = mildTotal / activeTotal;

                return {
                    total: NumeralUtils.formatCommonNumber(mildTotal),
                    percentage: NumeralUtils.formatCommonPercentage(mildPercentage)
                }
            },

            seriousConditionActiveCase() {
                const activeTotal = this.globCovidSummary.activeCase;
                const seriousTotal = this.globCovidSummary.seriousCritical;
                const seriousPercentage = seriousTotal / activeTotal;

                return {
                    total: NumeralUtils.formatCommonNumber(seriousTotal),
                    percentage: NumeralUtils.formatCommonPercentage(seriousPercentage)
                }
            },

            newsPostToShow() {
                let res = [];

                if (this.globCovidNews.length > 0) {
                    for (let index = 0; index < 6; ++index)
                        res.push(this.globCovidNews[index]);
                }

                return res;
            }
        },
        created() {
            this.doGetData();
            this.setIntervalGetData();
        },
        beforeDestroy() {
            clearInterval(this.getDataInterval);
        },
        methods: {
            ...Vuex.mapActions([
                'GET_WORLD_COVID_DATA',
                'GET_WORLD_COVID_HISTORY_DATA',
                'GET_WORLD_COVID_SUMMARY',
                'GET_WORLD_REGION_COVID_DATA',
                'GET_WORLD_REGION_COVID_HISTORY_DATA',
                'GET_WORLD_COVID_NEWS',
                // 'SEARCH_WORLD_COVID_YOUTUBE'
            ]),

            /**
             * DATA HANDLE FUNCTIONS
             */
            setIntervalGetData() {
                this.getDataInterval = setInterval(this.doGetData, this.intervalTime);
            },
            doGetData() {
                this.GET_WORLD_COVID_SUMMARY();
                this.GET_WORLD_COVID_DATA();
                this.GET_WORLD_REGION_COVID_DATA();
                this.GET_WORLD_COVID_HISTORY_DATA(TimeUtils.getUTCYesterday());
                this.GET_WORLD_REGION_COVID_HISTORY_DATA(TimeUtils.getUTCYesterday());
                this.GET_WORLD_COVID_NEWS();
                // this.SEARCH_WORLD_COVID_YOUTUBE();
            },

            /**
             * MAIN FUNCTIONS
             */
            changeShowingVideo(index) {
                this.showingVideo = index;
            }
        }
    }
</script>
