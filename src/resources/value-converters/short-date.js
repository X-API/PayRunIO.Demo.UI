const moment = require("moment");

export class ShortDateValueConverter {
    toView(value) {
        if (value) {
            return moment(value).format("YYYY-MM-DD");
        }
        
        return "";
    }
}