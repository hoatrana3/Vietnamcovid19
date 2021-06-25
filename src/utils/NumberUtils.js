function formatDistance(meter) {
    if (meter < 1000) return `${meter} mét`;

    return `${(meter / 1000).toFixed(3)} kilo-mét`
}

export default {
    formatDistance
}
