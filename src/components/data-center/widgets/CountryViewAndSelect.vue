<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="country-view-and-select">
        <div class="selected-nation">
            <div class="nation-flag" v-html="getSelectedCountryFlag()"></div>
            <div class="nation-name text-truncate ml-3">{{getSelectedCountryName()}}</div>

            <vs-button
                    class="nation-toggle-select"
                    icon
                    circle
                    flat
                    color="rgb(59,176,60)"
                    :active="isInSelect"
                    @click="isInSelect = !isInSelect">
                <i class='fas fa-stream'></i>
            </vs-button>
        </div>
        <hr class="hr-bold-head"/>
        <b-collapse v-model="isInSelect">
            <vs-select
                    filter
                    :placeholder="$t('places.select-nation')"
                    v-model="selectedCountry"
                    class="custom-vs-fw-select mb-3 mt-2">
                <vs-option :label="$t('places.worldwide')" value="WORLD">
                    <i class="fas fa-fw fa-globe"></i>
                    <small class="text-truncate font-weight-semibold ml-3">{{$t('places.worldwide')}}</small>
                </vs-option>
                <vs-option v-for="entry in Object.entries(amchartCountries)" :key="entry[0]"
                           :label="entry[1].country" :value="entry[0]">
                    <span class="flag-icon" :class="`flag-icon-${entry[0].toLowerCase()}`"></span>
                    <small class="text-truncate ml-3">{{entry[1].country}}</small>
                </vs-option>
                <vs-option :label="$t('places.other-nations')" value="XX">
                    <i class="fas fa-fw fa-ellipsis-h"></i>
                    <small class="text-truncate ml-3">{{$t('places.other-nations')}}</small>
                </vs-option>
            </vs-select>
        </b-collapse>
    </div>
</template>

<script>
    import StringUtils from "../../../utils/StringUtils";
    import am4geodata_data_countries2 from '@amcharts/amcharts4-geodata/data/countries2.js';

    export default {
        name: "CountryViewAndSelect",
        props: ['countryId'],
        data() {
            return {
                selectedCountry: "",

                isInSelect: true
            }
        },
        computed: {
            amchartCountries() {
                return am4geodata_data_countries2;
            }
        },
        watch: {
            countryId() {
                this.selectedCountry = this.countryId
            },

            selectedCountry() {
                if (!StringUtils.isEmpty(this.selectedCountry)) {
                    this.$emit("update:countryId", this.selectedCountry);
                    // this.isInSelect = false;
                }
            }
        },
        methods: {
            getSelectedCountryFlag() {
                if (this.selectedCountry === 'WORLD') return `<i class="fas text-light-green fa-globe"></i>`;
                if (this.selectedCountry === 'XX') return `<i class="fas text-muted fa-ellipsis-h"></i>`;

                if (!StringUtils.isEmpty(this.selectedCountry))
                    return `<span class="flag-icon flag-icon-${this.selectedCountry.toLowerCase()}"></span>`;

                return `<i class="far text-muted fa-question-circle"></i>`;
            },
            getSelectedCountryName() {
                if (this.selectedCountry === 'WORLD') return this.$t('places.worldwide');
                if (this.selectedCountry === 'XX') return this.$t('places.other-nations');

                const country = this.amchartCountries[this.selectedCountry];
                if (country != null) return country.country;

                return this.$t('general.undefined');
            }
        }
    }
</script>
