<template>
    <div class="centered-hr-title" :class="classes">
        <div class="title-text">
            <hr class="hr-text" :data-content="title">
        </div>
    </div>
</template>

<script>
    export default {
        name: "CenteredHrTitle",
        props: ['title', 'classes']
    }
</script>

