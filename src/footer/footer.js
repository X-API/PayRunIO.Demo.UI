import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-http-client";
import { Router } from "aurelia-router";

@inject(Router)
export class Footer {
    constructor(router) {
        this.router = router;
    }

    attached() {
        this.showVersionInfo = this.router.currentInstruction.config.auth;

        var GitHubButtons = require("github-buttons");

        GitHubButtons.render();

        return new Promise(resolve => {
            let client = new HttpClient();

            client.get("/api/version").then(data => {
                this.state = JSON.parse(data.response);

                resolve();
            });
        });
    }
}