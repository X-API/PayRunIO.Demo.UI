module.exports = class AppState {
    static get currentEmployer() {
        return this._currentEmployer;
    }

    static set currentEmployer(value) {
        this._currentEmployer = value;
    }
};