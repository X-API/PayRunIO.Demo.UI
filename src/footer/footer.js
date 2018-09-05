import { HttpClient } from 'aurelia-http-client';

export class Footer {
    attached() {
        let client = new HttpClient();

        client.get("/api/version").then(data => {
            this.state = JSON.parse(data.response);
        });
    }
}