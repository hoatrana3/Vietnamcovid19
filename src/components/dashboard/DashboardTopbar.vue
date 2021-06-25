<template>
    <b-navbar class="dashboard-topbar" :class="{invisible: !isShow}" :type="isDark ? 'dark' : 'light'"
              :variant="isDark ? 'dark' : 'white'" toggleable="xl">
        <b-navbar-brand href="/dashboard" class="topbar-logo">
            <img v-show="isDark" :src="'/assets/img/dashboard/vncovid-logo-light.png'" alt="">
            <img v-show="!isDark" :src="'/assets/img/dashboard/vncovid-logo-dark.png'" alt="">
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item v-for="(navLink, index) in navLinkOptions" :key="index" @click="e => routerGoTo(e, navLink.to)">
                    <router-link :to="navLink.to">{{ navLink.text }}</router-link>
                </b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <LanguageSelector class="mr-3"/>
                <button type="button" class="btn-to-map" @click="goToVietnamMap()">{{$t('redirect.go-to-vn-map')}}
                </button>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>

</template>

<script>
    import LanguageSelector from "./widgets/LanguageSelector";

    export default {
        name: "DashboardTopbar",
        components: {LanguageSelector},
        props: {
            offsetUpToShow: {
                type: Number,
                default: 250
            },
            startHidePoint: {
                type: Number,
                default: 250
            },
            scrollContainer: HTMLElement,
            isDark: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isShow: true,
                lastPosition: 0,
                scrollUpDistance: 0,

                navLinkOptions: [
                    {text: this.$t('places.vn'), to: '/dashboard/vietnam'},
                    {text: this.$t('places.world'), to: '/dashboard/world'},
                    {text: this.$t('general.data-center'), to: '/dashboard/data-center'}
                ]
            }
        },
        watch: {
            scrollContainer() {
                if (this.scrollContainer != null) {
                    // When the user scrolls down offsetShow from the top of the document, show the button
                    this.scrollContainer.addEventListener('scroll', this.scrollEvent);
                }
            }
        },
        mounted() {
            if (this.scrollContainer != null) this.scrollEvent()
        },
        methods: {
            scrollEvent() {
                const currentPos = this.scrollContainer.scrollTop;

                if (currentPos < this.startHidePoint) this.isShow = true;
                else if (currentPos > this.lastPosition) {
                    this.scrollUpDistance = 0;
                    this.isShow = false;
                } else {
                    this.scrollUpDistance += Math.abs(this.lastPosition - currentPos);
                    if (this.scrollUpDistance >= this.offsetUpToShow) this.isShow = true;
                }

                this.lastPosition = currentPos;
            },
            goToVietnamMap() {
                this.$router.push('/map');
            },
            routerGoTo(e, link) {
                if (e.ctrlKey || e.metaKey) {
                    window.open(link, "_blank");
                } else {
                    this.$router.push(link, null, () => {/* Ignore Error duplicate router */
                    });
                }
            }
        }
    }
</script>
