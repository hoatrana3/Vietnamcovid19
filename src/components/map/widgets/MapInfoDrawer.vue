<template>
    <div class="info-drawer-wrapper">
        <div class="drawer-wrapper" :class="isShowingInfoDrawer ? '' : 'drawer-hide'">

            <div class="drawer-topbar">
                <i class="fas fa-times drawer-close" @click="hide"></i>
                <img width="30px" height="30px" src="/assets/img/map/vietnam-map.svg" alt="">
                <span class="ml-2">vietnamcovid19.info</span>
            </div>

            <div class="drawer-header">
                <div class="wave"></div>
                <div class="drawer-header-content">
                    <div v-html="$t('map.if-drawer.map-title')"></div>
                </div>
            </div>

            <div class="drawer-hightlights container">
                <b-row>
                    <b-col md="6" class="content-wrapper">
                        <a class="hightlight-card card-social-fb"
                           href="https://www.facebook.com/groups/538220833757944/" target="_blank">
                            <i class="h-card-icon fab fa-facebook"></i>
                            <h6 class="h-card-title">{{$t('map.if-drawer.fb-social')}}</h6>
                        </a>
                    </b-col>
                    <b-col md="6" class="content-wrapper">
                        <a class="hightlight-card card-social-help"
                           href="http://1400.vn/toan-dan-ung-ho-phong-chong-dich-benh-covid-19-pen1169" target="_blank">
                            <i class="h-card-icon fas fa-heart"></i>
                            <h6 class="h-card-title">{{$t('map.if-drawer.donate-prevent-pandemic')}}</h6>
                        </a>
                    </b-col>
                    <b-col md="6" class="content-wrapper">
                        <a class="hightlight-card card-social-feedback"
                           href="http://tiny.cc/bxlflz" target="_blank">
                            <i class="h-card-icon fas fa-comment-alt"></i>
                            <h6 class="h-card-title">{{$t('map.if-drawer.community-feedback')}}</h6>
                        </a>
                    </b-col>
                    <b-col md="6" class="content-wrapper">
                        <a class="hightlight-card card-social-fb"
                           href="https://www.facebook.com/thongtinchinhphu" target="_blank">
                            <i class="h-card-icon fab fa-facebook-f"></i>
                            <h6 class="h-card-title">{{$t('map.if-drawer.government-info')}}</h6>
                        </a>
                    </b-col>
                </b-row>
            </div>

            <PageShareSection/>

            <div class="drawer-policy container">
                <h5>{{$t('general.terms-of-use')}}</h5>
                <button type="button" class="btn-open-policy" @click="OPEN_TERMS">
                    <i class="fas fa-eye"></i>
                    <span>{{$t('general.read-now')}}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import Vuex from 'vuex';
    import PageShareSection from "../../PageShareSection";

    export default {
        name: "MapInfoDrawer",
        components: {PageShareSection},
        computed: {
            ...Vuex.mapGetters(['isShowingInfoDrawer'])
        },
        created() {

            document.addEventListener('keydown', (event) => {
                const key = event.key; // Or const {key} = event; in ES6+
                if (key === "Escape") {
                    this.HIDE_INFO_DRAWER();
                }
            });
        },
        methods: {
            ...Vuex.mapActions(['HIDE_INFO_DRAWER', 'OPEN_TERMS']),

            hide() {
                this.HIDE_INFO_DRAWER();
            }
        }
    }
</script>
