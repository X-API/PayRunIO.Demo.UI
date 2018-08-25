const Constants = require("../Constants");

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
                method: call.method,
                uri: call.uri,
                relativeUri: call.uri.trim().toLowerCase().replace(Constants.apiUrl, ""),
                headers: {
                    Authorization: call.headers.Authorization,
                    Accept: call.headers.accept
                },
                hasRequestBody: call.body && call.method === "POST",
                requestBody: call.body ? this.formatForHtml(JSON.stringify(JSON.parse(call.body), null, 4)) : ""
            });
        }
        else {
            let callToAttachTo = calls.find(x => x.id === call.debugId);

            if (callToAttachTo) {
                callToAttachTo.response = this.getResponse(call);
            }
        }
        
        this._context.session.apiCalls = calls;
    }

    static getResponse(call) {
        var cache = [];
        
        let output = JSON.stringify(call.body, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }

                cache.push(value);
            }

            return value;
        }, 4);

        return this.formatForHtml(output);
    }

    static formatForHtml(input) {
        if (!input) {
            return "";
        }

        let output = input.split(" ").join("&nbsp;").split("\n").join("<br>");

        return output;
    }
};