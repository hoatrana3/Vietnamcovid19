<template>
    <div class="loader-wrapper" v-if="isShow">
        <div id="loader"></div>
    </div>
</template>

<script>
    export default {
        name: "Loader",
        props: ['isShow']
    }
</script>
