<template>
    <b-nav-item-dropdown right class="language-selector" v-if="!isMinimize">
        <template slot="button-content">
            <span class="flag-icon" :class="selectedLanguage.icon"></span>
            <span class="ml-2">{{selectedLanguage.text}}</span>
        </template>
        <b-dropdown-item href="#"
                         v-for="(lang, index) in languageList" :key="index"
                         @click="e => changeLanguage(e, lang)">
            <span class="flag-icon" :class="lang.icon"></span>
            <span class="ml-2">{{lang.text}}</span>
        </b-dropdown-item>
    </b-nav-item-dropdown>
    <div class="language-selector minimized" v-else>
        <div class="selected-lang" @click="toggleMinimizeSelector()">
            <i class="fas fa-language"></i>
            <span class="flag-icon flag-icon-squared" :class="selectedLanguage.icon"></span>
        </div>
        <ul class="lang-list" :class="{close: !isMinimizeOpen}">
            <b-dropdown-item href="#" class="lang-item"
                             v-for="(lang, index) in languageList" :key="index"
                             @click="e => changeLanguage(e, lang)">
                <span class="flag-icon" :class="lang.icon"></span>
                <span class="ml-2">{{lang.text}}</span>
            </b-dropdown-item>
        </ul>
    </div>
</template>

<script>
    import {LANGUAGES} from "../../../i18n";
    import LStorageUtils from "../../../utils/LStorageUtils";

    export default {
        name: "LanguageSelector",
        props: ['isMinimize'],
        data() {
            return {
                selectedLanguage: null,
                languageList: [
                    {
                        id: LANGUAGES.VI,
                        text: this.$t('languages.vi'),
                        icon: "flag-icon-vn"
                    },
                    {
                        id: LANGUAGES.EN,
                        text: this.$t('languages.en'),
                        icon: "flag-icon-gb"
                    }
                ],

                isMinimizeOpen: false,
            }
        },
        computed: {
            savedLanguage() {
                const savedLang = LStorageUtils.getDefaultLanguage();
                const index = this.languageList.findIndex(lang => lang.id === savedLang);

                if (index >= 0) return this.languageList[index];

                return this.languageList[0];
            }
        },
        created() {
            const savedLang = LStorageUtils.getDefaultLanguage();
            const index = this.languageList.findIndex(lang => lang.id === savedLang);
            this.selectedLanguage = this.languageList[index >= 0 ? index : 0];
        },
        methods: {
            changeLanguage(e, lang) {
                e.preventDefault();

                this.isMinimizeOpen = false;

                if (lang !== this.selectedLanguage) {
                    this.selectedLanguage = lang;
                    this.$store.dispatch('SET_LANGUAGE', lang.id);
                }
            },

            toggleMinimizeSelector() {
                this.isMinimizeOpen = !this.isMinimizeOpen
            }
        }
    }
</script>
