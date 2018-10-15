module.exports = (employee) => {
    let firstname = employee.FirstName || employee.Initials;
    
    let parts = [
        employee.Title,
        firstname,
        employee.LastName
    ].filter(part => part !== undefined && part !== null && part.trim().length > 0);

    return parts.join(" ");
};