import ApiExecuter from "../../api/ApiExecuter";
import NotificationUtils from "../../utils/NotificationUtils";
import i18n from "../../i18n";
import LogUtils from "../../utils/LogUtils";
import PublicApiService from "../../api/services/PublicApiService";

export default {
    state: {
        allCountries: []
    },

    getters: {
        allCountries: state => state.allCountries
    },

    actions: {
        GET_ALL_COUNTRIES({commit}, onSuccess) {

            new ApiExecuter(
                PublicApiService.getAllCountriesInfo,
                null,
                apiResponse => {
                    if (apiResponse.isError()) {
                        NotificationUtils.notify(NotificationUtils.getNotifyInfo(i18n.t('general.failed-fetch-data'), apiResponse.getErrorMessage(), 'danger', NotificationUtils.DANGER_ICON))
                    } else {
                        commit('getAllCountries', apiResponse.getData());

                        if (onSuccess) onSuccess();
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
        getAllCountries(state, allCountries) {

            const mappingCountries = {};

            allCountries.forEach(country => {
                // We don't need AQ here - Antarctic
                if (country.alpha2Code !== 'AQ') mappingCountries[country.alpha2Code] = country
            });

            state.allCountries = mappingCountries
        }
    }
}
