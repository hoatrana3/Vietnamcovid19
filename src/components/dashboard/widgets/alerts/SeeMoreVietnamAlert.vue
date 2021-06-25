<template>
    <vs-alert :page.sync="page" color="rgb(0,133,1)" shadow
              closable v-model="active"
              :hidden-content.sync="hidden" class="custom-alert" :class="{'my-3': active}">
        <template #title>
            <h6 class="alert-title font-weight-bold text-uppercase mb-0">{{$t('hints.more-about-vn')}}</h6>
        </template>

        <template #icon>
            <i class='fas fa-info'></i>
        </template>

        <div class="row">
            <div class="col-md-6 mb-3 mb-md-0">
                <span v-html="$t('hints.vn-in-data-center')"></span>
                <vs-button class="float-right mt-4"
                           to="/dashboard/data-center?iso=VN"
                           color="rgb(59,176,60)">
                    <span>{{$t('redirect.go-now')}}</span>
                    <i class="fas fa-arrow-right ml-2"></i>
                </vs-button>
            </div>
            <div class="col-md-6 mb-3 mb-md-0">
                <span v-html="$t('hints.vn-in-map')"></span>
                <vs-button class="float-right mt-4"
                           to="/map"
                           color="rgb(59,176,60)">
                    <span>{{$t('redirect.go-now')}}</span>
                    <i class="fas fa-arrow-right ml-2"></i>
                </vs-button>
            </div>
        </div>
    </vs-alert>
</template>

<script>
    export default {
        name: "SeeMoreVietnamAlert",
        data() {
            return {
                page: 1,
                hidden: false,
                active: true
            }
        }
    }
</script>
