<template>
    <div class="other-feature-ask">
        <div class="feature-img"></div>
        <div class="feature-main">
            <h6 class="main-title">{{usefulFeaturesI18n}}</h6>
            <small class="main-desc">{{usefulFeaturesDescI18n}}</small>
            <vs-button-group class="mt-2">
                <vs-button color="rgb(59,176,60)" relief
                           @click="goToVietnamDashboard()">
                    {{dashboardI18n}}
                </vs-button>
                <vs-button color="rgb(59,176,60)" relief
                           @click="goToDataCenter()">
                    {{dataCenterI18n}}
                </vs-button>
            </vs-button-group>
            <div class="main-do-not-remind" @click="saveDoNotRemind()"> {{notRemindAgainI18n}}</div>
        </div>
    </div>
</template>

<script>
    import i18n from '../../../i18n'
    import router from '../../../router'
    import LStorageUtils from "../../../utils/LStorageUtils";

    export default {
        name: "UsefulFeaturesAsk",
        computed: {
            dashboardI18n() {
                return i18n.t('general.dashboard')
            },
            dataCenterI18n() {
                return i18n.t('general.data-center')
            },
            notRemindAgainI18n() {
                return i18n.t('general.not-remind-again')
            },
            usefulFeaturesI18n() {
                return i18n.t('hints.useful-features')
            },
            usefulFeaturesDescI18n() {
                return i18n.t('hints.useful-features-desc')
            },
        },
        methods: {

            goToVietnamDashboard() {
                router.push('/dashboard/vietnam');
            },
            goToDataCenter() {
                router.push('/dashboard/data-center?iso=VN');
            },

            saveDoNotRemind() {
                LStorageUtils.saveRemindFeature(false);
            }
        }
    }
</script>
