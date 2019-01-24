module.exports = class Globals {
    static setup(setup) {
        this._setup = setup;    
    }

    static get apiUrl() {
        let env = process.env.NODE_ENV || "dev";
        if (env === "dev")
        {
            return "http://localhost:3578";
        }

        if (this._setup && this._setup.Environment.toLowerCase() === "production") {
            return "https://api.payrun.io/";
            
        }

        return "https://api.test.payrun.io/";
    }

    static get consumerKey() {
        return this._setup ? this._setup.ConsumerKey : "";
    }

    static get consumerSecret() {
        return this._setup ? this._setup.ConsumerSecret : "";
    }  
};