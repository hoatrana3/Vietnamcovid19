<template>
    <div class="dashboard-footer">
        <div class="footer-main">
            <PageShareSection class="main-share"/>
            <div class="container">
                <div class="row">
                    <div class="footer-section col-md-6">
                        <img class="section-image" src="/assets/img/dashboard/we-are-working.svg" alt="">
                        <h6 class="text-center font-weight-bold mt-3 text-muted">
                            {{$t('dashboard.footer.we-are-improving')}}</h6>
                    </div>
                    <div class="footer-section col-md-6">
                        <CenteredHrTitle :title="$t('general.contact-us')"/>
                        <button class="contact-button email">
                            <a href="mailto:vietnamcovid19info@gmail.com" target="_blank">
                                <div>vietnamcovid19info@gmail.com</div>
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-policy">
            <small>{{$t('dashboard.footer.copyright')}} -
                <b class="policy-conntent" @click="openPolicy()">{{$t('general.terms-of-use')}}</b>
            </small>
        </div>
    </div>
</template>

<script>
    import CenteredHrTitle from "./widgets/horizontalRules/CenteredHrTitle";
    import PageShareSection from "../PageShareSection";

    export default {
        name: "DashboardFooter",
        components: {PageShareSection, CenteredHrTitle},
        methods: {
            openPolicy() {
                this.$store.dispatch('OPEN_TERMS')
            }
        }
    }
</script>
