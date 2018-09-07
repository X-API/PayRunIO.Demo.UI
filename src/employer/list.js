import { HttpClient } from "aurelia-http-client";

export class List {
    constructor() {
    }

    activate() {
        let client = new HttpClient();

        client.get("/api/employers").then(data => {
            this.employers = JSON.parse(data.response);

            console.log(this.employers);
        });
    }
}