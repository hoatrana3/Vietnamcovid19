import Vue from 'vue'
import Vuex from 'vuex'
import CovidMapModule from './modules/CovidMapModule'
import CovidDashboardModule from './modules/CovidDashboardModule'
import CovidDataCenterModule from './modules/CovidDataCenterModule'
import YoutubeApiModule from './modules/YoutubeApiModule'
import PublicApiModule from './modules/PublicApiModule'
import LStorageUtils from "../utils/LStorageUtils";
import i18n from '../i18n';
import router from '../router'
import moment from 'moment'
import {Settings} from "luxon";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        isOpenTerms: false,
        loadingStopTimeout: null,

        isShowingInfoDrawer: false
    },
    getters: {
        isLoading: state => state.isLoading,
        isOpenTerms: state => state.isOpenTerms,
        notification: state => state.notification,
        isShowingInfoDrawer: state => state.isShowingInfoDrawer
    },
    actions: {
        OPEN_LOADING({commit}) {
            commit('openLoading')
        },
        CLOSE_LOADING({commit}) {
            commit('closeLoading')
        },

        OPEN_TERMS({commit}) {
            commit('openTerms');
        },
        CLOSE_TERMS({commit}) {
            commit('closeTerms');
        },

        SHOW_INFO_DRAWER({commit}) {
            commit('showInfoDrawer');
        },
        HIDE_INFO_DRAWER({commit}) {
            commit('hideInfoDrawer');
        },

        SET_LANGUAGE({commit}, payload) {
            commit('setLanguage', payload);
        }
    },
    mutations: {
        openLoading(state) {
            if (state.loadingStopTimeout != null) {
                clearTimeout(state.loadingStopTimeout);
                state.loadingStopTimeout = null
            }

            state.isLoading = true;
        },
        closeLoading(state) {
            if (state.loadingStopTimeout == null) {

                state.loadingStopTimeout = setTimeout(() => {
                    state.isLoading = false;
                    clearTimeout(state.loadingStopTimeout);
                    state.loadingStopTimeout = null
                }, 500);
            }
        },

        openTerms(state) {
            state.isOpenTerms = true;
        },
        closeTerms(state) {
            state.isOpenTerms = false;
        },

        notify(state, newNotification) {
            state.notification = newNotification
        },

        showInfoDrawer(state) {
            state.isShowingInfoDrawer = true;
        },
        hideInfoDrawer(state) {
            state.isShowingInfoDrawer = false;
        },

        setLanguage(state, payload) {
            i18n.locale = payload;
            moment.locale(payload);
            Settings.defaultLocale = payload;
            LStorageUtils.saveDefaultLanguage(payload);

            router.go(0);
        }
    },
    modules: {
        CovidMapModule,
        CovidDashboardModule,
        CovidDataCenterModule,
        YoutubeApiModule,
        PublicApiModule
    }
})
