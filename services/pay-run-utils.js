module.exports = class PayRunUtils {
    static parse(run, employerId) {
        let copy = JSON.parse(JSON.stringify(run));

        copy.PayScheduleId = null;

        copy.PaySchedule = {
            "@href": `/Employer/${employerId}/PaySchedule/${copy.PayScheduleId}`
        };

        return copy;
    }
};