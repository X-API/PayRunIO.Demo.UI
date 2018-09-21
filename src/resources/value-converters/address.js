export class AddressValueConverter {
    toView(address) {
        if (address) {
            let parts = [
                address.Address1, 
                address.Address2, 
                address.Address3, 
                address.Address4, 
                address.Country, 
                address.Postcode
            ].filter(part => part !== null && part !== undefined && part.trim().length > 0);
    
            return parts.join("<br />");
        }
    
        return "";
    }
}