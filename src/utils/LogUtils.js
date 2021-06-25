const USE_LOGGING = false;

function l(message) {
    if (USE_LOGGING) {
        console.log(message)
    }
}

function i(message) {
    if (USE_LOGGING) {
        console.info(message)
    }
}

function w(message) {
    if (USE_LOGGING) {
        console.warn(message)
    }
}

function e(message) {
    if (USE_LOGGING) {
        console.error(message)
    }
}

function clr() {
    console.clear()
}

export default {
    l, i, w, e, clr
}
