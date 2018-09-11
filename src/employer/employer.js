import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { PayScheduleModal } from "../pay-schedule/pay-schedule-modal";
import { PensionModal } from "../pension/pension-modal";
import { Confirm } from "../dialogs/confirm";

@inject(EventAggregator, DialogService)
export class Employer {
    constructor(eventAggregator, dialogService) {
        this.employer = null;
        this.ea = eventAggregator;
        this.dialogService = dialogService;
    }

    activate(params) {
        if (params && params.id) {
            return this.getEmployerDetails(params.id);
        }
    }

    getEmployerDetails(employerId) {
        return new Promise((resolve) => {
            let client = new HttpClient();

            client.get(`/api/employer/${employerId}`).then(data => {
                this.employer = JSON.parse(data.response);

                resolve();
            });
        });
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

    deletePaySchedule(schedule) {
        let opts = {
            viewModel: Confirm,
            model: {
                title: "Are you sure?",
                message: "Are you sure you want to delete this pay schedule?"
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                let client = new HttpClient();

                client.post(`/api/employer/${this.employer.Id}/paySchedule/${schedule.Key}/delete/`).then(res => {
                    let parsedResponse = JSON.parse(res.response);

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                    this.getEmployerDetails(this.employer.Id);
                });
            }
        });        
    }

    openPayScheduleModal(schedule) {
        schedule.employerId = this.employer.Id;
        
        let opts = {
            viewModel: PayScheduleModal,
            model: JSON.parse(JSON.stringify(schedule))
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                this.status = response.output;

                this.getEmployerDetails(this.employer.Id);
            }
        });
    }

    addAPension() {
        this.openPensionModal({});
    }

    editPension(pension) {
        this.openPensionModal(pension);
    }

    openPensionModal(pension) {
        schedule.employerId = this.employer.Id;
        
        let opts = {
            viewModel: PensionModal,
            model: JSON.parse(JSON.stringify(pension))
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                this.status = response.output;

                this.getEmployerDetails(this.employer.Id);
            }
        });
    }
}