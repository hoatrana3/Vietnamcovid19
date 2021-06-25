<template>
    <div class="map-bottom-navigation">
        <div class="nav-item" @click="SHOW_INFO_DRAWER()">
            <i class="fas fa-info-circle mr-2"></i>
            <small>{{$t('general.more-info')}}</small>
        </div>
        <div class="nav-item" @click="goToDashboard()">
            <i class="fas fa-chart-bar mr-2"></i>
            <small>{{$t('general.dashboard')}}</small>
        </div>
    </div>
</template>

<script>
    import Vuex from "vuex";

    export default {
        name: "MapBottomNavigation",
        methods: {
            ...Vuex.mapActions(['HIDE_INFO_DRAWER', 'SHOW_INFO_DRAWER']),

            goToDashboard() {
                this.$router.push('/dashboard');
            }
        }
    }
</script>
