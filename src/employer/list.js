import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { Confirm } from "../dialogs/confirm";

@inject(DialogService)
export class List {
    constructor(dialogService) {
        this.dialogService = dialogService;
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
        let opts = {
            viewModel: Confirm,
            model: {
                title: "Are you sure?",
                message: "Are you sure you want to delete this employer?"
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {        
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
        });
    }
}