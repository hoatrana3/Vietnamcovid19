var NUMERAL = require('numeral');

function formatCommonNumber(number) {
    return NUMERAL(number).format('0,0');
}

function formatCommonPercentage(percent) {
    return NUMERAL(percent).format('0%');
}

function formatCommonPercentageWithDecimal(percent) {
    return NUMERAL(percent).format('0.00%');
}

export default {
    NUMERAL,
    formatCommonNumber,
    formatCommonPercentage,
    formatCommonPercentageWithDecimal
}
