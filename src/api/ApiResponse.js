import StringUtils from "../utils/StringUtils";

class ApiResponse {
    constructor(response, isRaw = false) {

        if (!isRaw) {
            this.error = response.data.Error;
            this.data = response.data.Data;
        } else {
            this.error = {
                Code: response.status,
                Message: response.statusText
            };
            this.data = response.data;
        }
    }

    isError() {
        return this.error.Code != null && this.error.Code !== 200;
    }

    isDataEmpty() {
        return StringUtils.isEmpty(this.data);
    }

    getErrorMessage() {
        return this.error.Message;
    }

    getData() {
        return this.data;
    }
}

export default ApiResponse
