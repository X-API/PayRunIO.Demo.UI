export class EmployeeNameValueConverter {
    toView(employee) {
        let firstname = employee.FirstName || employee.Initials;
    
        let parts = [
            employee.Title,
            firstname,
            employee.MiddleName,
            employee.LastName
        ].filter(part => part !== undefined && part !== null && part.trim().length > 0);
    
        return parts.join(" ");		
    }
}