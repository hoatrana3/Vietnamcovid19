<template>
    <div class="map-bonus-options" :class="getMapBonusOptionsClass()">

        <div class="options-list">
            <div class="btn-item-wrapper d-flex align-items-center" v-for="(option, index) in options"
                 :key="option.name">
                <small class="btn-item-explain">{{option.name}}</small>
                <button class="bonus-item" :class="index === 0 ? 'item-first' : ''"
                        @click="itemOnClickHandlers[index]()" type="button"
                        :title="option.name"
                        :aria-label="option.name">
                    <i :class="option.icon"></i>
                </button>
            </div>
        </div>
        <div class="btn-item-wrapper d-flex align-items-center">
            <small class="btn-item-explain">{{isOpenOptions ? $t('general.close') : $t('general.open') }} {{$t('map.tool.toolbar').toLowerCase()}}</small>
            <button class="bonus-item options-toggle" @click="toggleBonusOptionsBar()" type="button"
                    :title="$t('map.tool.toolbar')"
                    :aria-label="$t('map.tool.toolbar')">
                <i class="fas" :class="isOpenOptions ? 'fa-times' : 'fa-tools'"></i>
            </button>
        </div>
        <div class="btn-item-wrapper btn-item-wrapper btn-item-zoom d-flex align-items-center">
            <small class="btn-item-explain">{{$t('map.tool.zoom-in')}}</small>
            <button class="bonus-item item-zoom zoom-in"
                    @click="zoomIn" type="button"
                    :title="$t('map.tool.zoom-in')"
                    :aria-label="$t('map.tool.zoom-in')">
                <i class="fas fa-search-plus"></i>
            </button>
        </div>
        <div class="btn-item-wrapper btn-item-wrapper btn-item-zoom d-flex align-items-center">
            <small class="btn-item-explain">{{$t('map.tool.zoom-out')}}</small>
            <button class="bonus-item item-zoom zoom-out"
                    @click="zoomOut" type="button"
                    :title="$t('map.tool.zoom-out')"
                    :aria-label="$t('map.tool.zoom-out')">
                <i class="fas fa-search-minus"></i>
            </button>
        </div>
    </div>
</template>

<script>
    import LMapUtils from "../../../utils/LMapUtils";

    export default {
        name: "MapBonusOptionsBar",
        props: ['itemOnClickHandlers', 'isInDayMode', 'map'],
        data() {
            return {
                isOpenOptions: true,
                options: [
                    {name: this.$t('map.tool.reset-default'), icon: "fab fa-rev"},
                    {name: this.$t('map.your-location'), icon: "fas fa-location-arrow"},
                    {name: this.$t('map.map-settings'), icon: "fas fa-cog"},
                ]
            }
        },
        methods: {
            toggleBonusOptionsBar() {
                this.isOpenOptions = !this.isOpenOptions;
            },
            getMapBonusOptionsClass() {
                let classes = this.isOpenOptions ? 'options-show' : '';
                classes += this.isInDayMode ? ' list-light' : ' list-dark';

                return classes
            },
            zoomIn() {
                this.map.zoomIn(LMapUtils.MAP_ZOOM_PER_LEVEL);
            },
            zoomOut() {
                this.map.zoomOut(LMapUtils.MAP_ZOOM_PER_LEVEL);
            }
        }
    }
</script>
