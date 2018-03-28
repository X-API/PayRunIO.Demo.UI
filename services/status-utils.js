module.exports = class StatusUtils {
    static extract(ctx) {
        if (ctx && ctx.query && ctx.query.status && ctx.query.statusType) {
            return {
                Message: ctx.query.status,
                Type: ctx.query.statusType,
            };
        }

        return null;
    }
};