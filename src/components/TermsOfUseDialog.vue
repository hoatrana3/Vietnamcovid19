<template>
    <vs-dialog scroll overflow-hidden auto-width v-model="isActive">
        <template #header>
            <h6 class="text-light-green font-weight-bold">
                VIETNAMCOVID19.INFO
            </h6>
        </template>
        <div class="p-2" v-html="$t('terms-of-use-content')"></div>
    </vs-dialog>
</template>

<script>
    import Vuex from 'vuex';

    export default {
        name: "TermsOfUseDialog",
        data() {
            return {
                isActive: false
            }
        },
        computed: {
            ...Vuex.mapGetters(['isOpenTerms'])
        },
        watch: {
            isOpenTerms() {
                this.isActive = this.isOpenTerms;
            },
            isActive() {
                if (!this.isActive) {
                    this.$store.dispatch('CLOSE_TERMS');
                } else {
                    this.$store.dispatch('OPEN_TERMS');
                }
            }
        }
    }
</script>

