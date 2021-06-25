<template>
    <a :href="link" class="custom-news-media" :class="classes" target="_blank">
        <b-media :tag="tag">
            <template slot="aside">
                <b-img rounded :src="imgSource" alt="" class="mb-3"></b-img>
            </template>
            <h5 class="mt-0 mb-1">{{ title }}</h5>
            <p class="mb-0">
                {{ description }}
            </p>
            <small class="text-muted">{{ `${newsType} - ${newsCreatedTime}` }}</small>
        </b-media>
    </a>
</template>

<script>
    import TimeUtils from "../../../utils/TimeUtils";
    import StringUtils from "../../../utils/StringUtils";

    export default {
        name: "CustomNewsMedia",
        props: {
            link: String,
            imgSource: String,
            title: String,
            description: String,
            newsType: String,
            createdTime: String,
            formatType: {
                type: String,
                default: TimeUtils.ISO_8601_COMMON
            },
            tag: {
                type: String,
                default: "li"
            },
            classes: String
        },
        computed: {
            newsCreatedTime() {
                return StringUtils.capitalizeFirstLetter(TimeUtils.getTimeAgoFromNow(this.createdTime, this.formatType));
            }
        }
    }
</script>
