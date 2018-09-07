export function configure(config) {
	config.globalResources([
		"./value-converters/address",
		"./value-converters/bank-account",
		"./value-converters/employee-name",
    	"./value-converters/long-date-time"
  	]);
}
