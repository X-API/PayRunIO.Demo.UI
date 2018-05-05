const typesAndFriendlyNames = {
    "RatePayInstruction": "Rate pay instruction",
    "PrimitivePayInstruction": "Primitive pay instruction",
    "TaxPayInstruction": "Tax pay instruction",
    "NiPayInstruction": "NI pay instruction",
    "StudentLoanPayInstruction": "Student loan pay instruction",
    "SalaryPayInstruction": "Salary pay instruction"
};

module.exports = (payInstructionType, options) => {
    return typesAndFriendlyNames[payInstructionType];
};