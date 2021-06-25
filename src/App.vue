<template>
    <div id="app">
        <router-view/>
        <Loader :isShow="isLoading"/>
        <TermsOfUseDialog />
    </div>
</template>
<script>
    import Vuex from "vuex";
    import Loader from "./components/Loader";
    import DashboardUtils from "./utils/DashboardUtils";
    import TermsOfUseDialog from "./components/TermsOfUseDialog";
    import EventBusUtils from "./utils/EventBusUtils";

    export default {
        components: {TermsOfUseDialog, Loader},
        computed: {
            ...Vuex.mapGetters(['isLoading'])
        },
        created() {
            // We need do this in the top of the application
            // this.$store.dispatch('INIT_YOUTUBE', () => {
            //     this.$store.dispatch('LOAD_YOUTUBE_API')
            // });
        },
        mounted() {

            // We need init this in the top of the application
            DashboardUtils.initFaceBookGroupShare();

            // Handle API Executer
            EventBusUtils.bus.$on(EventBusUtils.BUS_KEY_START_EXECUTE_API, () => {
                this.$store.dispatch('OPEN_LOADING')
            });
            EventBusUtils.bus.$on(EventBusUtils.BUS_KEY_FINISH_EXECUTE_API, () => {
                this.$store.dispatch('CLOSE_LOADING')
            });
        }
    }
</script>
