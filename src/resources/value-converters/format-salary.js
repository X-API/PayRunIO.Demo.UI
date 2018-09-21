export class FormatSalaryValueConverter {
    toView(obj) {
        if (obj) {
            return parseFloat(obj).toFixed(2);
        }
        
        return "";	
    }
}