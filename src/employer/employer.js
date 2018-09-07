import { HttpClient } from "aurelia-http-client";

export class Employer {
    constructor() {
        this.employer = null;
    }

    activate(id) {
        if (id) {
            let client = new HttpClient();

            client.get(`/api/employer/${id}`).then(data => {
                this.employer = JSON.parse(data.response);
            });
        }
    }
}