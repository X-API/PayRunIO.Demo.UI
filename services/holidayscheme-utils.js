module.exports = class HolidaySchemeUtils {
    static parse(holidayScheme) {
        let copy = JSON.parse(JSON.stringify(holidayScheme));
        
        copy.EmployerId = null;
        copy.AllowNegativeBalance = (copy.AllowNegativeBalance !== undefined && copy.AllowNegativeBalance.toLowerCase() === "on");
        copy.BankHolidayInclusive = (copy.BankHolidayInclusive !== undefined && copy.BankHolidayInclusive.toLowerCase() === "on");

        copy.AccrualPayCodes = {
            PayCode: [
                "BASIC"
            ]
        };

        return copy;
    }
};