import app from '../main'
import i18n from '../i18n'

const DANGER_ICON = "<i class='fas fa-times-circle'></i>";
const WARNING_ICON = "<i class='fas fa-exclamation-triangle'></i>";
const SUCCESS_ICON = "<i class='fas fa-check-circle'></i>";
const INFO_ICON = "<i class='fas fa-info-circle'></i>";

const FROWN_ICON = "<i class='far fa-frown'></i>";

const NOTIFIES = [];

function notify(notifyInfo) {
    const notify = app.$vs.notification(notifyInfo);

    NOTIFIES.push(notify);

    return notify;
}

function getNotifyInfo(title, text, color, icon, position = "top-right", duration = 8000, content, progress = 'auto', buttonClose = true, clickClose = true, sticky = false, flat = false, onClose = null, onDestroy = null) {
    return {
        title,
        text,
        color,
        icon,
        position,
        duration,
        content,
        progress,
        buttonClose,
        clickClose,
        sticky,
        flat,
        onClose,
        onDestroy
    }
}

function getNetworkErrorNotification() {
    return getNotifyInfo(i18n.t('errors.error-connection'), i18n.t('errors.error-ask-refesh'), 'danger', DANGER_ICON)
}

function getFailToGetDeviceLocationNotification() {
    return getNotifyInfo(i18n.t('errors.failed-locate'), i18n.t('errors.no-permission-locate'), 'danger', DANGER_ICON)
}

function getCountryNotUpdatedNotification() {
    return getNotifyInfo(i18n.t('errors.country-not-updated'), i18n.t('errors.country-not-updated-explain'), 'danger', FROWN_ICON)
}

export default {
    DANGER_ICON,
    WARNING_ICON,
    SUCCESS_ICON,
    INFO_ICON,
    NOTIFIES,
    notify,
    getNotifyInfo,
    getNetworkErrorNotification,
    getFailToGetDeviceLocationNotification,
    getCountryNotUpdatedNotification
}
