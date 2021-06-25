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
        name: "CaseChangeByDayChart",
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
                            type: 'line',
                            toolbar: {
                                tools: {
                                    download: false
                                },
                                autoSelected: 'pan'
                            },
                            stacked: false
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
                            width: 2
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
                                    return (val > 0 ? "+" : "") + NumeralUtils.formatCommonNumber(val)
                                }
                            }
                        },
                        tooltip: {
                            x: {
                                format: 'dd/MM/yyyy'
                            },
                            y: {
                                formatter: (val) => {
                                    return (val > 0 ? "+" : "") + NumeralUtils.formatCommonNumber(val)
                                }
                            }
                        },
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

                const confirmedChangeCaseData = [];
                const activeChangeCaseData = [];
                const recoveredChangeCaseData = [];
                const deathsChangeCaseData = [];
                const dataChangeCaseLabels = [];

                let isMetFirstDateHaveCase = false;

                for (let index = 0; index < dataList.length - 1; ++index) {

                    const data = dataList[index];
                    const dataYesterday = dataList[index === 0 ? 0 : index - 1];

                    let date = data.date;

                    let countryData = isSelectingWorld ? data : data.list[countryIndex];
                    let countryDataYesterday = isSelectingWorld ? dataYesterday : dataYesterday.list[countryIndex];

                    let confirmed = countryData.confirmed;
                    let deaths = countryData.deaths;
                    let recovered = countryData.recovered;
                    let active = confirmed - (deaths + recovered);

                    // We ignore date with nothing in data
                    if (confirmed === 0 && !isMetFirstDateHaveCase) continue;
                    else isMetFirstDateHaveCase = true;

                    let confirmedYesterday = countryDataYesterday.confirmed;
                    let deathsYesterday = countryDataYesterday.deaths;
                    let recoveredYesterday = countryDataYesterday.recovered;
                    let activeYesterday = confirmedYesterday - (deathsYesterday + recoveredYesterday);

                    let confirmedChange = confirmed - confirmedYesterday;
                    let deathsChange = deaths - deathsYesterday;
                    let recoveredChange = recovered - recoveredYesterday;
                    let activeChange = active - activeYesterday;

                    confirmedChangeCaseData.push(confirmedChange);
                    activeChangeCaseData.push(activeChange);
                    recoveredChangeCaseData.push(recoveredChange);
                    deathsChangeCaseData.push(deathsChange);
                    dataChangeCaseLabels.push(date);
                }

                this.chartInfo = {

                    series: [
                        {
                            name: this.$t('cases.confirmed'),
                            data: confirmedChangeCaseData
                        },
                        {
                            name: this.$t('cases.being-treated'),
                            data: activeChangeCaseData
                        },
                        {
                            name: this.$t('cases.recovered'),
                            data: recoveredChangeCaseData
                        },
                        {
                            name: this.$t('cases.dead'),
                            data: deathsChangeCaseData
                        }
                    ],
                    chartOptions: {
                        xaxis: {
                            categories: dataChangeCaseLabels
                        }
                    }
                }
            }
        }
    }
</script>
