export class BaseViewModel {
    constructor(router) {
        this.router = router;
    }

    setTitle(title) {
        this.router.currentInstruction.config.title = title;
    }

    setParams(params) {
        this.router.currentInstruction.config.params = params;
    }
}