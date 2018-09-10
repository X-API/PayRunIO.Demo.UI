export class BankAccountValueConverter {
	toView(account) {
		if (account) {
			let parts = [
				account.AccountName,
				account.AccountNumber,
				account.SortCode
			].filter(part => part !== null && part !== undefined && part.trim().length > 0);
	
			return parts.join("<br />");
		}
	
		return "";
	}
}