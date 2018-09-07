import * as moment from "moment";

export class LongDateTimeValueConverter {
	toView(value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
  	}
}

