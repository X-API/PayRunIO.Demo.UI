const rp = require("request-promise");
const Constants = require("../constants");
const OAuth = require("oauth-1.0a");
const Crypto  = require("crypto");
const Url = require("url");
const fs = require("fs");

module.exports = class APIWrapper {
    async get(relativeUrl) {
        let options = this.getOptions(relativeUrl, "GET");
        let response = await rp(options);

        return response;
    }

    async getFile(relativeUrl) {
        let options = this.getOptions(relativeUrl, "GET");

        options.json = false;
        options.encoding = null;
        options.resolveWithFullResponse = true;

        return await rp(options);
    }

    async getLinks(relativeUrl) {
        let options = this.getOptions(relativeUrl, "GET");
        let response = await rp(options);
        let items = [];
        
        if (response && response.LinkCollection && response.LinkCollection.Links) {
            return response.LinkCollection.Links.Link;
        }

        return items;
    }

    async extractLinks(links, getIdCallback) {
        let items = [];

        for (let link of links) {
            let href = link["@href"];
            let wrapper = await this.get(href);
            let item = wrapper[Object.keys(wrapper)[0]];
            let parts = href.split("/");
            let id = getIdCallback ? getIdCallback(href) : parts[parts.length - 1];

            items.push(Object.assign(item, { Id: id }));
        }

        return items;
    }

    async getAndExtractLinks(relativeUrl, getIdCallback) {
        let items = [];
        let links = await this.getLinks(relativeUrl);

        return await this.extractLinks(links, getIdCallback);
    }

    async query(queryBody) {
        let options = this.getOptions("/query", "POST");

        options.body = queryBody;

        return await this.sendRequest(options);
    }

    async post(relativeUrl, body) {
        let options = this.getOptions(relativeUrl, "POST");

        options.body = this.cleanObject(body);

        return await this.sendRequest(options);
    }

    async put(relativeUrl, body) {
        let options = this.getOptions(relativeUrl, "PUT");

        options.body = this.cleanObject(body);

        return await this.sendRequest(options);
    }

    async delete(relativeUrl) {
        let options = this.getOptions(relativeUrl, "DELETE");

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
            method: method,
            headers: oauth.toHeader(oauth.authorize(request_data)),
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
                cleanObj[key] = cleanObj[key];
            }
        });
      
        return cleanObj;
      };    
}