<template>
    <a class="social-link-card" :class="`for-${social}`" :href="link" target="_blank">
        <div class="card-content">
            <i :class="icon"></i>
            <span class="content-text">{{ text }}</span>
        </div>
    </a>
</template>

<script>
    export default {
        name: "SocialLinkCard",
        props: ['icon', 'social', 'link', 'text']
    }
</script>
