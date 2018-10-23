module.exports = (context, options) => {
    if (context.Employees 
        && context.Employees.length > 0 
        && context.PaySchedules.PaySchedulesTable.PaySchedule
        && context.PaySchedules.PaySchedulesTable.PaySchedule.length > 0) {
        return options.fn(context);
    }

    return options.inverse(context);
};