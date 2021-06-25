<template>
    <div id="covid-map-container">
        <LCovidMap/>
        <MapInfoDrawer/>
    </div>
</template>

<script>

    import MapInfoDrawer from "../../components/map/widgets/MapInfoDrawer";
    import LCovidMap from "../../components/map/LCovidMap";
    import NotificationUtils from "../../utils/NotificationUtils";
    import UsefulFeaturesAsk from "../../components/map/widgets/UsefulFeaturesAsk";
    import LStorageUtils from "../../utils/LStorageUtils";

    export default {
        name: "CovidMap",
        components: {LCovidMap, MapInfoDrawer},
        data() {
            return {
                notifyUsefulFeature: null
            }
        },
        mounted() {
            this.notifyUsefulFeatures()
        },
        beforeDestroy() {
            if (this.notifyUsefulFeature != null) this.notifyUsefulFeature.close()
        },
        methods: {
            notifyUsefulFeatures() {
                const isRemindAgain = LStorageUtils.getRemindFeature() == null || LStorageUtils.getRemindFeature() === "YES";

                if (isRemindAgain)
                    this.notifyUsefulFeature = NotificationUtils.notify({
                        duration: 'none',
                        content: UsefulFeaturesAsk,
                        position: 'bottom-center',
                        clickClose: true,
                        progress: 'auto'
                    })
            }
        }
    }
</script>
