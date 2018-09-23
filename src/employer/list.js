import { HttpClient } from "aurelia-http-client";

export class List {
    constructor() {
    }

    activate() {
        return this.getEmployers();
    }

    getEmployers() {
        return new Promise(resolve => {
            let client = new HttpClient();

            client.get("/api/employers").then(data => {
                this.employers = JSON.parse(data.response);

                resolve();
            });            
        });
    }

    deleteEmployer(id) {
        let client = new HttpClient();

        client.delete(`/api/employer/${id}`).then(res => {
            let parsedResponse = JSON.parse(res.response);
        
            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

            this.apiErrors = null;
            this.status = parsedResponse.status;            
            this.getEmployers();
        });
    }
}