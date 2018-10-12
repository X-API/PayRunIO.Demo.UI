const BaseController = require("./base-controller");
const ApiWrapper = require("../services/api-wrapper");

let apiWrapper = new ApiWrapper();

module.exports = class CommentaryController extends BaseController {
    async getCommentary(ctx) {
        let employerId = ctx.params.employerId;
        let employeeId = ctx.params.employeeId;
        let commentaryId = ctx.params.commentaryId;

        let apiRoute = `/Employer/${employerId}/Employee/${employeeId}/Commentary/${commentaryId}`;
        let commentary = await apiWrapper.get(ctx, apiRoute);

        ctx.type = "text/plain; charset=utf-8";
        ctx.body = commentary.Commentary.Detail;
    }
};