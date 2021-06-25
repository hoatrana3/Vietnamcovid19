<template>
    <div class="bold-head-hr-title" :class="`${classes ? classes : ''} ${hasHeadRight ? 'has-head-right' : ''}`">
        <div class="head-container">
            <div class="head-title">{{ title }}</div>
            <div class="head-right">
                <slot name="head-right"></slot>
            </div>
        </div>
        <hr class="hr-bold-head" />
    </div>
</template>

<script>
    export default {
        name: "BoldHeadHrTitle",
        props: ['title', 'classes', 'hasHeadRight']
    }
</script>
