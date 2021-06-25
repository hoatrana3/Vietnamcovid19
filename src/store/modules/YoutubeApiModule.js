import LogUtils from "../../utils/LogUtils";

export default {
    state: {
        YOUTUBE_API_KEY: "AIzaSyBpaXVtVGPw8Pu_wRDfrZCAQ9Rs1WrJ0zc",

        gapi: null
    },

    getters: {
        gapi: state => state.gapi
    },

    actions: {
        INIT_YOUTUBE({commit}, onInitialized) {
            let interval = setInterval(() => {
                let gapi = window.$gapi;

                if (gapi != null) {
                    LogUtils.l("Successfully found GAPI!");
                    clearInterval(interval);

                    commit('setAPI', gapi);

                    if (onInitialized) onInitialized(gapi);
                }
            }, 200)
        },

        LOAD_YOUTUBE_API({state, dispatch}, onLoaded) {

            function loadYoutubeApi(gapi) {
                gapi.client.load('youtube', 'v3', function () {
                    LogUtils.l("Successfully loaded Youtube API Interfaces!");
                    if (onLoaded) onLoaded(gapi)
                });
            }

            if (state.gapi == null) {
                dispatch('INIT_YOUTUBE', loadYoutubeApi)
            } else {
                loadYoutubeApi(state.gapi)
            }
        },

        SEARCH_YOUTUBE({commit, state, dispatch}, { otps, onSearched }) {
            commit('openLoading');

            function doSearch(gapi) {
                let request = gapi.client.youtube.search.list(otps);

                request.execute((response) => {
                    if (onSearched) onSearched(response.result)
                });

                commit('closeLoading');
            }

            if (state.gapi == null) {
                dispatch('LOAD_YOUTUBE_API', doSearch)
            } else doSearch(state.gapi);
        }
    },

    mutations: {
        setAPI(state, gapi) {
            state.gapi = gapi;
            state.gapi.client.setApiKey(state.YOUTUBE_API_KEY);
        }
    }
}
