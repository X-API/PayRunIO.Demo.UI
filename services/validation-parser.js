module.exports = class ValidationParser {
    static containsErrors(response) {
        return response.ErrorModel;
    }

    static extractErrors(response) {
        return response.ErrorModel.Errors.Error;
    }
};