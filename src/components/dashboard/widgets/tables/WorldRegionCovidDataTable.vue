<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <div class="row">
            <div class="col-md-3 col-sm-5 offset-md-2 mt-3 mb-1">
                <b-form-group class="mb-0">
                    <b-form-select
                            v-model="selectedShowType"
                            size="sm"
                            :options="showTypes"
                    ></b-form-select>
                    <div v-if="showShowTypeHint" class="show-type-hint"><b>{{$t('hints.hint')}}: </b>{{$t('dashboard.table.landscape-to-see-more')}}
                    </div>
                </b-form-group>
            </div>
            <div class="col-md-5 col-sm-7 mt-3 mb-1">
                <b-form-group class="mb-0">
                    <b-input-group size="sm">
                        <b-form-input
                                v-model="filter"
                                type="search"
                                :placeholder="$t('dashboard.table.type-to-search')"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''">{{$t('general.clear')}}</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </div>
            <div class="col-12">
                <b-tabs v-model="tabTimeIndex" pill fill justified class="custom-tabs mt-3">
                    <b-tab :title="$t('general.today')"></b-tab>
                    <b-tab :title="$t('general.yesterday')"></b-tab>
                </b-tabs>
            </div>
        </div>
        <b-table id="glob-region-covid-table"
                 show-empty
                 :empty-text="$t('general.empty-data')"
                 :empty-filtered-text="$t('general.empty-filter-data')"
                 bordered
                 outlined
                 hover
                 small
                 responsive
                 :sticky-header="stickyHeader"
                 :no-border-collapse="noBorderCollapse"
                 :stacked="stacked"
                 class="my-3 custom-b-table table-responsive"
                 :per-page="perPage"
                 :current-page="currentPage"
                 :filter="filter"
                 @filtered="onFiltered"
                 :items="tabTimeIndex === 0 ? regionCovidTableData : regionCovidHistoryTableData"
                 :fields="fields">
            <template v-slot:cell(new_case)="data">
                <span :class="{'font-weight-semibold text-new-case': (parseInt(data.value) > 0)}">
                    {{ `${parseInt(data.value) > 0 ? '+' : ''}${data.value}` }}
                </span>
            </template>
            <template v-slot:cell(new_deaths)="data">
                <span :class="{'font-weight-semibold text-new-dead': (parseInt(data.value) > 0)}">
                    {{ `${parseInt(data.value) > 0 ? '+' : ''}${data.value}` }}
                </span>
            </template>
        </b-table>
        <b-pagination
                v-if="usePagination"
                pills
                align="center"
                v-model="currentPage"
                :total-rows="regionCovidTableData.length"
                :per-page="perPage"
                class="custom-b-pagination"
                aria-controls="glob-region-covid-table"
        ></b-pagination>
    </div>
</template>

