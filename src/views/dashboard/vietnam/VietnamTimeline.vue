<template>
    <div class="news-wrapper container">
        <router-link to="/dashboard/vietnam" class="d-flex align-items-center mb-2">
            <i class="fas fa-chevron-left mr-2"></i>
            <span>{{$t('general.back')}}</span>
        </router-link>
        <DashboardCustomCard classes="mt-3" :title="$t('dashboard.body.covid19-timeline')" :show-link="false"
                             :sub-title="$t('dashboard.timeline.description')">
            <hr class="hr-bold-head"/>

            <CovidTimeline class="mx-1 mx-sm-3 mx-md-5" :data="vnCovidTimeline"/>
        </DashboardCustomCard>
    </div>
</template>

<script>
    import Vuex from "vuex";
    import DashboardCustomCard from "../../../components/dashboard/widgets/cards/DashboardCustomCard";
    import DashboardUtils from "../../../utils/DashboardUtils";
    import EventBusUtils from "../../../utils/EventBusUtils";
    import CovidTimeline from "../../../components/dashboard/widgets/CovidTimeline";

    export default {
        name: "VietnamTimeline",
        components: {CovidTimeline, DashboardCustomCard},
        data() {
            return {
                getDataInterval: null,
                intervalTime: DashboardUtils.DASHBOARD_TIME_REFRESH_DATA
            }
        },
        computed: {
            ...Vuex.mapGetters(['vnCovidTimeline'])
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
                'GET_VIETNAM_COVID_TIMELINE'
            ]),

            /**
             * DATA HANDLE FUNCTIONS
             */
            setIntervalGetData() {
                this.getDataInterval = setInterval(this.doGetData, this.intervalTime);
            },
            doGetData() {
                this.GET_VIETNAM_COVID_TIMELINE();
            }
        }
    }
</script>
