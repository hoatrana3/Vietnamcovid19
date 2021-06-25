import axios from 'axios'
import ApiUrl from "../ApiUrl";

function searchPlaceAutocomplete(input) {
    return axios.get(`https://cors-anywhere.herokuapp.com/${ApiUrl.API_PLACE_AUTOCOMPLETE}&input=${input}`)
}

function searchPlaceDetails(placeId) {
    return axios.get(`https://cors-anywhere.herokuapp.com/${ApiUrl.API_PLACE_DETAILS}&place_id=${placeId}`)
}


export default {
    searchPlaceAutocomplete,
    searchPlaceDetails
}
