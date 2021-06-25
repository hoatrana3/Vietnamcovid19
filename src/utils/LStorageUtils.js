import moment from 'moment'
import LogUtils from "./LogUtils";

const KEY_MAP_SETTINGS = 'key_map_settings';
const KEY_DEFAULT_STYLE = 'key_default_style';
const KEY_DEFAULT_LANGUAGE = 'key_default_language';
const KEY_REMIND_FEATURES = 'key_remind_feature';
const KEY_USER_MANUAL = 'key_user_manual';
const KEY_NOTES_ON_DATA = 'key_notes_on_data';

function saveToKey(key, data) {
    let thingToSave = data;

    if ((typeof thingToSave) === 'object') thingToSave = JSON.stringify(thingToSave);

    localStorage.setItem(key, thingToSave);

    LogUtils.l(`LStorage saved to ${key}: ${data}`)
}

function getFromKey(key, autoParse = false) {
    let thingToGet = localStorage.getItem(key);

    if (autoParse) thingToGet = JSON.parse(thingToGet);

    return thingToGet;
}

function saveCurrentTimeToKey(key) {
    saveToKey(key, moment().unix());
}

function saveMapSettings(settings) {
    saveToKey(KEY_MAP_SETTINGS, settings);
}
function getMapSettings() {
    return getFromKey(KEY_MAP_SETTINGS, true);
}

function saveDefaultMapStyle(isDay) {
    saveToKey(KEY_DEFAULT_STYLE, isDay ? 'day' : 'night');
}
function getDefaultMapStyle() {
    return getFromKey(KEY_DEFAULT_STYLE);
}

function saveDefaultLanguage(language) {
    return saveToKey(KEY_DEFAULT_LANGUAGE, language);
}
function getDefaultLanguage() {
    return getFromKey(KEY_DEFAULT_LANGUAGE);
}

function saveRemindFeature(isRemindAgain) {
    return saveToKey(KEY_REMIND_FEATURES, isRemindAgain ? "YES" : "NO");
}
function getRemindFeature() {
    return getFromKey(KEY_REMIND_FEATURES);
}

function saveShowUserManual(isShowAgain) {
    return saveToKey(KEY_USER_MANUAL, isShowAgain ? "YES" : "NO");
}
function getShowUserManual() {
    return getFromKey(KEY_USER_MANUAL);
}

function saveShowNotesOnData(isShowAgain) {
    return saveToKey(KEY_NOTES_ON_DATA, isShowAgain ? "YES" : "NO");
}
function getShowNotesOnData() {
    return getFromKey(KEY_NOTES_ON_DATA);
}

export default {
    KEY_MAP_SETTINGS,
    KEY_DEFAULT_STYLE,
    KEY_DEFAULT_LANGUAGE,
    KEY_REMIND_FEATURES,
    saveToKey,
    getFromKey,
    saveCurrentTimeToKey,
    saveMapSettings,
    getMapSettings,
    saveDefaultMapStyle,
    getDefaultMapStyle,
    saveDefaultLanguage,
    getDefaultLanguage,
    saveRemindFeature,
    getRemindFeature,
    saveShowUserManual,
    getShowUserManual,
    saveShowNotesOnData,
    getShowNotesOnData
}
