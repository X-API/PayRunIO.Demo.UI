const rp = require("request-promise");
const Constants = require("../constants");
const OAuth = require("oauth-1.0a");
const Crypto  = require("crypto");

module.exports = class APIWrapper {
    async get(relativeUrl) {
        let options = this.getOptions(relativeUrl, "GET");
        let response = await rp(options);

        return response;
    }

    async post(relativeUrl, body) {
        let options = this.getOptions(relativeUrl, "POST");

        options.body = body;

        let response = await rp(options);

        return response;
    }

    getOptions(relativeUrl, method) {
        let oauth = OAuth({
            consumer: {
                key: Constants.consumerKey,
                secret: Constants.consumerSecret
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return Crypto.createHmac("sha1", key).update(base_string).digest("base64");
            }
        });

        let request_data = {
            url: Constants.apiUrl,
            method: method
        };

        let options = {
            uri: Constants.apiUrl,
            headers: oauth.toHeader(oauth.authorize(request_data)),
            json: true
        };

        return options;
    }
}