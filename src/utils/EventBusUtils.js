import Vue from 'vue';

// See event bus pattern for more information
const bus = new Vue();

const BUS_KEY_SCROLL_TO_TOP = 'bus_key_scroll_to_top';
const BUS_KEY_START_EXECUTE_API = 'bus_key_key_start_execute_api';
const BUS_KEY_FINISH_EXECUTE_API = 'bus_key_key_finish_execute_api';

export default {
    bus,
    BUS_KEY_SCROLL_TO_TOP,
    BUS_KEY_START_EXECUTE_API,
    BUS_KEY_FINISH_EXECUTE_API
};
