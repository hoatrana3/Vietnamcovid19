<template>
    <div class="covid-timeline-wrapper">
        <div class="timeline-item" v-for="(item, index) in data" :key="index">
            <div class="item-time">
                {{item.time}}
            </div>
            <div class="item-content">
                <div class="content-title" v-if="splitContent(item.content).title !== ''">
                    {{splitContent(item.content).title}}
                </div>
                <div class="content-main">
                    {{splitContent(item.content).main}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import StringUtils from "../../../utils/StringUtils";

    export default {
        name: "CovidTimeline",
        props: {
            data: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            splitContent(content) {
                if (content[0] === '-') content = content.substring(1);

                if (this.isContentHavingTitle(content, 3)) {
                    let indexOfSplit = content.indexOf(':');

                    return {
                        title: content.substring(0, indexOfSplit + 1).trim(),
                        main: StringUtils.capitalizeFirstLetter(content.substring(indexOfSplit + 1).trim())
                    }
                } else {
                    return {
                        title: "",
                        main: StringUtils.capitalizeFirstLetter(content.trim())
                    }
                }
            },
            isContentHavingTitle(content, offsetCheck) {
                for (let i = 0; i < offsetCheck; ++i)
                    if (content[i] !== content[i].toUpperCase()) return false;

                return true;
            }
        }
    }
</script>
