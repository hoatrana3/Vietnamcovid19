<template>
    <vs-alert :page.sync="page" color="rgb(135,122,0)" shadow
              closable v-model="active"
              :hidden-content.sync="hidden" class="custom-alert" :class="{'my-3': active}">
        <template #title>
            <h6 class="alert-title font-weight-bold text-uppercase mb-0">{{$t('hints.notes-on-data')}}</h6>
        </template>

        <template #icon>
            <i class='fas fa-sticky-note'></i>
        </template>

        <div class="alert-content row">
            <div class="col-md-4 mb-3 mb-md-0">
                <span v-html="$t('hints.approximate-data')"></span>
            </div>
            <div class="col-md-4 mb-3 mb-md-0">
                <span v-html="$t('hints.accuracy-data')"></span>
            </div>
            <div class="col-md-4 mb-3 mb-md-0">
                <span v-html="$t('hints.differences-data')"></span>
            </div>
        </div>
    </vs-alert>
</template>

<script>
    import LStorageUtils from "../../../../utils/LStorageUtils";

    export default {
        name: "SomeDataNoteAlert",
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

                LStorageUtils.saveShowNotesOnData(this.active);
            }
        }
    }
</script>
