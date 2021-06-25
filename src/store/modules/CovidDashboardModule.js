import LogUtils from "../../utils/LogUtils";
import CovidDataService from "../../api/services/CovidDataService";
import ApiExecuter from "../../api/ApiExecuter";
import NotificationUtils from "../../utils/NotificationUtils";
import StringUtils from "../../utils/StringUtils";
import DashboardUtils from "../../utils/DashboardUtils";
import i18n from '../../i18n'
import CovidDataBackupService from "../../api/services/CovidDataBackupService";

export default {
    state: {
        vnCovidCaseStatistics: {
            total: [],
            recover: [],
            active: [],
            death: []
        },
        vnCovidTypeStatistics: {
            province: [],
            hospital: [],
            sourceNation: [],
            gender: [],
            age: []
        },
        vnCovidNews: [],
        vnCovidTimeline: [],

        globCovidData: [],
        globCovidHistoryData: [],
        globCovidSummary: {},
        globRegionCovidData: [],
        globRegionCovidHistoryData: [],
        globCovidNews: [],
        globCovidYoutube: null
    },

    getters: {
        vnCovidCaseStatistics: state => state.vnCovidCaseStatistics,
        vnCovidTypeStatistics: state => state.vnCovidTypeStatistics,
        vnCovidNews: state => state.vnCovidNews,
        vnCovidTimeline: state => state.vnCovidTimeline,

        globCovidData: state => state.globCovidData,
        globCovidHistoryData: state => state.globCovidHistoryData,
        globCovidSummary: state => state.globCovidSummary,
        globRegionCovidData: state => state.globRegionCovidData,
        globRegionCovidHistoryData: state => state.globRegionCovidHistoryData,
        globCovidNews: state => state.globCovidNews,
        globCovidYoutube: state => state.globCovidYoutube
    },

    actions: {
        GET_VIETNAM_COVID_CASE_STATISTICS({commit}) {

            const caseExecuters = [
                new ApiExecuter(CovidDataService.getVietnamCovidCaseTotalStatistics).setParameters(), // Total
                new ApiExecuter(
                    // CovidDataService.getVietnamCovidCaseRecoverStatistics,
                    CovidDataBackupService.getVietnamCovidCaseRecoverStatisticsBackup,
                    CovidDataBackupService.getVietnamCovidCaseRecoverStatisticsBackup
                ).setParameters().setUseRawReponse(), // Recover
                new ApiExecuter(
                    // CovidDataService.getVietnamCovidCaseDeathStatistics,
                    CovidDataBackupService.getVietnamCovidCaseDeathStatisticsBackup,
                    CovidDataBackupService.getVietnamCovidCaseDeathStatisticsBackup
                ).setParameters().setUseRawReponse(), // Death
            ];

            // Multiple exercuters
            new ApiExecuter(
                null, null,
                apiResponses => {

                    // Handle error messages
                    apiResponses.forEach(response => {
                        if (response.isError())
                            NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), response.getErrorMessage(), 'danger'))
                    });

                    commit('getVietnamCovidCaseStatistics', apiResponses);
                },
                errors => {
                    LogUtils.e(errors);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).executeAll(caseExecuters);
        },
        GET_VIETNAM_COVID_TYPE_STATISTICS({commit}) {

            const typeExecuters = [
                new ApiExecuter(CovidDataService.getVietnamCovidTypeStatistics).setParameters(1),   // Province
                new ApiExecuter(CovidDataService.getVietnamCovidTypeStatistics).setParameters(2),   // Hospital
                new ApiExecuter(CovidDataService.getVietnamCovidTypeStatistics).setParameters(3),   // Source Nation
                new ApiExecuter(CovidDataService.getVietnamCovidTypeStatistics).setParameters(4),   // Gender
                new ApiExecuter(CovidDataService.getVietnamCovidTypeStatistics).setParameters(5)    // Age
            ];

            // Multiple exercuters
            new ApiExecuter(
                null, null,
                apiResponses => {

                    // Handle error messages
                    apiResponses.forEach(response => {
                        if (response.isError())
                            NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), response.getErrorMessage(), 'danger'))
                    });

                    commit('getVietnamCovidTypeStatistics', apiResponses);
                },
                errors => {
                    LogUtils.e(errors);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).executeAll(typeExecuters);
        },
        GET_VIETNAM_COVID_NEWS({commit}) {

            new ApiExecuter(
                // CovidDataService.getVietnamCovidNews,
                CovidDataBackupService.getVietnamCovidNewsBackup,
                CovidDataBackupService.getVietnamCovidNewsBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        apiResponse.data.forEach(item => item.type_new = DashboardUtils.formatNewsType(item.type_new));

                        commit('getVietnamCovidNews', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        },
        GET_VIETNAM_COVID_TIMELINE({commit}) {

            new ApiExecuter(
                // CovidDataService.getVietnamCovidTimeline,
                CovidDataBackupService.getVietnamCovidTimelineBackup,
                CovidDataBackupService.getVietnamCovidTimelineBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getVietnamCovidTimeline', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        },

        GET_WORLD_COVID_DATA({commit}) {

            new ApiExecuter(
                // CovidDataService.getWorldCovidData,
                CovidDataBackupService.getWorldCovidDataBackup,
                CovidDataBackupService.getWorldCovidDataBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getWorldCovidData', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        },
        GET_WORLD_COVID_HISTORY_DATA({commit}, payload) {

            new ApiExecuter(
                // CovidDataService.getWorldCovidHistoryData,
                CovidDataBackupService.getWorldCovidHistoryDataBackup,
                CovidDataBackupService.getWorldCovidHistoryDataBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getWorldCovidHistoryData', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters(payload).setUseRawReponse().execute();
        },
        GET_WORLD_COVID_SUMMARY({commit}) {

            new ApiExecuter(
                CovidDataService.getWorldCovidSummary,
                null,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        apiResponse.data.newCase = parseInt(apiResponse.data.newCase);
                        apiResponse.data.newDeaths = parseInt(apiResponse.data.newDeaths);

                        commit('getWorldCovidSummary', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().execute();
        },
        GET_WORLD_REGION_COVID_DATA({commit}) {

            new ApiExecuter(
                // CovidDataService.getWorldRegionCovidData,
                CovidDataBackupService.getWorldRegionCovidDataBackup,
                CovidDataBackupService.getWorldRegionCovidDataBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getWorldRegionCovidData', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        },
        GET_WORLD_REGION_COVID_HISTORY_DATA({commit}, payload) {

            new ApiExecuter(
                // CovidDataService.getWorldRegionCovidHistoryData,
                CovidDataBackupService.getWorldRegionCovidHistoryDataBackup,
                CovidDataBackupService.getWorldRegionCovidHistoryDataBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getWorldRegionCovidHistoryData', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters(payload).setUseRawReponse().execute();
        },
        GET_WORLD_COVID_NEWS({commit}) {

            new ApiExecuter(
                // CovidDataService.getWorldCovidNews,
                CovidDataBackupService.getWorldCovidNewsBackup,
                CovidDataBackupService.getWorldCovidNewsBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getWorldCovidNews', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        },
        SEARCH_WORLD_COVID_YOUTUBE({commit, dispatch}) {
            commit('openLoading');

            dispatch('SEARCH_YOUTUBE', {
                otps: {
                    q: 'covid-19',
                    part: 'snippet',
                    maxResults: 5
                },
                onSearched: (result) => {
                    commit('searchWorldCovidYoutube', result)
                }
            })
        }
    },

    mutations: {

        getVietnamCovidCaseStatistics(state, vnCovidCaseStatistics) {

            const total = vnCovidCaseStatistics[0].getData();
            const recover = vnCovidCaseStatistics[1].getData();
            const death = vnCovidCaseStatistics[2].getData();
            const active = [];

            total.forEach((tot, index) => {
                active.push({
                    dataDate: tot.dataDate,
                    count: tot.count - (recover[index].count + death[index].count)
                })
            });

            state.vnCovidCaseStatistics = {total, active, recover, death};
        },
        getVietnamCovidTypeStatistics(state, vnCovidTypeStatistics) {

            function addCountTypes(target, source) {
                target.count += source.count;
                target.count_active += source.count_active;
                target.count_death += source.count_death;
                target.count_recover += source.count_recover;
            }

            function groupAgeData(data) {
                let baseCount = {
                    count: 0,
                    count_active: 0,
                    count_death: 0,
                    count_recover: 0
                };
                let result = [
                    {age: i18n.t('general.undefined'), count: 0, count_active: 0, count_death: 0, count_recover: 0},
                    {
                        age: i18n.t('ages.from-to', ['0', '10']),
                        ...baseCount
                    },
                    {
                        age: i18n.t('ages.from-to', ['11', '19']),
                        ...baseCount
                    },
                    {
                        age: i18n.t('ages.from-to', ['20', '30']),
                        ...baseCount
                    },
                    {
                        age: i18n.t('ages.from-to', ['31', '50']),
                        ...baseCount
                    },
                    {
                        age: i18n.t('ages.from-to', ['51', '70']),
                        ...baseCount
                    },
                    {
                        age: i18n.t('ages.from-to', ['71', '90']),
                        ...baseCount
                    },
                    {age: i18n.t('ages.above', ['90']), count: 0, count_active: 0, count_death: 0, count_recover: 0}
                ];

                data.forEach(item => {
                    let itemAge = item.age;
                    let itemAgeInt = parseInt(itemAge);

                    if (StringUtils.isEmpty(itemAge)) {
                        addCountTypes(result[0], item)

                    } else if (itemAgeInt.toString().length === itemAge.length) {
                        if (itemAgeInt >= 0 && itemAgeInt <= 10) addCountTypes(result[1], item);
                        if (itemAgeInt >= 11 && itemAgeInt <= 19) addCountTypes(result[2], item);
                        if (itemAgeInt >= 20 && itemAgeInt <= 30) addCountTypes(result[3], item);
                        if (itemAgeInt >= 31 && itemAgeInt <= 50) addCountTypes(result[4], item);
                        if (itemAgeInt >= 51 && itemAgeInt <= 70) addCountTypes(result[5], item);
                        if (itemAgeInt >= 71 && itemAgeInt <= 90) addCountTypes(result[6], item);
                        if (itemAgeInt >= 91) addCountTypes(result[7], item);
                    } else {
                        // We consider every item we can't parse into right number as an age below 1 year old
                        addCountTypes(result[1], item);
                    }
                });

                return result;
            }

            state.vnCovidTypeStatistics = {
                province: vnCovidTypeStatistics[0].getData(),
                hospital: vnCovidTypeStatistics[1].getData(),
                sourceNation: vnCovidTypeStatistics[2].getData(),
                gender: vnCovidTypeStatistics[3].getData(),
                age: groupAgeData(vnCovidTypeStatistics[4].getData())
            };

            // Sort fields alphabet
            state.vnCovidTypeStatistics.province.sort((p1, p2) => parseInt(p2.count) - parseInt(p1.count));
            state.vnCovidTypeStatistics.hospital.sort((p1, p2) => parseInt(p2.count) - parseInt(p1.count));
            state.vnCovidTypeStatistics.sourceNation.sort((p1, p2) => parseInt(p2.count) - parseInt(p1.count));
        },
        getVietnamCovidNews(state, covidNews) {
            state.vnCovidNews = covidNews;
        },
        getVietnamCovidTimeline(state, timeline) {
            state.vnCovidTimeline = timeline;
        },

        getWorldCovidData(state, globCovidData) {
            state.globCovidData = globCovidData;
        },
        getWorldCovidHistoryData(state, globCovidHistoryData) {
            state.globCovidHistoryData = globCovidHistoryData;
        },
        getWorldCovidSummary(state, globCovidSummary) {
            state.globCovidSummary = globCovidSummary;
        },
        getWorldRegionCovidData(state, globRegionCovidData) {
            state.globRegionCovidData = globRegionCovidData;
        },
        getWorldRegionCovidHistoryData(state, globRegionCovidHistoryData) {
            state.globRegionCovidHistoryData = globRegionCovidHistoryData;
        },
        getWorldCovidNews(state, covidNews) {
            covidNews.forEach(item => item.type_new = DashboardUtils.formatNewsType(item.type_new));

            state.globCovidNews = covidNews;
        },
        searchWorldCovidYoutube(state, covidYoutube) {
            state.globCovidYoutube = covidYoutube;
        }
    }
}
