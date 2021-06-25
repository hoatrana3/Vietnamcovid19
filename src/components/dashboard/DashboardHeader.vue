<template>
    <div class="dashboard-header">
        <div class="dashboard-header-content">
            <h1>{{$t('dashboard.header.db-title')}}</h1>
            <h3>{{ isVietnamDashboard ? $t('dashboard.header.vn-covid19-info') : $t('dashboard.header.world-covid19-info') }}</h3>
        </div>
        <div class="dashboard-header-selection">
            <img class="selection-image" :src="`/assets/img/dashboard/${isVietnamDashboard ? 'vietnam' : 'world'}.svg`" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "DashboardHeader",
        computed: {
            isVietnamDashboard() {
                return this.$route.path.includes('vietnam')
            }
        }
    }
</script>
