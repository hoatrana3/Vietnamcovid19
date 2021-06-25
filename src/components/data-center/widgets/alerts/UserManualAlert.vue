<template>
    <vs-alert :page.sync="page" color="rgb(0,133,1)" shadow
              closable v-model="active"
              :hidden-content.sync="hidden" class="custom-alert" :class="{'my-3': active}">
        <template #title>
            <h6 class="alert-title font-weight-bold text-uppercase mb-0">{{$t('hints.user-manual')}}</h6>
        </template>

        <template #icon>
            <i class='far fa-address-book'></i>
        </template>

        <div class="alert-content row">
            <div class="col-md-3 mb-3 mb-md-0">
                <span v-html="$t('hints.select-nation')"></span>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
                <span v-html="$t('hints.select-date')"></span>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
                <span v-html="$t('hints.select-case-type')"></span>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
                <span v-html="$t('hints.other-options')"></span>
            </div>
        </div>
    </vs-alert>
</template>

<script>
    import LStorageUtils from "../../../../utils/LStorageUtils";

    export default {
        name: "UserManualAlert",
        props: ['isShowing'],
        data() {
            return {
                page: 1,
                hidden: false,
                active: this.isShowing
            }
        },
        watch: {
            isShowing() {
                this.active = this.isShowing
            },

            active() {
                this.$emit("update:isShowing", this.active);

                LStorageUtils.saveShowUserManual(this.active);
            }
        }
    }
</script>
