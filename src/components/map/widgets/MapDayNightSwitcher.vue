<template>
    <div class="daynight-onoffswitch">
        <input type="checkbox" name="daynight-onoffswitch" class="daynight-onoffswitch-checkbox"
               id="id-daynight-onoffswitch"
               v-model="isInDayMode">
        <label class="daynight-onoffswitch-label" for="id-daynight-onoffswitch">
            <span class="daynight-onoffswitch-inner"></span>
        </label>
    </div>
</template>

<script>
    export default {
        name: "MapDayNightSwitcher",
        props: {
            isDayMode: { type: Boolean, default: true }
        },
        model: {
            prop: "isDayMode",
            event: "onChange"
        },
        data() {
            return {
                isInDayMode: this.isDayMode
            }
        },
        watch: {
            isInDayMode() {
                this.$emit("onChange", this.isInDayMode);
            }
        }
    }
</script>
