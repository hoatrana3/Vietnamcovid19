<template>
    <b-card :title="title" :sub-title="subTitle"
            class="dashboard-custom-card" :class="classes">
        <slot name="card-before-link"></slot>
        <small class="text-muted d-flex align-items-center" v-if="showLink">
            <i class="fas fa-link mr-2"></i>
            <a :href="link" target="_blank">{{ linkText }}</a>
        </small>
        <slot></slot>
    </b-card>
</template>

<script>
    export default {
        name: "DashboardCustomCard",
        props: {
            title: String,
            subTitle: String,
            link: {
                type: String,
                default: "https://vietnamcovid19.info"
            },
            linkText: {
                type: String,
                default: "vietnamcovid19.info"
            },
            showLink: {
                type: Boolean,
                default: true
            },
            classes: String
        }
    }
</script>
