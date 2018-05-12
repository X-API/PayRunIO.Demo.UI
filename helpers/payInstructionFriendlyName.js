const typesAndFriendlyNames = {
    "RatePayInstruction": "Rate pay",
    "PrimitivePayInstruction": "Primitive pay",
    "TaxPayInstruction": "Tax",
    "NiPayInstruction": "NI",
    "NiAdjustmentPayInstruction": "NI adjustment",
    "StudentLoanPayInstruction": "Student loan",
    "SalaryPayInstruction": "Salary",
    "SspPayInstruction": "Statutory Sick Pay",
    "AoePayInstruction": "Attachment of Earnings",
    "ShppPayInstruction": "Shared Parental Leave and Pay",
    "SmpPayInstruction": "Statutory Maternity Pay"
};

module.exports = (payInstructionType, options) => {
    return typesAndFriendlyNames[payInstructionType];
};