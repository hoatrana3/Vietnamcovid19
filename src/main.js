import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ApiMaster from "./api/ApiMaster";

import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue'

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles

import 'leaflet/dist/leaflet.css';
import 'leaflet'

import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-gl'
import 'mapbox-gl-leaflet'

import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster.freezable'

import 'leaflet-ant-path'
import smoothscroll from 'smoothscroll-polyfill';

import 'leaflet.gridlayer.googlemutant'

import 'pretty-checkbox/src/pretty-checkbox.scss';

import 'flag-icon-css/css/flag-icon.min.css';

import VueApexCharts from 'vue-apexcharts';

import i18n from './i18n';

import 'moment/locale/vi.js';
import 'moment/locale/en-gb.js';
import moment from 'moment';
import LStorageUtils from "./utils/LStorageUtils";

import ICountUp from 'vue-countup-v2';

import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import { Settings } from 'luxon'

import '@/assets/scss/style.scss';

Settings.defaultLocale = LStorageUtils.getDefaultLanguage() || 'vi';
moment.locale(LStorageUtils.getDefaultLanguage() || 'vi');

Vue.component('datetime', Datetime);

Vue.use(Vuesax);

Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

Vue.component('iCountUp', ICountUp);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;
Vue.config.devtools = true;

// kick off the polyfill!
smoothscroll.polyfill();
window.__forceSmoothScrollPolyfill__ = true;

ApiMaster.configAxios();

export default new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app');
