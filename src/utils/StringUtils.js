function formatData(data, nullStr = "-") {
    if (data == null || data === "") return nullStr;

    return data
}

function isEmpty(str) {
    return (str == null || str === "");
}

function jsonCopyObj(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function formatObjectParams(object) {
    let objJson = JSON.stringify(object);

    objJson = objJson.replace("undefined", "\"\"");
    objJson = objJson.replace("NaN", "\"\"");
    objJson = objJson.replace("null", "\"\"");

    return JSON.parse(objJson);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function htmlUnescape(s) {
    let div = document.createElement("div");
    div.innerHTML = s;
    return div.textContent || div.innerText; // IE is different
}

export default {
    formatData,
    isEmpty,
    jsonCopyObj,
    formatObjectParams,
    capitalizeFirstLetter,
    htmlUnescape
}
