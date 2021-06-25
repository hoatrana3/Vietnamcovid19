import moment from "moment";
import StringUtils from "./StringUtils";

const START_DAY_TIME = '06:00:00';
const END_DAY_TIME = '18:00:00';

const ISO_8601_FULL = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const ISO_8601_COMMON = "YYYY-MM-DD HH:mm:ss";
const ISO_8601_DATE_ONLY = "YYYY-MM-DD";

const VIETNAM_COMMON = "DD/MM/YYYY";

function isDay() {
    let format = 'hh:mm:ss';

    let time = moment(),
        beforeTime = moment(START_DAY_TIME, format),
        afterTime = moment(END_DAY_TIME, format);

    return time.isBetween(beforeTime, afterTime)
}

function isNight() {
    return !isDay();
}

function unixToFormat(unix, format) {
    return moment.unix(unix).format(format)
}

function formatTimeWithPattern(time, sourcePattern = ISO_8601_DATE_ONLY, desPattern = VIETNAM_COMMON) {
    let result = moment(time, sourcePattern).format(desPattern);

    return result === "Invalid date" ? "" : result
}

function formatCovidDataTime(time) {
    return StringUtils.formatData(formatTimeWithPattern(time));
}

function datesPastToToday(time, sourcePattern = ISO_8601_DATE_ONLY) {
    let timeMoment = moment(time, sourcePattern);
    let todayMoment = moment();

    if (timeMoment.isAfter(todayMoment)) return 0;

    return Math.abs(timeMoment.diff(todayMoment, 'days'));
}

function isCaseTimeNew(time) {
    let timeMoment = moment(time, ISO_8601_DATE_ONLY);
    let twoDayAgo = moment().subtract(2, 'days');

    return twoDayAgo.isSameOrBefore(timeMoment);
}

function getCurrentTime(targetFormat = "HH:mm:ss") {
    return moment(new Date()).format(targetFormat)
}

function getCurrentMoment() {
    return moment()
}

function timerCallbackDelay(callback, delay) {
    let timer = 0;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(callback.bind(this, ...args), delay || 0)
    }
}

function isHasOffsetDayFromToday(time, sourcePattern = ISO_8601_COMMON, offset = 0) {
    let timeMoment = moment(time, sourcePattern).startOf('day');
    let offsetMoment = moment().subtract(offset, 'days').startOf("day");

    return timeMoment.isSame(offsetMoment);
}

function getTimeAgoFromNow(time, sourcePattern = ISO_8601_COMMON) {
    let timeMoment = moment(time, sourcePattern);
    return timeMoment.fromNow()
}

function getYesterday(targetFormat = ISO_8601_DATE_ONLY) {
    return moment().subtract(1, 'days').startOf('day').format(targetFormat);
}

function formatDateWithPattern(date, pattern = VIETNAM_COMMON) {
    return moment(date).format(pattern)
}

function formatToFullISO8601(time, sourcePattern = ISO_8601_DATE_ONLY) {
    return formatTimeWithPattern(time, sourcePattern, ISO_8601_FULL)
}

function getUTCTimezone() {
    return moment.utc();
}

function getUTCYesterday(targetFormat = ISO_8601_DATE_ONLY) {
    return moment().utc().subtract(1, 'days').startOf('day').format(targetFormat);
}

export default {
    START_DAY_TIME,
    END_DAY_TIME,
    ISO_8601_FULL,
    ISO_8601_COMMON,
    ISO_8601_DATE_ONLY,
    VIETNAM_COMMON,
    isDay,
    isNight,
    unixToFormat,
    formatTimeWithPattern,
    formatCovidDataTime,
    datesPastToToday,
    isCaseTimeNew,
    getCurrentTime,
    getCurrentMoment,
    timerCallbackDelay,
    isHasOffsetDayFromToday,
    getTimeAgoFromNow,
    getYesterday,
    formatDateWithPattern,
    formatToFullISO8601,
    getUTCTimezone,
    getUTCYesterday
}
