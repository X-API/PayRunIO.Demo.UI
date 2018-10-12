const AppState = require("../app-state");

describe("app-state", () => {
    describe("get currentEmployer()", () => {
        it("should get the currentEmployer()", () => {
            let employer = "Wayne Enterprises";

            AppState._currentEmployer = employer;

            expect(AppState.currentEmployer).toBe(employer);
        });
    });
    
    describe("set currentEmployer()", () => {
        it("should set the currentEmployer()", () => {
            let employer = "Acme Corp.";

            AppState.currentEmployer = employer;

            expect(AppState._currentEmployer).toBe(employer);
        });
    });
});