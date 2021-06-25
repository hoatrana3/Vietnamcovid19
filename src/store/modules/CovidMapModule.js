import LogUtils from "../../utils/LogUtils";
import LMapUtils from "../../utils/LMapUtils";
import ApiExecuter from "../../api/ApiExecuter";
import NotificationUtils from "../../utils/NotificationUtils";
import i18n from "../../i18n";
import CovidDataBackupService from "../../api/services/CovidDataBackupService";

export default {
    state: {
        vnCovidData: [],
        vnCovidSummary: {}
    },

    getters: {
        vnCovidData: state => state.vnCovidData,
        vnCovidSummary: state => state.vnCovidSummary
    },

    actions: {
        GET_VIETNAM_COVID_DATA({commit}) {

            new ApiExecuter(
                // CovidDataService.getVietnamCovidData,
                CovidDataBackupService.getVietnamCovidDataBackup,
                CovidDataBackupService.getVietnamCovidDataBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getVietnamCovidData', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                }
            ).setParameters().setUseRawReponse().execute();
        },

        GET_VIETNAM_COVID_SUMMARY({commit}) {

            new ApiExecuter(
                // CovidDataService.getVietnamCovidSummary,
                CovidDataBackupService.getVietnamCovidSummaryBackup,
                CovidDataBackupService.getVietnamCovidSummaryBackup,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        const response = apiResponse;
                        response.data.total_case_old = response.data.total_case - (
                            response.data.total_case_new +
                            response.data.total_discharge +
                            response.data.total_dead
                        );
                        response.data.total_case_active = response.data.total_case_old + response.data.total_case_new;

                        commit('getVietnamCovidSummary', apiResponse.getData());
                    }
                },
                error => {
                    LogUtils.e(error);
                    NotificationUtils.notify(NotificationUtils.getNetworkErrorNotification())
                },
                () => {
                    commit('closeLoading');
                }
            ).setParameters().setUseRawReponse().execute();
        }
    },

    mutations: {

        getVietnamCovidData(state, vnCovidData) {

            function calculatePositionOutOfSameSpot(samePotCounts, currentPos, currentPosIdx) {
                var a = 360.0 / samePotCounts;

                return {
                    lat: parseFloat(currentPos.lat) + -.00006 * Math.cos((a * currentPosIdx) / 180 * Math.PI),
                    lng: parseFloat(currentPos.lng) + -.00006 * Math.sin((a * currentPosIdx) / 180 * Math.PI)
                }
            }

            function reformatResult(data) {
                if (data != null && data.length > 0) {
                    data.forEach(victim => {

                        victim.caseType = LMapUtils.getCaseTypeNameById(victim.case_type);

                        // Fix location if they are similar
                        const samePosList = data.filter(v => victim.lat === v.lat && victim.lng === v.lng);
                        if (samePosList.length > 0) {

                            samePosList.forEach((p, i) => {
                                const newPos = calculatePositionOutOfSameSpot(samePosList.length, p, i);

                                p.lat = newPos.lat;
                                p.lng = newPos.lng;
                            })
                        }

                        // Parse location of victim to float for using in Google Map
                        victim.lat = parseFloat(victim.lat);
                        victim.lng = parseFloat(victim.lng);
                        victim.position = [victim.lat, victim.lng];

                        /** Build the array indexes refCase and relatedCase for easier to use in other page
                         * RefCase : Victim is infected from this/these person
                         * RelatedCase: Victim is the infection of this/these person
                         */
                        victim.refCasesArrayIdxs = [];
                        victim.relatedCaseArrayIdxs = [];

                        let refCaseNo = victim.ref_case_no.split(",");
                        let relatedCaseNo = victim.related_case_no.split(",");

                        refCaseNo.forEach(ref => victim.refCasesArrayIdxs.push(ref - 1));
                        relatedCaseNo.forEach(related => victim.relatedCaseArrayIdxs.push(related - 1));
                    })
                }

                return data
            }

            state.vnCovidData = reformatResult(vnCovidData)
        },

        getVietnamCovidSummary(state, vnCovidSummary) {
            state.vnCovidSummary = vnCovidSummary;
        }
    }
}
