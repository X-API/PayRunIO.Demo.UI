module.exports = class Globals {
    static setup(setup) {
        this._setup = setup;    
    }

    static get apiUrl() {
        if (this._setup && this._setup.Environment.toLowerCase() === "test") {
            return "https://api.test.payrun.io/";
        }

        return "https://api.payrun.io/";
    }

    static get consumerKey() {
        return this._setup ? this._setup.ConsumerKey : "kXrXIxDAJ0SzjCjgYyvhNg";
    }

    static get consumerSecret() {
        return this._setup ? this._setup.ConsumerSecret : "k55ebIyfF0ehiO4VY6SibA1Q90Nf3n0q6ylYGusp1lg";
    }  
};