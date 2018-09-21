module.exports = class PensionUtils {
    static parse(pension) {
        let copy = JSON.parse(JSON.stringify(pension));
        
        copy.Id = null;
        copy.employerId = null;
        copy.ObjectType = null;
        copy.UseForAutoEnrolment = null;
        copy.AECompatible = (copy.AECompatible !== undefined && copy.AECompatible.toLowerCase() === "on");
        copy.UseAEThresholds = (copy.UseAEThresholds !== undefined && copy.UseAEThresholds.toLowerCase() === "on");
        copy.SalarySacrifice = (copy.SalarySacrifice !== undefined && copy.SalarySacrifice.toLowerCase() === "on");

        copy.PensionablePayCodes = {
            PayCode: [
                "BASIC"
            ]
        };

        copy.QualifyingPayCodes = {
            PayCode: [
                "BASIC"
            ]
        };

        return copy;
    }
};