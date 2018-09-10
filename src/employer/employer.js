import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { AddPayScheduleModal } from "../pay-schedule/add-pay-schedule-modal";

@inject(EventAggregator, DialogService)
export class Employer {
    constructor(eventAggregator, dialogService) {
        this.employer = null;
        this.ea = eventAggregator;
        this.dialogService = dialogService;
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

    addAPaySchedule() {
        this.openPayScheduleModal({});
    }

    editPaySchedule(schedule) {
        this.openPayScheduleModal(schedule);
    }

    openPayScheduleModal(schedule) {
        schedule.employerId = this.employer.Id;
        
        let opts = {
            viewModel: AddPayScheduleModal,
            model: JSON.parse(JSON.stringify(schedule))
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                // todo: reset employer.PaySchedules.
            }
        });
    }
}