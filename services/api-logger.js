module.exports = class APILogger {
    static get context() {
        return this._context;
    }

    static set context(value) {
        this._context = value;
    }

    static log(type, call) {
        let calls = [];

        if (this._context.session.apiCalls) {
            calls = this._context.session.apiCalls;
        }
        
        if (type.trim().toLowerCase() === "request") {
            calls.push({
                id: call.debugId,
                request: call
            });
        }
        else {
            let callToAttachTo = calls.find(x => x.id === call.debugId);

            if (callToAttachTo) {
                callToAttachTo.response = call;
            }
        }
        
        this._context.session.apiCalls = calls;
    }
};