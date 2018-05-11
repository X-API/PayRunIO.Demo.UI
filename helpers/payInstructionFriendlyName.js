const typesAndFriendlyNames = {
    "RatePayInstruction": "Rate pay instructions",
    "PrimitivePayInstruction": "Primitive pay instructions",
    "TaxPayInstruction": "Tax pay instructions",
    "NiPayInstruction": "NI pay instructions",
    "NiAdjustmentPayInstruction": "NI adjustment pay instructions",
    "StudentLoanPayInstruction": "Student loan pay instructions",
    "SalaryPayInstruction": "Salary pay instructions",
    "SspPayInstruction": "Statutory Sick Pay",
    "AoePayInstruction": "Attachment of Earnings"
};

module.exports = (payInstructionType, options) => {
    return typesAndFriendlyNames[payInstructionType];
};