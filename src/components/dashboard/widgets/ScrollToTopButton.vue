<template>
    <div id="scroll-to-top-button" class="scroll-to-top-button" :class="{invisible: !isShow}">
        <i class="fas fa-arrow-up"></i>
    </div>
</template>

<script>
    import EventBusUtils from "../../../utils/EventBusUtils";

    export default {
        name: "ScrollToTopButton",
        props: ['offsetShow', 'scrollContainer'],
        data() {
            return {
                isShow: false,

                countHolding: 0,

                scrollToTopBtnDom: null,
                mouseOffsetDrag: {
                    x: 0,
                    y: 0
                }
            }
        },
        watch: {
            scrollContainer() {
                if (this.scrollContainer != null) {
                    // When the user scrolls down offsetShow from the top of the document, show the button
                    this.scrollContainer.addEventListener('scroll', this.scrollEvent);
                }
            }
        },
        mounted() {
            this.scrollToTopBtnDom = document.getElementById('scroll-to-top-button');
            this.scrollToTopBtnDom.addEventListener('mousedown', this.dragMouseDown);
            this.scrollToTopBtnDom.addEventListener('touchstart', this.dragMouseDown);

            if (this.scrollContainer != null) this.scrollEvent();

            EventBusUtils.bus.$on(EventBusUtils.BUS_KEY_SCROLL_TO_TOP, () => {
                this.scrollToTop()
            });
        },
        beforeDestroy() {
            this.scrollContainer.removeEventListener('scroll', this.scrollEvent);
        },
        methods: {
            scrollEvent() {
                this.isShow = this.scrollContainer.scrollTop > this.offsetShow
            },
            scrollToTop() {
                this.scrollContainer.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            },

            dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();

                this.countHolding = 0;

                const mousePosition = {
                    x: e.clientX || e.touches[0].clientX,
                    y: e.clientY || e.touches[0].clientY
                };
                const elementBound = e.target.getBoundingClientRect();

                this.mouseOffsetDrag = {
                    x: Math.abs(mousePosition.x - elementBound.left),
                    y: Math.abs(mousePosition.y - elementBound.top)
                };

                document.addEventListener('mouseup', this.closeDragElement);
                document.addEventListener('mousemove', this.elementDrag);

                document.addEventListener('touchend', this.closeDragElement);
                document.addEventListener('touchcancel', this.closeDragElement);
                document.addEventListener('touchmove', this.elementDrag);

                this.scrollToTopBtnDom.classList.add('no-transition');
            },
            elementDrag(e) {
                e = e || window.event;
                e.preventDefault();

                this.countHolding++;

                const mousePosition = {
                    x: e.clientX || e.touches[0].clientX,
                    y: e.clientY || e.touches[0].clientY
                };

                const nextPosition = {
                    x: mousePosition.x - this.mouseOffsetDrag.x,
                    y: mousePosition.y - this.mouseOffsetDrag.y
                };

                // Bound button inside screen
                if (nextPosition.x < 0)
                    nextPosition.x = 0;
                if (nextPosition.x > screen.availWidth - this.scrollToTopBtnDom.offsetWidth)
                    nextPosition.x = screen.availWidth - this.scrollToTopBtnDom.offsetWidth;
                if (nextPosition.y < 0)
                    nextPosition.y = 0;
                // I don't know why but multiple 2.5 solved my problem :D
                if (nextPosition.y > screen.availHeight - this.scrollToTopBtnDom.offsetHeight * 2.5)
                    nextPosition.y = screen.availHeight - this.scrollToTopBtnDom.offsetHeight * 2.5;

                // set the element's new position:
                this.scrollToTopBtnDom.style.left = nextPosition.x + "px";
                this.scrollToTopBtnDom.style.top = nextPosition.y + "px";
            },
            closeDragElement() {
                // stop moving when mouse button is released:

                document.removeEventListener('mouseup', this.closeDragElement);
                document.removeEventListener('mousemove', this.elementDrag);

                document.removeEventListener('touchend', this.closeDragElement);
                document.removeEventListener('touchcancel', this.closeDragElement);
                document.removeEventListener('touchmove', this.elementDrag);

                this.scrollToTopBtnDom.classList.remove('no-transition');

                if (this.countHolding <= 1) this.scrollToTop();

                this.countHolding = 0;
            }
        }
    }
</script>
