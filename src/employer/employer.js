import { HttpClient } from "aurelia-http-client";

export class Employer {
    constructor() {
        this.employer = null;
    }

    activate(params) {
        if (params && params.id) {
            let client = new HttpClient();

            client.get(`/api/employer/${params.id}`).then(data => {
                this.employer = JSON.parse(data.response);
            });
        }
    }

    canAddPayRun(context) {
        return context.Employees.length > 0 
            && context.PaySchedules.PaySchedulesTable.PaySchedule
            && context.PaySchedules.PaySchedulesTable.PaySchedule.length > 0;
    }

    addAPaySchedule(context) {
        
    }
}