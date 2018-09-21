export function configure(config) {
    config.globalResources([
        "./value-converters/address",
        "./value-converters/bank-account",
        "./value-converters/employee-name",
        "./value-converters/extract-href",
        "./value-converters/extract-id-from-link",
        "./value-converters/format-salary",
        "./value-converters/long-date-time",
        "./value-converters/short-date",
    ]);
}
