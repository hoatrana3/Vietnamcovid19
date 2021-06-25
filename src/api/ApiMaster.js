import axios from 'axios'
import ApiUrl from "./ApiUrl";
import LogUtils from "../utils/LogUtils";
import TimeUtils from "../utils/TimeUtils";

function configAxios() {
    axios.defaults.baseURL = ApiUrl.BASE_URL;
    axios.defaults.responseType = 'json';
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common.post = {};
    axios.defaults.headers.common.post['Content-Type'] = 'application/json';
    axios.defaults.headers.common.put = {};
    axios.defaults.xsrfCookieName = '_CSRF';
    axios.defaults.xsrfHeaderName = 'CSRF';

    axios.interceptors.request.use(config => {
        LogUtils.i(`SENT ----> ${config.method.toUpperCase()}: ${config.url} at ${TimeUtils.getCurrentTime()}`);

        return config
    }, error => {
        return Promise.reject(error)
    });
}

export default {
    configAxios
}
