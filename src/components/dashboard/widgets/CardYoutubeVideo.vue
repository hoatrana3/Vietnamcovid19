<template>
    <div class="card-youtube-video" :class="classes" @click="onClick">
        <div class="video-full" v-show="isFull">
            <hr>
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item"
                        :src="getIframeLink()"
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                </iframe>
            </div>
            <h5 class="mt-4 mb-1">{{ videoTitle }}</h5>
            <p class="mb-0">
                {{ videoDescription }}
            </p>
            <small class="text-muted">{{ `${videoChannel} - ${videoPublishedTime}` }}</small>
            <hr>
        </div>
        <div class="video-minimized" v-show="!isFull">
            <b-media>
                <template slot="aside">
                    <b-img rounded :src="videoThumbnailUrl" alt="" class="mb-3"></b-img>
                </template>
                <h5 class="mt-0 mb-1">{{ videoTitle }}</h5>
                <p class="mb-0">
                    {{ videoDescription }}
                </p>
                <small class="text-muted">{{ `${videoChannel} - ${videoPublishedTime}` }}</small>
            </b-media>
        </div>
    </div>
</template>

<script>
    import StringUtils from "../../../utils/StringUtils";
    import TimeUtils from "../../../utils/TimeUtils";

    export default {
        name: "CardYoutubeVideo",
        props: {
            data: Object,
            isFull: {
                type: Boolean,
                default: true
            },
            classes: {
                type: String,
                default: ""
            }
        },
        computed: {
            dataSnippet() {
                return this.data.snippet
            },
            videoThumbnailUrl() {
                return this.dataSnippet.thumbnails.high.url
            },
            videoTitle() {
                return StringUtils.htmlUnescape(this.dataSnippet.title)
            },
            videoDescription() {
                return this.dataSnippet.description;
            },
            videoChannel() {
                return this.dataSnippet.channelTitle
            },
            videoPublishedTime() {
                return StringUtils.capitalizeFirstLetter(TimeUtils.getTimeAgoFromNow(this.dataSnippet.publishedAt, TimeUtils.ISO_8601_FULL));
            }
        },
        methods: {
            getIframeLink() {
                const preUrl = "https://www.youtube.com/embed/";
                return preUrl + this.data.id.videoId
            },
            onClick() {
                this.$emit('onClick');
            }
        }
    }
</script>
