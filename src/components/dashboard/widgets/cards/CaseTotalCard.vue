<template>
    <div class="case-total-card-wrapper" :class="{'has-more-under': hasMoreUnder}" @click="toggleShowMoreUnder()">
        <div class="case-total-card" :class="{'show-more-under' : showMoreUnder}">
            <div class="card-main-above" :class="`card-${variant}`">
                <div class="card-icon">
                    <i :class="icon"></i>
                </div>
                <div class="card-content">
                    <div ref="case-total" class="case-total">
                        <i-count-up
                                :endVal="total"
                                @ready="adjustFontsize"
                        />
                    </div>
                    <div ref="case-addition" class="case-addition">
                        <span v-if="isAdditionEmpty(addition)">-</span>
                        <span v-else>
                            [+<i-count-up :endVal="addition" @ready="adjustFontsize"/>]
                        </span>
                    </div>
                    <div class="case-text">
                        {{ text }}
                    </div>
                </div>
            </div>
            <div class="card-more-under" v-if="hasMoreUnder">
                <div class="more-udner-content">
                    <slot name="more-under-content"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import StringUtils from "../../../../utils/StringUtils";
    import NumeralUtils from "../../../../utils/NumeralUtils";
    import DashboardUtils from "../../../../utils/DashboardUtils";

    export default {
        name: "CaseTotalCard",
        props: {
            icon: {
                type: String,
                default: ""
            },
            total: {
                type: Number,
                default: 0
            },
            addition: {
                type: Number,
                default: 0
            },
            text: {
                type: String,
                default: ""
            },
            variant: {
                type: String,
                default: ""
            },
            hasMoreUnder: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                showMoreUnder: false
            }
        },
        computed: {
            formattedTotal() {
                return NumeralUtils.formatCommonNumber(this.total)
            },
            formattedAddition() {
                return NumeralUtils.formatCommonNumber(this.addition)
            }
        },
        watch: {
            total: {
                handler() {
                    setTimeout(() => {
                        this.adjustCaseTotalFontSize();
                    }, 200)
                },
                deep: true
            },
            addition: {
                handler() {
                    setTimeout(() => {
                        this.adjustCaseAdditionFontSize();
                    }, 200)
                },
                deep: true
            }
        },
        mounted() {
            this.adjustFontsize();

            window.addEventListener('resize', () => {
                this.adjustFontsize()
            })
        },
        methods: {
            isAdditionEmpty(addition) {
                return StringUtils.isEmpty(addition) || addition === 0 || addition === '0';
            },
            adjustFontsize() {
                this.adjustCaseTotalFontSize();
                this.adjustCaseAdditionFontSize();
            },
            adjustCaseTotalFontSize() {
                const refCaseTotal = this.$refs['case-total'];

                if (this.total > 0 && refCaseTotal != null) {
                    const caseTotalDom = refCaseTotal.firstChild;
                    DashboardUtils.adjustFontSizeToParent(caseTotalDom)
                }
            },
            adjustCaseAdditionFontSize() {
                const refCaseAddition = this.$refs['case-addition'];

                if (this.addition > 0 && refCaseAddition != null) {
                    const caseTotalDom = refCaseAddition.firstChild;
                    DashboardUtils.adjustFontSizeToParent(caseTotalDom)
                }
            },
            toggleShowMoreUnder() {
                if (this.hasMoreUnder) this.showMoreUnder = !this.showMoreUnder
            }
        }
    }
</script>
