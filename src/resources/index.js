export function configure(config) {
	config.globalResources([
		"./value-converters/address",
		"./value-converters/bank-account",
		"./value-converters/employee-name",
		"./value-converters/extract-href",
		"./value-converters/long-date-time",
		"./value-converters/short-date",
  	]);
}
