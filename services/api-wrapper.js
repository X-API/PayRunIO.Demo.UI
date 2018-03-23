const rp = require("request-promise");
const Constants = require("../constants");
const OAuth = require("oauth-1.0a");
const Crypto  = require("crypto");
const Url = require("url");

module.exports = class APIWrapper {
    async get(relativeUrl) {
        let options = this.getOptions(relativeUrl, "GET");
        let response = await rp(options);

        return response;
    }

    async getAndExtractLinks(relativeUrl) {
        let options = this.getOptions(relativeUrl, "GET");
        let response = await rp(options);
        let items = [];

        if (response.LinkCollection.Links) {
            for (let link of response.LinkCollection.Links.Link) {
                let href = link["@href"];
                let item = await apiWrapper.get(href);
                let parts = href.split("/");
                let id = parts[parts.length - 1];

                items.push(Object.assign(item[0], { Id: id }));
            }
        }

        return items;
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

        let url = Url.resolve(Constants.apiUrl, relativeUrl);

        let request_data = {
            url: url,
            method: method
        };

        let options = {
            uri: url,
            headers: oauth.toHeader(oauth.authorize(request_data)),
            json: true
        };

        return options;
    }
}