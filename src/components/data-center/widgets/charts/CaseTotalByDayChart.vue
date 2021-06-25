<template>
    <div>
        <apexchart type="area" height="500"
                   :options="chartInfo.chartOptions"
                   :series="chartInfo.series">
        </apexchart>
    </div>
</template>

<script>
    import NumeralUtils from "../../../../utils/NumeralUtils";

    export default {
        name: "CaseTotalByDayChart",
        data() {
            return {
                chartInfo: {
                    series: [
                        {
                            name: this.$t('cases.confirmed'),
                            data: []
                        },
                        {
                            name: this.$t('cases.being-treated'),
                            data: []
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: []
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: []
                        }
                    ],
                    chartOptions: {
                        chart: {
                            height: 500,
                            type: 'area',
                            toolbar: {
                                tools: {
                                    download: false
                                },
                                autoSelected: 'pan'
                            }
                        },
                        legend: {
                            offsetY: 10,
                            itemMargin: {
                                vertical: 5
                            }
                        },
                        colors: ['#c30037', '#0059c0', '#00cd7e', '#6e3d6a'],
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 3
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shadeIntensity: 1,
                                inverseColors: false,
                                opacityFrom: 0.45,
                                opacityTo: 0.05,
                                stops: [20, 100, 100, 100]
                            },
                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                format: 'dd/MM/yyyy'
                            }
                        },
                        yaxis: {
                            title: {
                                text: this.$t('general.number-of-case')
                            },
                            labels: {
                                formatter: (val) => {
                                    return NumeralUtils.formatCommonNumber(val)
                                }
                            }
                        },
                        tooltip: {
                            x: {
                                format: 'dd/MM/yyyy'
                            },
                            y: {
                                formatter: (val) => {
                                    return NumeralUtils.formatCommonNumber(val)
                                }
                            }
                        }
                    }
                }
            }
        },
        computed: {
            dataCenter() {
                return this.$store.getters.dataCenter
            },

            totalTimeline() {
                return this.dataCenter.totalTimeline
            },

            worldTimeline() {
                return this.dataCenter.worldTimeline
            }
        },
        methods: {
            refreshChartInfo(countryIndex) {

                // If country index is null, we know that we chosing the world
                const isSelectingWorld = countryIndex == null;
                const dataList = isSelectingWorld ? this.totalTimeline : this.worldTimeline;

                const confirmedCaseData = [];
                const activeCaseData = [];
                const recoveredCaseData = [];
                const deathsCaseData = [];
                const dataCaseLabels = [];

                let isMetFirstDateHaveCase = false;

                dataList.forEach(data => {

                    let date = data.date;

                    let countryData = isSelectingWorld ? data : data.list[countryIndex];
                    let confirmed = countryData.confirmed;
                    let deaths = countryData.deaths;
                    let recovered = countryData.recovered;
                    let active = confirmed - (deaths + recovered);

                    // We ignore date with nothing in data
                    if (confirmed === 0 && !isMetFirstDateHaveCase) return;
                    else isMetFirstDateHaveCase = true;

                    confirmedCaseData.push(confirmed);
                    activeCaseData.push(active);
                    recoveredCaseData.push(recovered);
                    deathsCaseData.push(deaths);
                    dataCaseLabels.push(date);
                });

                this.chartInfo = {

                    series: [
                        {
                            name: this.$t('cases.confirmed'),
                            data: confirmedCaseData
                        },
                        {
                            name: this.$t('cases.being-treated'),
                            data: activeCaseData
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: recoveredCaseData
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: deathsCaseData
                        }
                    ],
                    chartOptions: {
                        xaxis: {
                            categories: dataCaseLabels
                        }
                    }
                }
            }
        }
    }
</script>
