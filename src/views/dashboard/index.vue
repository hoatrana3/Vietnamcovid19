<template>
    <div id="covid-dashboard-container">
        <DashboardTopbar :offset-up-to-show="500" :start-hide-point="dashboardHeaderHeight"
                         :scroll-container="dashboardContainer"/>

        <DashboardHeader id="dashboard-header"/>

        <div class="dashboard-body">
            <router-view/>
        </div>

        <ScrollToTopButton :offset-show="halfOfDashboard" :scroll-container="dashboardContainer"/>

        <DashboardFooter/>
    </div>
</template>

<script>
    import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
    import DashboardHeader from "../../components/dashboard/DashboardHeader";
    import ScrollToTopButton from "../../components/dashboard/widgets/ScrollToTopButton";
    import DashboardFooter from "../../components/dashboard/DashboardFooter";

    export default {
        name: "CovidDashboard",
        components: {DashboardFooter, ScrollToTopButton, DashboardHeader, DashboardTopbar},
        data() {
            return {
                dashboardContainer: null,
                dashboardHeaderHeight: 100,

                halfOfDashboard: 500
            }
        },
        mounted() {
            this.dashboardContainer = document.getElementById('covid-dashboard-container');
            if (this.dashboardContainer != null) this.halfOfDashboard = this.dashboardContainer.offsetHeight / 2;

            const headerDom = document.getElementById('dashboard-header');
            if (headerDom != null) this.dashboardHeaderHeight = headerDom.offsetHeight;
        }
    }
</script>
