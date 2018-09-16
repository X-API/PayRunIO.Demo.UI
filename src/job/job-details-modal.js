import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { HttpClient } from "aurelia-http-client";

@inject(DialogController)
export class JobDetailsModal {
    constructor(dialogController) {
        this.dialogController = dialogController;
        this.client = new HttpClient();
    }

    activate(job) {
        this.job = job;

        return this.getJobInfo();
    }

    getJobInfo() {
        return new Promise((resolve) => {
            let client = new HttpClient();
            let url = `/api/job/${this.job.id}/${this.job.type}`;

            client.get(url).then(data => {
				this.state = JSON.parse(data.response);
                
                window.setTimeout(() => this.getJobInfo(), 500);

                resolve();
            });
        });
    }
}