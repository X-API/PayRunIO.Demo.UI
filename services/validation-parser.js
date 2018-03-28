module.exports = class ValidationParser {
    containsErrors(response) {
        return response.ErrorModel;
    }

    extractErrors(response) {
        return response.ErrorModel.Errors.Error;
    }
};