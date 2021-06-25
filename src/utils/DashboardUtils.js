import FbGroupShareModel from "./models/FbGroupShareModel";
import i18n from '../i18n';

var FB_GROUP_SHARE_MODEL = null;

const DASHBOARD_TIME_REFRESH_DATA = 10 * 60000;
const TABLE_SHOW_TYPES = [
    { value: 0, text: i18n.t('dashboard.table.show-in-grid') },
    { value: 1, text: i18n.t('dashboard.table.show-in-stack') },
];

function initFaceBookGroupShare() {
    FB_GROUP_SHARE_MODEL = new FbGroupShareModel();
}

function getFacebookGroupShareModel() {
    if (FB_GROUP_SHARE_MODEL == null) initFaceBookGroupShare();

    return FB_GROUP_SHARE_MODEL;
}

function formatNewsType(type) {
    switch (type) {
        case "TIENPHONG":
            return "Tiền Phong";
        case "VNEXPRESS":
            return "VnExpress";
        case "TUOITRE":
            return "Tuổi trẻ";
        case "SUCKHOEDOISONG":
            return "Sức khoẻ & Đời sống";
        case "SOHA":
            return "Soha News";

        case "CHANNEL_NEWS_ASIA":
            return "Channel News Asia";
        case "TELEGRAPH":
            return "Telegraph";
        case "STRAITSTIMES":
            return "The Straitstimes";
        case "RFI":
            return "RFI";

        default:
            return type;
    }
}

function adjustFontSizeToParent(domToAdjust, percent = 0.95) {
    if (domToAdjust != null) {
        const domParent = domToAdjust.parentNode;
        const currentFontSize = window.getComputedStyle(domParent).getPropertyValue('font-size');

        let targetFontSize = parseInt(currentFontSize);

        while (domToAdjust.offsetWidth > (domParent.offsetWidth * percent)) {
            targetFontSize -= 1;
            domParent.style.fontSize = `${targetFontSize}px`;
        }
    }
}

function get24hNewCaseRateVariant(dayNewCaseRate) {
    dayNewCaseRate = parseFloat(dayNewCaseRate);

    if (dayNewCaseRate >= 25) return 'new-case-high';
    if (dayNewCaseRate >= 15 && dayNewCaseRate < 25) return 'new-case-medium';
    if (dayNewCaseRate >= 5 && dayNewCaseRate < 15) return 'new-case-low';
    if (dayNewCaseRate > 0 && dayNewCaseRate < 5) return 'new-case-vlow';

    return 'new-case-none';
}
function get24hNewDeathRateVariant(dayNewDeathRate) {
    dayNewDeathRate = parseFloat(dayNewDeathRate);

    if (dayNewDeathRate >= 25) return 'new-dead-high';
    if (dayNewDeathRate >= 15 && dayNewDeathRate < 25) return 'new-dead-medium';
    if (dayNewDeathRate >= 5 && dayNewDeathRate < 15) return 'new-dead-low';
    if (dayNewDeathRate > 0 && dayNewDeathRate < 5) return 'new-dead-vlow';

    return 'new-dead-none';
}
function getDeathRateVariant(dayDeathRate) {
    dayDeathRate = parseFloat(dayDeathRate);

    if (dayDeathRate >= 20) return 'dead-rate-high';
    if (dayDeathRate >= 10 && dayDeathRate < 20) return 'dead-rate-medium';
    if (dayDeathRate >= 3 && dayDeathRate < 10) return 'dead-rate-low';
    if (dayDeathRate > 0 && dayDeathRate < 3) return 'dead-rate-vlow';

    return 'dead-rate-none';
}

function customizeBStickyCols(targetTable) {
    const stickyCols = targetTable.getElementsByClassName('b-table-sticky-column');

    for (let col of stickyCols) {
        const allStickyColsInSameParent = col.parentElement.getElementsByClassName('b-table-sticky-column');

        for (let index = 1; index < allStickyColsInSameParent.length; ++index) {
            const currentCol = allStickyColsInSameParent[index];

            let targetOffsetLeft = 0;

            for (let beforeIndex = 0; beforeIndex < index; ++beforeIndex) {

                const beforeCol = allStickyColsInSameParent[beforeIndex];
                const beforeColRect = beforeCol.getBoundingClientRect();

                let colWidth = 0;

                if (beforeColRect.width) {
                    // `width` is available for IE9+
                    colWidth = beforeColRect.width;
                } else {
                    // Calculate width for IE8 and below
                    colWidth = beforeColRect.right - beforeColRect.left;
                }

                targetOffsetLeft += colWidth;
            }

            currentCol.style.left = targetOffsetLeft + "px"
        }
    }
}
function observeBTableOnAddData(targetTable, onAdded, onRemoved) {

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {

                const addedNode = mutation.addedNodes[0];
                if (addedNode != null && addedNode.nodeName !== "#comment") onAdded(addedNode);

                const removedNode = mutation.removedNodes[0];
                if (removedNode != null && removedNode.nodeName !== "#comment") onRemoved(removedNode)
            }
        }
    });

    observer.observe(targetTable, {childList: true, subtree: true});

    return observer;
}

export default {
    FB_GROUP_SHARE_MODEL,
    DASHBOARD_TIME_REFRESH_DATA,
    TABLE_SHOW_TYPES,
    initFaceBookGroupShare,
    getFacebookGroupShareModel,
    formatNewsType,
    adjustFontSizeToParent,
    get24hNewCaseRateVariant,
    get24hNewDeathRateVariant,
    getDeathRateVariant,
    customizeBStickyCols,
    observeBTableOnAddData
}
