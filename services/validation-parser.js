module.exports = class ValidationParser {
    static containsErrors(response) {
        return response.ErrorModel;
    }

    static extractErrors(response) {
        if (response && response.ErrorModel) {
            return response.ErrorModel.Errors.Error;
        }

        return [];
    }
};