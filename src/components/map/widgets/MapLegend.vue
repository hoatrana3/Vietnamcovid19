<template>
    <div class="map-legend-wrapper">
        <div class="legend-content" :class="getLegendClass().content">
            <div class="legend-content-title">
                <div class="content-text">{{$t('general.remain')}}</div>
                <div class="content-value">{{activeCase}}</div>
                <div class="content-hr"></div>
                <div class="content-sub-value">{{summaryInfo.total_case}}</div>
                <hr class="mt-2 mb-1"/>
            </div>
            <div v-for="key in Object.keys(mapIcons)" :key="key" class="legend-content-item"
                 :class="!isUseFilter(key) ? 'sub-item' : ''" v-show="mapIcons[key].name !== ''">
                <div class="d-flex align-items-center">
                    <img class="legend-icon" :src="mapIcons[key].icon"/>
                    <small class="legend-explain">{{mapIcons[key].name}}</small>
                    <div class="ml-auto d-flex align-items-center justify-content-end">
                        <b-badge v-if="isUseBadge(key)"
                                 :variant="getBadgeInfo(key).variant"
                                 class="mx-3"
                        >{{getBadgeInfo(key).content}}
                        </b-badge>
                        <div class="custom-checkbox pretty p-icon p-toggle p-plain" v-if="isUseFilter(key)">
                            <input type="checkbox"  :checked="true"
                                   @change="event => callbackToggle(key, event.target.checked)" />
                            <div class="state p-primary-o p-on">
                                <i class="icon far fa-eye"></i>
                            </div>
                            <div class="state p-off">
                                <i class="icon far fa-eye-slash"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <i class="fas legend-close-icon" :class="getLegendClass().icon" @click="goNextLegendMode"></i>
    </div>
</template>

<script>
    import LMapUtils from "../../../utils/LMapUtils";
    import DeviceUtils from "../../../utils/DeviceUtils";

    const LEGEND_LARGE = 0;
    const LEGEND_MEDIUM = 1;
    const LEGEND_SMALL = 2;

    export default {
        name: "MapLegend",
        props: ["mapIcons", "summaryInfo", "callbackToggle"],
        data() {
            return {
                legendMode: DeviceUtils.isUsingMobileOrTablet() ? LEGEND_SMALL : LEGEND_LARGE
            }
        },
        computed: {
            activeCase() {
                const active = this.summaryInfo.total_case - (this.summaryInfo.total_discharge + this.summaryInfo.total_dead);

                return active || "";
            }
        },
        methods: {
            isUseBadge(caseName) {
                return (
                    caseName === LMapUtils.CASETYPE_NEW_CASE_STR
                    || caseName === LMapUtils.CASETYPE_OLD_CASE_STR
                    || caseName === LMapUtils.CASETYPE_DISCHARGE_CASE_STR
                    || caseName === LMapUtils.CASETYPE_ISOLATED_PLACE_STR
                )
            },
            isUseFilter(caseName) {
                return (
                    this.isUseBadge(caseName)
                    || caseName === LMapUtils.CASETYPE_SUSPECTED_CASE_STR
                    || caseName === LMapUtils.CASETYPE_ISOLATED_PLACE_STR
                )
            },
            isInitFail(caseName) {
                return (caseName === LMapUtils.CASETYPE_SUSPECTED_CASE_STR)
            },
            getBadgeInfo(caseType) {
                var badgeVariant = "light";
                var badgeContent = 0;

                switch (caseType) {
                    case LMapUtils.CASETYPE_NEW_CASE_STR:
                        badgeVariant = "danger";
                        badgeContent = this.summaryInfo.total_case_new;

                        break;
                    case LMapUtils.CASETYPE_OLD_CASE_STR:
                        badgeVariant = "warning";
                        badgeContent = this.summaryInfo.total_case_old;

                        break;
                    case LMapUtils.CASETYPE_DISCHARGE_CASE_STR:
                        badgeVariant = "info";
                        badgeContent = this.summaryInfo.total_discharge;

                        break;
                    case LMapUtils.CASETYPE_ISOLATED_PLACE_STR:
                        badgeVariant = "purple";
                        badgeContent = this.summaryInfo.total_case_isolated;

                        break;
                }

                if (badgeContent == null || isNaN(badgeContent)) badgeContent = 0;

                return {
                    variant: badgeVariant,
                    content: badgeContent
                }
            },
            getLegendClass() {
                switch (this.legendMode) {
                    case LEGEND_LARGE:
                        return {
                            icon: 'fa-compress',
                            content: ''
                        };
                    case LEGEND_MEDIUM:
                        return {
                            icon: 'fa-chevron-down',
                            content: 'legend-medium'
                        };
                    case LEGEND_SMALL:
                    default:
                        return {
                            icon: 'fa-expand',
                            content: 'legend-small'
                        }
                }
            },
            goNextLegendMode() {
                this.legendMode = (this.legendMode + 1) % 3;
            }
        }
    }
</script>
