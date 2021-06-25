<template>
    <div class="case-view-total" :class="`view-${variant} ${isActive ? 'active' : ''}`" @click.prevent="onViewClick">
        <div class="view-text">
            {{text}}
        </div>
        <div class="view-total">
            <i-count-up :endVal="total"/>
        </div>
        <div class="view-subtotal" v-if="subTotal != null">
            / <i-count-up :endVal="subTotal"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CaseViewTotal",
        props: {
            text: String,
            total: Number,
            subTotal: Number,
            isActive: {
                type: Boolean,
                default: false
            },
            variant: {
                type: String,
                default: ""
            },
        },
        methods: {
            onViewClick(e) {
               this.$emit('onClick', e)
            }
        }
    }
</script>
