import axios from 'axios'
import ApiUrl from "../ApiUrl";

/**
 * PRIVATE VIETNAM API
 */
function getVietnamCovidData() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_DATA)
}
function getVietnamCovidSummary() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_SUMMARY)
}
function getVietnamCovidNews() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_NEWS)
}
function getVietnamCovidTimeline() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_TIMELINE);
}

function getVietnamCovidCaseTotalStatistics() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_CASE_TOTAL_STATISTICS)
}
function getVietnamCovidCaseRecoverStatistics() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_CASE_RECOVER_STATISTICS)
}
function getVietnamCovidCaseDeathStatistics() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_CASE_DEATH_STATISTICS)
}
function getVietnamCovidTypeStatistics(chartType) {
    const url = `${ApiUrl.API_VIETNAM_COVID_TYPE_STATISTICS}?type=${chartType}`;

    return axios.get(url)
}

/**
 * PRIVATE WORLD API
 */
function getWorldCovidData() {
    return axios.get(ApiUrl.API_WORLD_COVID_DATA);
}
function getWorldCovidHistoryData(date) {
    return axios.get(`${ApiUrl.API_WORLD_COVID_HISTORY_DATA}${date}.json`);
}
function getWorldCovidSummary() {
    return axios.get(ApiUrl.API_WORLD_COVID_SUMMARY);
}
function getWorldRegionCovidData() {
    return axios.get(ApiUrl.API_WORLD_REGION_COVID_DATA);
}
function getWorldRegionCovidHistoryData(date) {
    return axios.get(`${ApiUrl.API_WORLD_REGION_COVID_HISTORY_DATA}${date}.json`);
}
function getWorldCovidNews() {
    return axios.get(ApiUrl.API_WORLD_COVID_NEWS)
}

/**
 * CENTER API
 */
function getDataCenterTotalTimeline() {
    return axios.get(ApiUrl.API_DATA_CENTER_TOTAL_TIMELINE);
}
function getDataCenterWorldTimeline() {
    return axios.get(ApiUrl.API_DATA_CENTER_WORLD_TIMELINE);
}

export default {
    getVietnamCovidData,
    getWorldCovidHistoryData,
    getVietnamCovidSummary,
    getVietnamCovidNews,
    getVietnamCovidTimeline,
    getVietnamCovidCaseTotalStatistics,
    getVietnamCovidCaseRecoverStatistics,
    getVietnamCovidCaseDeathStatistics,
    getVietnamCovidTypeStatistics,

    getWorldCovidData,
    getWorldCovidSummary,
    getWorldRegionCovidData,
    getWorldRegionCovidHistoryData,
    getWorldCovidNews,

    getDataCenterTotalTimeline,
    getDataCenterWorldTimeline
}
