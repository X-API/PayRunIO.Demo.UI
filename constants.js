module.exports = class Globals {
    static setup(setup) {
        this._setup = setup;    
    }

    static get apiUrl() {
        if (this._setup.Environment.toLowerCase() === "test") {
            return "https://api.test.payrun.io/";
        }

        return "https://api.payrun.io/";
    }

    static get consumerKey() {
        return this._setup.ConsumerKey;
    }

    static get consumerSecret() {
        return this._setup.ConsumerSecret;
    }  
};