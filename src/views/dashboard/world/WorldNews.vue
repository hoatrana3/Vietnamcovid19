<template>
    <div class="news-wrapper container">
        <router-link to="/dashboard/world" class="d-flex align-items-center mb-2">
            <i class="fas fa-chevron-left mr-2"></i>
            <span>{{$t('general.back')}}</span>
        </router-link>
        <DashboardCustomCard classes="mt-3" :title="$t('dashboard.news.lastest-news')" :show-link="false"
                             :sub-title="$t('dashboard.news.description')">
            <hr class="hr-bold-head"/>

            <div class="row">
                <div class="col-lg-6" v-for="(news, index) in globCovidNews" :key="index">
                    <CustomNewsMedia :title="news.title" :description="news.description"
                                     :link="news.link" :img-source="news.image_link"
                                     :news-type="news.type_new" :created-time="news.created_at"/>
                </div>
            </div>
        </DashboardCustomCard>
    </div>
</template>

<script>
    import Vuex from "vuex";
    import CustomNewsMedia from "../../../components/dashboard/widgets/CustomNewsMedia";
    import DashboardCustomCard from "../../../components/dashboard/widgets/cards/DashboardCustomCard";
    import DashboardUtils from "../../../utils/DashboardUtils";
    import EventBusUtils from "../../../utils/EventBusUtils";

    export default {
        name: "WorldNews",
        components: {DashboardCustomCard, CustomNewsMedia},
        data() {
            return {
                getDataInterval: null,
                intervalTime: DashboardUtils.DASHBOARD_TIME_REFRESH_DATA
            }
        },
        computed: {
            ...Vuex.mapGetters(['globCovidNews'])
        },
        created() {
            this.doGetData();
            this.setIntervalGetData();
        },
        mounted() {
            EventBusUtils.bus.$emit(EventBusUtils.BUS_KEY_SCROLL_TO_TOP);
        },
        beforeDestroy() {
            clearInterval(this.getDataInterval);
        },
        methods: {
            ...Vuex.mapActions([
                'GET_WORLD_COVID_NEWS'
            ]),

            /**
             * DATA HANDLE FUNCTIONS
             */
            setIntervalGetData() {
                this.getDataInterval = setInterval(this.doGetData, this.intervalTime);
            },
            doGetData() {
                this.GET_WORLD_COVID_NEWS();
            }
        }
    }
</script>
