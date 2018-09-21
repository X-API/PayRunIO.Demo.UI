const moment = require("moment");

export class LongDateTimeValueConverter {
    toView(value) {
        if (value) {
            return moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        
        return "";
    }
}