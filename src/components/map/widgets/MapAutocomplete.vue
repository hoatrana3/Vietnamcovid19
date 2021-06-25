<template>
    <div class="map-autocomplete" @click="HIDE_INFO_DRAWER()">
        <div class="map-autocomplete-input" :class="isOpenSearch ? 'open' : ''">
            <div class="search-icon" @click="toggleMapSearch()"></div>
            <input id="id-search-input"
                   ref="refSearchInput"
                   class="search-input"
                   :placeholder="$t('map.autocomplete-placeholder')"/>
            <i class="fas fa-times-circle search-clear-button" v-show="!isInputFieldEmpty" @click="resetInputField"></i>
        </div>

        <div class="map-autocomplete-results" v-show="isShowResult">
            <div class="result-item" v-show="isSearching">
                <span class="item-label">
                    {{$t('general.searching')}}
                </span>
            </div>
            <div class="result-item" v-for="(result, index) in currentResults" :key="index"
                 @click="onClickItemAt(index)">
                <i class="item-preicon fas " :class="isCaseTag(result) ? 'fa-user-circle' : 'fa-map-marker-alt'"></i>
                <span class="item-label">{{result.label}}</span>
                <i class="item-subicon fas fa-chevron-right"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import {GoogleProvider, OpenStreetMapProvider} from 'leaflet-geosearch';
    import TimeUtils from "../../../utils/TimeUtils";
    import LMapUtils from "../../../utils/LMapUtils";
    import StringUtils from "../../../utils/StringUtils";
    import _ from 'lodash';
    import Vuex from 'vuex';
    import GMapUtils from "../../../utils/GMapUtils";
    import GoogleService from "../../../api/services/GoogleService";

    export default {
        name: "MapAutocomplete",
        props: {
            isOpenSearchProps: {type: Boolean, default: false},
            destination: {type: Object},
            covidData: {type: Array, default: () => []}
        },
        model: {
            prop: "destination",
            event: "onSelectedDestination"
        },
        data() {
            return {
                isOpenSearch: this.isOpenSearchProps,
                autocomplete: null,
                provider: null,

                currentResults: [],
                mCovidData: this.getCovidDataInAutocompleteData(this.covidData),

                isSearching: false,
                isInputFieldEmpty: true,
                isShowResult: true,

                lastestUpdateSearchTime: TimeUtils.getCurrentMoment()
            }
        },
        watch: {
            // Watcher deep for props
            covidData: {
                handler(val) {
                    this.mCovidData = this.getCovidDataInAutocompleteData(val);
                },
                deep: true
            }
        },
        created() {
            this.provider = LMapUtils.MAP_USE_OSM ? new OpenStreetMapProvider() : new GoogleProvider({
                params: {
                    key: GMapUtils.GOOGLE_API_KEY,
                },
            });
        },
        mounted() {
            this.init();
        },
        methods: {
            ...Vuex.mapActions(['HIDE_INFO_DRAWER']),

            toggleMapSearch() {
                this.isOpenSearch = !this.isOpenSearch;
                this.isShowResult = this.isOpenSearch;

                if (this.isOpenSearch) this.$refs.refSearchInput.focus();

                this.$emit('update:isOpenSearchProps', this.isOpenSearch)
            },
            init() {
                this.$refs.refSearchInput.addEventListener('click', () => this.isShowResult = true);

                this.$refs.refSearchInput.addEventListener('input', TimeUtils.timerCallbackDelay(async (e) => {
                    e.preventDefault();

                    this.isSearching = true;

                    const updateSearchTime = TimeUtils.getCurrentMoment();
                    const value = this.$refs.refSearchInput.value.trim();

                    if (StringUtils.isEmpty(value)) {
                        this.currentResults = [];

                        this.isSearching = false;
                        this.isInputFieldEmpty = true;

                        this.lastestUpdateSearchTime = updateSearchTime.clone();

                        return;
                    }

                    this.isInputFieldEmpty = false;

                    var results = [];

                    const predictions = await GoogleService.searchPlaceAutocomplete(value);
                    predictions.data.predictions.forEach(pre => results.push({
                        label: pre.description,
                        placeId: pre.place_id,
                        tag: LMapUtils.AUTOCOMPLETE_PLACE_TAG
                    }));

                    results.unshift(...this.filterCovidData(value));

                    if (updateSearchTime.isAfter(this.lastestUpdateSearchTime)) {
                        this.currentResults = results.slice(0, LMapUtils.AUTOCOMPLETE_MAX_RESULTS);
                        this.lastestUpdateSearchTime = updateSearchTime.clone();
                    }

                    this.isSearching = false;

                }, LMapUtils.AUTOCOMPLETE_DELAY_SEARCH));
            },
            async onClickItemAt(index) {
                this.isShowResult = false;

                var placeData = this.currentResults[index];
                if (placeData.tag === LMapUtils.AUTOCOMPLETE_PLACE_TAG) {
                    const resDetails = await GoogleService.searchPlaceDetails(placeData.placeId);
                    const preDetails = resDetails.data.result;

                    placeData = {
                        ...placeData,
                        x: preDetails.geometry.location.lat,
                        y: preDetails.geometry.location.lng,
                        label: preDetails.formatted_address
                    }
                }

                this.$emit('onSelectedDestination', _.clone(placeData))
            },
            filterCovidData(value) {
                return this.mCovidData.filter(data => data.label.toUpperCase().indexOf(value.toUpperCase()) >= 0);
            },
            getCovidDataInAutocompleteData(datas) {

                let newDatas = [];

                datas.forEach((data, index) => {
                    if (data.caseType !== LMapUtils.CASETYPE_SUSPECTED_CASE_STR
                        && data.caseType !== LMapUtils.CASETYPE_ISOLATED_PLACE_STR) {

                        newDatas.push({
                            tag: LMapUtils.AUTOCOMPLETE_CASE_TAG,
                            x: data.lat,
                            y: data.lng,
                            label: `${this.$t('cases.case-num-long')} ${data.case_no}`,
                            caseIndex: index
                        })
                    }
                });

                return newDatas;
            },
            isCaseTag(item) {
                return item.tag === LMapUtils.AUTOCOMPLETE_CASE_TAG;
            },
            resetInputField() {
                this.$refs.refSearchInput.value = "";
                this.currentResults = [];
                this.isInputFieldEmpty = true;
                this.isSearching = false;
            }
        }
    }
</script>
