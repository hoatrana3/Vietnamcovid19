import GMapUtils from "../utils/GMapUtils";

export const IS_PRODUCTION = false;
export const PRE_API_GOOLGE_PLACE = "https://maps.googleapis.com/maps/api/place";

export default {

    BASE_URL:
        IS_PRODUCTION ?
            "https://apis.vietnamcovid19.info/" :
            "https://payment.iparkingstg.com/",

    /**
     * GOOGLE API
     */
    API_PLACE_AUTOCOMPLETE: `${PRE_API_GOOLGE_PLACE}/autocomplete/json?key=${GMapUtils.GOOGLE_API_KEY}`,
    API_PLACE_DETAILS: `${PRE_API_GOOLGE_PLACE}/details/json?fields=formatted_address,geometry&key=${GMapUtils.GOOGLE_API_KEY}`,

    /**
     * PRIVATE VIETNAM API
     */
    API_VIETNAM_COVID_CASE_TOTAL_STATISTICS: "covid-crawl-apis/data/cases",

    API_VIETNAM_COVID_CASE_RECOVER_STATISTICS:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid_recovers.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid_recovers.json",
    API_VIETNAM_COVID_CASE_RECOVER_STATISTICS_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_recovers/json" :
            "https://covid19api.iparkingstg.com/api/covid_recovers/json",

    API_VIETNAM_COVID_CASE_DEATH_STATISTICS:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid_deaths.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid_deaths.json",
    API_VIETNAM_COVID_CASE_DEATH_STATISTICS_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_deaths/json" :
            "https://covid19api.iparkingstg.com/api/covid_deaths/json",

    API_VIETNAM_COVID_TYPE_STATISTICS: "covid-crawl-apis/data/statistical",

    API_VIETNAM_COVID_DATA:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid19_data.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid19_data.json",
    API_VIETNAM_COVID_DATA_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_data/json" :
            "https://covid19api.iparkingstg.com/api/covid_data/json",

    API_VIETNAM_COVID_SUMMARY:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid19_sum.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid19_sum.json",
    API_VIETNAM_COVID_SUMMARY_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid19_sum/json" :
            "https://covid19api.iparkingstg.com/api/covid19_sum/json",

    API_VIETNAM_COVID_NEWS:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid_news.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid_news.json",
    API_VIETNAM_COVID_NEWS_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_news/json" :
            "https://covid19api.iparkingstg.com/api/covid_news/json",

    API_VIETNAM_COVID_TIMELINE:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid_news_des.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid_news_des.json",
    API_VIETNAM_COVID_TIMELINE_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_news_des/json" :
            "https://covid19api.iparkingstg.com/api/covid_news_des/json",

    /**
     * PRIVATE WORLD API
     */
    API_WORLD_COVID_SUMMARY: "covid-crawl-apis/data/world/realtime",

    API_WORLD_COVID_DATA:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid_world_data.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid_world_data.json",
    API_WORLD_COVID_DATA_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_world_data/json" :
            "https://covid19api.iparkingstg.com/api/covid_world_data/json",

    API_WORLD_COVID_HISTORY_DATA:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/history/" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/history/",
    API_WORLD_COVID_HISTORY_DATA_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/history/" :
            "https://covid19api.iparkingstg.com/api/history/",

    API_WORLD_REGION_COVID_DATA:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid_world_data_region.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid_world_data_region.json",
    API_WORLD_REGION_COVID_DATA_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_world_data_region/json" :
            "https://covid19api.iparkingstg.com/api/covid_world_data_region/json",

    API_WORLD_REGION_COVID_HISTORY_DATA:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/history_region/" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/history_region/",
    API_WORLD_REGION_COVID_HISTORY_DATA_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/history_region/" :
            "https://covid19api.iparkingstg.com/api/history_region/",

    API_WORLD_COVID_NEWS:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/covid_news_world.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/covid_news_world.json",
    API_WORLD_COVID_NEWS_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/covid_news_world/json" :
            "https://covid19api.iparkingstg.com/api/covid_news_world/json",

    /**
     * CENTER API
     */
    API_DATA_CENTER_TOTAL_TIMELINE:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/githubusercontent/total_timeline.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/githubusercontent/total_timeline.json",
    API_DATA_CENTER_TOTAL_TIMELINE_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/githubusercontent/total_timeline/json" :
            "https://covid19api.iparkingstg.com/api/githubusercontent/total_timeline/json",

    API_DATA_CENTER_WORLD_TIMELINE:
        IS_PRODUCTION ?
            "https://raw.githubusercontent.com/vnfightcovid/covid19_pro/master/githubusercontent/world_timeline.json" :
            "https://raw.githubusercontent.com/vnfightcovid/covid19/master/githubusercontent/world_timeline.json",
    API_DATA_CENTER_WORLD_TIMELINE_BACKUP:
        IS_PRODUCTION ?
            "https://portalapi.vietnamcovid19.info/api/githubusercontent/world_timeline/json" :
            "https://covid19api.iparkingstg.com/api/githubusercontent/world_timeline/json",

    // API_DATA_CENTER_TOTAL_TIMELINE: "https://raw.githubusercontent.com/amcharts/covid-charts/master/data/json/total_timeline.json",
    //
    // API_DATA_CENTER_WORLD_TIMELINE: "https://raw.githubusercontent.com/amcharts/covid-charts/master/data/json/world_timeline.json",

    /**
     * RAPID API
     */
    RAPID_API_COUNTRY_ALL: "https://restcountries-v1.p.rapidapi.com/all"
}
