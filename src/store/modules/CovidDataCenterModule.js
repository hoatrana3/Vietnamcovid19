import LogUtils from "../../utils/LogUtils";
import ApiExecuter from "../../api/ApiExecuter";
import NotificationUtils from "../../utils/NotificationUtils";
import i18n from '../../i18n'
import CovidDataBackupService from "../../api/services/CovidDataBackupService";

export default {
    state: {
        dataCenter: {
            totalTimeline: [],
            worldTimeline: []
        }
    },

    getters: {
        dataCenter: state => state.dataCenter
    },

    actions: {
        GET_DATA_CENTER_TOTAL_TIMELINE({commit}) {

            new ApiExecuter(
                // CovidDataService.getDataCenterTotalTimeline,
                CovidDataBackupService.getDataCenterTotalTimelineBackup,
                CovidDataBackupService.getDataCenterTotalTimelineBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getDataCenterTotalTimeline', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        },
        GET_DATA_CENTER_WORLD_TIMELINE({commit}) {

            new ApiExecuter(
                // CovidDataService.getDataCenterWorldTimeline,
                CovidDataBackupService.getDataCenterWorldTimelineBackup,
                CovidDataBackupService.getDataCenterWorldTimelineBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getDataCenterWorldTimeline', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        }
    },

    mutations: {

        getDataCenterTotalTimeline(state, totalTimeline) {
            state.dataCenter.totalTimeline = totalTimeline
        },
        getDataCenterWorldTimeline(state, worldTimeline) {
            state.dataCenter.worldTimeline = worldTimeline
        }
    }
}
