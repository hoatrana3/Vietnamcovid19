import axios from 'axios'
import ApiUrl from "../ApiUrl";

/**
 * RAPID API
 */
const RAPID_API_KEY = "192ef004c8mshef8251444518996p12aedcjsncc5b31f969a1";
const RAPID_API_REST_COUNTRIES_HOST = "restcountries-v1.p.rapidapi.com";

function getAllCountriesInfo() {
    return axios.get(ApiUrl.RAPID_API_COUNTRY_ALL, {
        headers: {
            "x-rapidapi-host": RAPID_API_REST_COUNTRIES_HOST,
            "x-rapidapi-key": RAPID_API_KEY
        }
    })
}

export default {
    RAPID_API_KEY,
    RAPID_API_REST_COUNTRIES_HOST,
    getAllCountriesInfo
}