<script>
    import NumeralUtils from "../../../../utils/NumeralUtils";
    import _ from 'lodash';
    import DashboardUtils from "../../../../utils/DashboardUtils";
    import DeviceUtils from "../../../../utils/DeviceUtils";

    export default {
        name: "WorldRegionCovidDataTable",
        data() {
            return {
                selectedShowType: 0,
                showTypes: DashboardUtils.TABLE_SHOW_TYPES,

                currentPage: 1,

                regionCovidTableData: [],
                regionCovidHistoryTableData: [],

                bTableObserver: null,

                totalRows: 1,

                tabTimeIndex: 1,

                fields: [
                    {
                        key: 'region',
                        label: this.$t('places.region'),
                        sortable: true,
                        stickyColumn: true,
                        isRowHeader: true
                    },
                    {
                        key: 'total_case',
                        label: this.$t('dashboard.table.total-infection'),
                        sortable: true,
                        stickyColumn: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonNumber(value)
                        }
                    },
                    {
                        key: 'current_deaths_rate',
                        label: this.$t('dashboard.table.death-rate'),
                        sortable: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonPercentageWithDecimal(value / 100)
                        }
                    },
                    {
                        key: 'new_case',
                        label: this.$t('dashboard.table.new-infection'),
                        sortable: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonNumber(value)
                        }
                    },
                    {
                        key: 'new_case_percent',
                        label: this.$t('dashboard.table.day-infection-rate'),
                        sortable: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonPercentageWithDecimal(value / 100)
                        }
                    },
                    {
                        key: 'total_deaths',
                        label: this.$t('dashboard.table.total-deaths'),
                        sortable: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonNumber(value)
                        }
                    },
                    {
                        key: 'new_deaths',
                        label: this.$t('dashboard.table.new-deaths'),
                        sortable: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonNumber(value)
                        }
                    },
                    {
                        key: 'new_deaths_percent',
                        label: this.$t('dashboard.table.day-death-rate'),
                        sortable: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonPercentageWithDecimal(value / 100)
                        }
                    },
                    {
                        key: 'total_recovered',
                        label: this.$t('dashboard.table.total-recoveries'),
                        sortable: true,
                        class: 'text-right',
                        formatter: value => {
                            return NumeralUtils.formatCommonNumber(value)
                        }
                    }
                ],

                filter: null
            }
        },
        computed: {
            regionCovidData() {
                return this.$store.getters.globRegionCovidData
            },
            regionCovidHistoryData() {
                return this.$store.getters.globRegionCovidHistoryData
            },
            stickyHeader() {
                return this.selectedShowType === 0
            },
            noBorderCollapse() {
                return this.stickyHeader;
            },
            stacked() {
                return this.selectedShowType === 1
            },
            usePagination() {
                return this.stacked;
            },
            perPage() {
                return this.usePagination ? 4 : (this.tabTimeIndex === 0 ? this.regionCovidTableData.length : this.regionCovidHistoryTableData.length)
            },
            showShowTypeHint() {
                return DeviceUtils.isUsingMobileOrTablet() && !this.stacked;
            }
        },
        watch: {
            tabTimeIndex() {
                this.totalRows = (this.tabTimeIndex === 0) ? this.regionCovidTableData.length : this.regionCovidHistoryTableData.length;
            },
            regionCovidData() {
                this.regionCovidTableData = this.getFormattedData(this.regionCovidData);
                if (this.tabTimeIndex === 0) this.totalRows = this.regionCovidTableData.length;
            },
            regionCovidHistoryData() {
                this.regionCovidHistoryTableData = this.getFormattedData(this.regionCovidHistoryData);
                if (this.tabTimeIndex === 1) this.totalRows = this.regionCovidHistoryTableData.length;
            }
        },
        mounted() {
            window.addEventListener(
                "orientationchange",
                () => DashboardUtils.customizeBStickyCols(document.getElementById('glob-region-covid-table'))
            );
            this.observeDataTable()
        },
        beforeDestroy() {
            this.bTableObserver.disconnect()
        },
        methods: {
            getFormattedData(data) {
                const formattedData = _.clone(data);

                formattedData.unshift(this.calculateWorldData(formattedData));

                let otherIndex = formattedData.findIndex(data => data.region === 'Other');
                if (otherIndex >= 0) formattedData.splice(otherIndex, 1);

                formattedData.forEach(data => {
                    data._cellVariants = {
                        new_case_percent: DashboardUtils.get24hNewCaseRateVariant(data.new_case_percent),
                        new_deaths_percent: DashboardUtils.get24hNewDeathRateVariant(data.new_deaths_percent),
                        current_deaths_rate: DashboardUtils.getDeathRateVariant(data.current_deaths_rate)
                    }
                });

                return formattedData
            },

            calculateWorldData(rawData) {
                const result = {
                    region: `${this.$t('places.all-regions')} (${rawData.length - 1})`,
                    total_case: 0,
                    new_case: 0,
                    total_recovered: 0,
                    total_deaths: 0,
                    new_deaths: 0,
                    new_case_percent: 0,
                    new_deaths_percent: 0,
                    current_deaths_rate: 0
                };

                rawData.forEach(data => {
                    result.total_case += data.total_case;
                    result.new_case += data.new_case;
                    result.total_recovered += data.total_recovered;
                    result.total_deaths += data.total_deaths;
                    result.new_deaths += data.new_deaths;
                    result.new_case_percent += data.new_case_percent;
                    result.new_deaths_percent += data.new_deaths_percent;
                    result.current_deaths_rate += data.current_deaths_rate
                });

                result.new_case_percent = (result.new_case * 100) / (result.total_case - result.new_case);
                result.new_deaths_percent = (result.new_deaths * 100) / (result.total_case - result.new_deaths);
                result.current_deaths_rate = (result.total_deaths * 100) / result.total_case;

                return result;
            },

            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length;
                this.currentPage = 1
            },

            observeDataTable() {
                const tableDom = document.getElementById('glob-region-covid-table');

                let addTimeout = null;
                let removeTimeout = null;

                this.bTableObserver = DashboardUtils.observeBTableOnAddData(
                    tableDom,
                    (addedRow) => {
                        let rowIndex = addedRow.getAttribute("aria-rowindex");

                        if (rowIndex != null) {
                            if (addTimeout != null) {
                                clearTimeout(addTimeout);
                                addTimeout = null
                            }

                            addTimeout = setTimeout(() => DashboardUtils.customizeBStickyCols(tableDom), 200)
                        }
                    },
                    (removedRow) => {
                        let rowIndex = removedRow.getAttribute("aria-rowindex");

                        if (rowIndex != null) {
                            if (removeTimeout != null) {
                                clearTimeout(removeTimeout);
                                removeTimeout = null
                            }
                            removeTimeout = setTimeout(() => DashboardUtils.customizeBStickyCols(tableDom), 200)
                        }
                    }
                )
            }
        }
    }
</script>
