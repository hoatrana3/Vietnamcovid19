<template>
    <div class="page-share-section">
        <div class="share-content">
            <h5>{{$t('general.share-with-friends')}}</h5>
            <div v-html="$t('general.share-description')"></div>
            <button type="button" class="btn-share" @click="startSharing" v-if="!isShowingSocial">
                <i class="fas fa-share-alt"></i>
                <span>{{$t('general.share-now')}}</span>
            </button>
            <div class="share-social-list" v-else>

                <div class="share-copy-wrapper">
                    <input id="share-url-input" class="copy-input" type="text" v-model="shareWebUrl" disabled>
                    <div class="copy-icon" @click="copyShareToClipboard">
                        <i class="fas fa-clipboard"></i>
                    </div>
                </div>

                <div class="share-item" :data-href="shareWebUrl">
                    <a target="_blank"
                       href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvietnamcovid19.info%2F&amp;src=sdkpreparse"
                       class="fb-xfbml-parse-ignore">
                        <img width="30px" height="30px" src="/assets/img/social/facebook.svg" alt="">
                    </a>
                </div>

                <div class="share-item">
                    <a :href="twitterShareContent">
                        <img width="30px" height="30px" src="/assets/img/social/twitter.svg" alt="">
                    </a>
                </div>

                <div class="share-item">
                    <a :href="`mailto:?subject=${shareWebTitle}&body=Xem qua trang web này nhé: ${shareWebUrl}`"
                       :title="shareWebTitle">
                        <img width="30px" height="30px" src="/assets/img/social/email.svg" alt="">
                    </a>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import LogUtils from "../utils/LogUtils";

    export default {
        name: "PageShareSection",
        data() {
            return {
                isShowingSocial: false,
                shareWebUrl: "https://vietnamcovid19.info/",
                shareWebTitle: "Vietnamcovid19.info | Trung tâm thông tin Covid-19 Việt Nam"
            }
        },
        created() {
            this.isShowingSocial = !navigator.share;
        },
        computed: {
            twitterShareContent() {
                const shareContent = `${this.shareWebTitle} : ${this.shareWebUrl}`;
                return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`;
            }
        },
        methods: {
            startSharing() {
                if (navigator.share) {
                    navigator.share({
                        title: this.shareWebTitle,
                        url: this.shareWebUrl
                    }).then(() => {
                        LogUtils.l('Successfully shared!');
                    }).catch(e => {
                        LogUtils.e(e);
                    });
                } else {
                    this.isShowingSocial = true;
                }
            },
            copyShareToClipboard() {
                const shareInput = document.getElementById("share-url-input");

                const el = document.createElement('textarea');  // Create a <textarea> element
                el.value = shareInput.value;                    // Set its value to the string that you want copied
                el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
                el.style.position = 'absolute';
                el.style.left = '-9999px';                      // Move outside the screen to make it invisible
                document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
                const selected =
                    document.getSelection().rangeCount > 0        // Check if there is any content selected previously
                        ? document.getSelection().getRangeAt(0)     // Store selection if found
                        : false;                                    // Mark as false to know no selection existed before
                el.select();                                    // Select the <textarea> content
                document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
                document.body.removeChild(el);                  // Remove the <textarea> element
                if (selected) {                                 // If a selection existed before copying
                    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
                    document.getSelection().addRange(selected);   // Restore the original selection
                }

                /* Alert the copied text */
                alert(this.$t('general.success-copy-to-share'));
            }
        }
    }
</script>
