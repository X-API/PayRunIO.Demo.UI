const typesAndFriendlyNames = {
    "RatePayInstruction": "Rate pay instructions",
    "PrimitivePayInstruction": "Primitive pay instructions",
    "TaxPayInstruction": "Tax pay instructions",
    "NiPayInstruction": "NI pay instructions",
    "StudentLoanPayInstruction": "Student loan pay instructions",
    "SalaryPayInstruction": "Salary pay instructions"
};

module.exports = (payInstructionType, options) => {
    return typesAndFriendlyNames[payInstructionType];
};