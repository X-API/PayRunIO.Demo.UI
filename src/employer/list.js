import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { Confirm } from "../dialogs/confirm";

@inject(DialogService, EventAggregator)
export class List {
    constructor(dialogService, eventAggregator) {
        this.dialogService = dialogService;
        this.ea = eventAggregator;
        this.client = new HttpClient();
    }

    activate() {
        return this.getEmployers();
    }

    getEmployers() {
        return new Promise(resolve => {
            this.ea.publish("request:processing");

            this.client.get("/api/employers").then(data => {
                this.ea.publish("request:complete");

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
                this.ea.publish("request:processing");

                this.client.delete(`/api/employer/${id}`).then(res => {
                    this.ea.publish("request:complete");

                    let parsedResponse = JSON.parse(res.response);

                    this.apiErrors = null;
                    this.status = null;
                    
                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.status = parsedResponse.status;            
                    this.getEmployers();
                });
            }
        });
    }
}