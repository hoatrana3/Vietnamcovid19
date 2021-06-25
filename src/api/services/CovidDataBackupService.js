import axios from 'axios'
import ApiUrl from "../ApiUrl";

/**
 * PRIVATE VIETNAM API
 */
function getVietnamCovidDataBackup() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_DATA_BACKUP)
}
function getVietnamCovidSummaryBackup() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_SUMMARY_BACKUP)
}
function getVietnamCovidNewsBackup() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_NEWS_BACKUP)
}
function getVietnamCovidTimelineBackup() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_TIMELINE_BACKUP);
}

function getVietnamCovidCaseRecoverStatisticsBackup() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_CASE_RECOVER_STATISTICS_BACKUP)
}
function getVietnamCovidCaseDeathStatisticsBackup() {
    return axios.get(ApiUrl.API_VIETNAM_COVID_CASE_DEATH_STATISTICS_BACKUP)
}

/**
 * PRIVATE WORLD API
 */
function getWorldCovidDataBackup() {
    return axios.get(ApiUrl.API_WORLD_COVID_DATA_BACKUP);
}
function getWorldCovidHistoryDataBackup(date) {
    return axios.get(`${ApiUrl.API_WORLD_COVID_HISTORY_DATA_BACKUP}${date}/json`);
}
function getWorldRegionCovidDataBackup() {
    return axios.get(ApiUrl.API_WORLD_REGION_COVID_DATA_BACKUP);
}
function getWorldRegionCovidHistoryDataBackup(date) {
    return axios.get(`${ApiUrl.API_WORLD_REGION_COVID_HISTORY_DATA_BACKUP}${date}/json`);
}
function getWorldCovidNewsBackup() {
    return axios.get(ApiUrl.API_WORLD_COVID_NEWS_BACKUP)
}

/**
 * CENTER API
 */
function getDataCenterTotalTimelineBackup() {
    return axios.get(ApiUrl.API_DATA_CENTER_TOTAL_TIMELINE_BACKUP);
}
function getDataCenterWorldTimelineBackup() {
    return axios.get(ApiUrl.API_DATA_CENTER_WORLD_TIMELINE_BACKUP);
}

export default {
    getVietnamCovidDataBackup,
    getVietnamCovidSummaryBackup,
    getVietnamCovidNewsBackup,
    getVietnamCovidTimelineBackup,
    getVietnamCovidCaseRecoverStatisticsBackup,
    getVietnamCovidCaseDeathStatisticsBackup,

    getWorldCovidDataBackup,
    getWorldCovidHistoryDataBackup,
    getWorldRegionCovidDataBackup,
    getWorldRegionCovidHistoryDataBackup,
    getWorldCovidNewsBackup,

    getDataCenterTotalTimelineBackup,
    getDataCenterWorldTimelineBackup
}
