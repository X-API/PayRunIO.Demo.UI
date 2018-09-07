import { HttpClient } from "aurelia-http-client";

export class Welcome {
    constructor() {
    }

    activate() {
        let client = new HttpClient();

        client.get("/api/has-been-setup").then(data => {
            this.state = JSON.parse(data.response);
        });
    }

    deactivate() {
    }
}