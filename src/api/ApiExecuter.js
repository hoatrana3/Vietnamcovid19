import ApiResponse from "./ApiResponse";
import LogUtils from "../utils/LogUtils";
import TimeUtils from "../utils/TimeUtils";
import StringUtils from "../utils/StringUtils";
import axios from 'axios';
import EventBusUtils from "../utils/EventBusUtils";

class ApiExecuter {
    constructor(
        onExecute = () => {
        },
        onBackup = null,
        onSuccess = () => {
        },
        onError = () => {
        },
        onFinish = () => {
        }
    ) {
        this.onExecute = onExecute;
        this.onBackup = onBackup;
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.onFinish = onFinish;

        this.params = [];
        this.useRawReponse = false
    }

    setParameters(...params) {

        let newParams = [];

        for (let index = 0; index < params.length; ++index) {
            let param = params[index];

            if (param == null) param = "";
            else {
                param = StringUtils.formatObjectParams(param);
            }

            newParams.push(param);
        }

        this.params = newParams;

        return this
    }

    setUseRawReponse(useRawReponse = true) {
        this.useRawReponse = useRawReponse;

        return this
    }

    execute() {
        EventBusUtils.bus.$emit(EventBusUtils.BUS_KEY_START_EXECUTE_API);

        let mustUsingBackup = false;

        this.onExecute(...this.params)
            .then(response => {
                this.onSuccess(new ApiResponse(response, this.useRawReponse));

                LogUtils.i(`RECEIVED at ${TimeUtils.getCurrentTime()} <----`)
            })
            .catch(error => {

                // // If there is any backup, we use it
                // if (this.onBackup != null) {
                //     mustUsingBackup = true;
                //
                //     this.onBackup(...this.params)
                //         .then(response => {
                //             this.onSuccess(new ApiResponse(response, this.useRawReponse));
                //
                //             LogUtils.i(`BACKUP RECEIVED at ${TimeUtils.getCurrentTime()} <----`)
                //         })
                //         .catch(errorBk => {
                //             this.onError(errorBk)
                //         })
                //         .finally(() => {
                //             EventBusUtils.bus.$emit(EventBusUtils.BUS_KEY_FINISH_EXECUTE_API);
                //             this.onFinish()
                //         });
                // } else {
                //     this.onError(error)
                // }

                this.onError(error)
            })
            .finally(() => {
                if (!mustUsingBackup) {
                    EventBusUtils.bus.$emit(EventBusUtils.BUS_KEY_FINISH_EXECUTE_API);
                    this.onFinish()
                }
            });
    }

    executeAll(apiExecuters) {
        EventBusUtils.bus.$emit(EventBusUtils.BUS_KEY_START_EXECUTE_API);

        let executers = [];

        apiExecuters.forEach(exe => {
            executers.push(exe.onExecute(...exe.params));
        });

        let mustUsingBackup = false;

        axios.all(executers)
            .then(
                axios.spread((...responses) => {

                    let responseModels = [];
                    responses.forEach((response, index) => {
                        responseModels.push(new ApiResponse(response, apiExecuters[index].useRawReponse))
                    });

                    LogUtils.i(`RECEIVED MULTIPLE at ${TimeUtils.getCurrentTime()} <----`);

                    this.onSuccess(responseModels);
                }))
            .catch(error => {

                // let backupExecuters = [];
                //
                // apiExecuters.forEach(exe => {
                //
                //     // If one of them doesnt have backup, we just try to call again main execute function
                //     if (exe.onBackup != null) backupExecuters.push(exe.onBackup(...exe.params));
                //     else backupExecuters.push(exe.onExecute(...exe.params));
                // });
                //
                // mustUsingBackup = true;
                //
                // axios.all(backupExecuters)
                //     .then(
                //         axios.spread((...responses) => {
                //
                //             let responseModels = [];
                //             responses.forEach((response, index) => {
                //                 responseModels.push(new ApiResponse(response, apiExecuters[index].useRawReponse))
                //             });
                //
                //             LogUtils.i(`BACKUP RECEIVED MULTIPLE at ${TimeUtils.getCurrentTime()} <----`);
                //
                //             this.onSuccess(responseModels);
                //         }))
                //     .catch(errorBk => {
                //         this.onError(errorBk)
                //     })
                //     .finally(() => {
                //         EventBusUtils.bus.$emit(EventBusUtils.BUS_KEY_FINISH_EXECUTE_API);
                //         this.onFinish()
                //     });

                this.onError(error)
            })
            .finally(() => {
                if (!mustUsingBackup) {
                    EventBusUtils.bus.$emit(EventBusUtils.BUS_KEY_FINISH_EXECUTE_API);
                    this.onFinish()
                }
            });
    }
}

export default ApiExecuter;
