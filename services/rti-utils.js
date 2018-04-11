const FormUtils = require("./form-utils");
const moment = require("moment");

module.exports = class RtiUtils {
    static parse(rti, employerId) {
        let copy = JSON.parse(JSON.stringify(rti));

        copy.Timestamp = moment().format("YYYY-MM-DDTHH:mm:ss")

        if (copy.Generate) {
            copy.Generate = FormUtils.checkboxToBool(copy.Generate);
        }
        else {
            copy.Generate = false;
        }

        if (copy.Transmit) {
            copy.Transmit = FormUtils.checkboxToBool(copy.Transmit);
        }
        else {
            copy.Transmit = false;
        }

        if (copy.LateReason === "N/A") {
            copy.LateReason = null;
        }

        copy.Employer = {
            "@href": `/Employer/${employerId}`
          };

        copy.PaySchedule = {
            "@href": `/Employer/${employerId}/PaySchedule/${copy.PaySchedule}`
        };

        return copy;
    }
}