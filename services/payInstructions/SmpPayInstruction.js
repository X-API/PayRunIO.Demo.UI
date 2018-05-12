const AbsencePayInstruction = require("./AbsencePayInstruction");

module.exports = class SmpPayInstruction extends AbsencePayInstruction {
    parseForApi(body) {
        let cleanBody = super.parseForApi(body);

        if (cleanBody.PayAsLumpSum && cleanBody.PayAsLumpSum.toLowerCase() === "on") {
            cleanBody.PayAsLumpSum = true;
        }
        else {
            cleanBody.PayAsLumpSum = false;
        }

        if (cleanBody.PayPartWeek && cleanBody.PayPartWeek.toLowerCase() === "on") {
            cleanBody.PayPartWeek = true;
        }
        else {
            cleanBody.PayPartWeek = false;
        }

        if (cleanBody.Stillbirth && cleanBody.Stillbirth.toLowerCase() === "on") {
            cleanBody.Stillbirth = true;
        }
        else {
            cleanBody.Stillbirth = false;
        }

        // todo: parse KeepInTouchDays. 

        return cleanBody;
    }    
};