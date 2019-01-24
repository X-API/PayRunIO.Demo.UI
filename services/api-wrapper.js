const rp = require("request-promise");
const OAuth = require("oauth-1.0a");
const Crypto  = require("crypto");
const Url = require("url");
const APILogger = require("./api-logger");
const Constants = require("../constants");

require("request-debug")(rp, (type, data) => {
    APILogger.log(type, data);
});

module.exports = class APIWrapper {
    async get(ctx, relativeUrl) {
        let options = this.getOptions(ctx, relativeUrl, "GET");
        let response = await rp(options);

        return response;
    }

    async getFile(ctx, relativeUrl) {
        let options = this.getOptions(ctx, relativeUrl, "GET");

        options.json = false;
        options.encoding = null;
        options.resolveWithFullResponse = true;

        return await rp(options);
    }

    async getLinks(ctx, relativeUrl) {
        let options = this.getOptions(ctx, relativeUrl, "GET");
        let response = await rp(options);
        let items = [];
        
        if (response && response.LinkCollection && response.LinkCollection.Links) {
            return response.LinkCollection.Links.Link;
        }

        return items;
    }

    async extractLinks(ctx, links, getIdCallback) {
        let items = [];

        for (let link of links) {
            let href = link["@href"];
            let wrapper = await this.get(ctx, href);
            let objType = Object.keys(wrapper)[0];
            let item = wrapper[objType];
            let parts = href.split("/");
            let id = getIdCallback ? getIdCallback(href) : parts[parts.length - 1];

            items.push(Object.assign(item, {
                Id: id,
                ObjectType: objType
            }));
        }

        return items;
    }

    async getAndExtractLinks(ctx, relativeUrl, getIdCallback) {
        let links = await this.getLinks(ctx, relativeUrl);

        return await this.extractLinks(ctx, links, getIdCallback);
    }

    async query(ctx, queryBody) {
        let options = this.getOptions(ctx, "/query", "POST");

        options.body = queryBody;

        return await this.sendRequest(options);
    }

    async post(ctx, relativeUrl, body) {
        let options = this.getOptions(ctx, relativeUrl, "POST");

        options.body = this.cleanObject(body);

        return await this.sendRequest(options);
    }

    async put(ctx, relativeUrl, body) {
        let options = this.getOptions(ctx, relativeUrl, "PUT");

        options.body = this.cleanObject(body);

        return await this.sendRequest(options);
    }

    async patch(ctx, relativeUrl, body) {
        let options = this.getOptions(ctx, relativeUrl, "PATCH");

        options.body = this.cleanObject(body);

        return await this.sendRequest(options);
    }

    async delete(ctx, relativeUrl) {
        let options = this.getOptions(ctx, relativeUrl, "DELETE");

        return await this.sendRequest(options);
    }

    async sendRequest(options) {
        try {
            let response = await rp(options);

            return response;
        }
        catch(error) {
            return error.error;
        }
    }

    getOptions(ctx, relativeUrl, method) {
        let ck = ctx.cookies.get("setupCookieKey");

        if (!ck) {
            return;
        }

        let setup = JSON.parse(ck);
        Constants.setup(setup);
        
        let oauth = OAuth({
            consumer: {
                key: setup.ConsumerKey,
                secret: setup.ConsumerSecret
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return Crypto.createHmac("sha1", key).update(base_string).digest("base64");
            }
        });

        let apiUrl = Constants.apiUrl;
        let url = Url.resolve(apiUrl, relativeUrl);

        let request_data = {
            url: url,
            method: method
        };

        var headers = oauth.toHeader(oauth.authorize(request_data));
        headers["x-source"] = "Demo-UI";

        let options = {
            uri: url,
            method: method,
            headers: headers,
            json: true
        };

        return options;
    }

    cleanObject(obj) {
        let cleanObj = JSON.parse(JSON.stringify(obj));
      
        Object.keys(cleanObj).forEach(key => {
            if (cleanObj[key] && typeof cleanObj[key] === "object") {
                let childObj = cleanObj[key];
                            
                childObj = this.cleanObject(cleanObj[key]);

                if (JSON.stringify(childObj) === "{}") {
                    cleanObj[key] = null;
                } 
                else {
                    cleanObj[key] = childObj;
                }
            }
            else if (cleanObj[key] === undefined || cleanObj[key] === null || cleanObj[key].toString().trim().length === 0) {
                delete cleanObj[key];
            }
            else {
                cleanObj[key] = cleanObj[key]; // eslint-disable-line no-self-assign
            }
        });
      
        return cleanObj;
    }
};