import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { PayScheduleModal } from "../pay-schedule/pay-schedule-modal";
import { PensionModal } from "../pension/pension-modal";
import { InfoModal } from "../pay-run/info-modal";
import { NewPayRunModal } from "../pay-run/new-pay-run-modal";
import { RtiTransactionModal } from "../rti-transaction/rti-transaction-modal";
import { Confirm } from "../dialogs/confirm";

@inject(EventAggregator, DialogService)
export class Employer {
    constructor(eventAggregator, dialogService) {
        this.employer = null;
        this.ea = eventAggregator;
        this.dialogService = dialogService;
    }

    activate(params) {
        this.reloadEmployerSubscriber = this.ea.subscribe("employer:reload", state => {
            this.getEmployerDetails(state.employerId);
        });

        if (params && params.id) {
            return this.getEmployerDetails(params.id);
        }
    }

    deactivate() {
        if (this.reloadEmployerSubscriber) {
            this.reloadEmployerSubscriber.dispose();
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

    defaultPensionForAE(employerId, pensionId) {
        let client = new HttpClient();

        client.patch(`/api/employer/${employerId}/pension/${pensionId}`).then(res => {
            let parsedResponse = JSON.parse(res.response);

            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

            this.apiErrors = null;
            this.status = parsedResponse.status;
            this.getEmployerDetails(employerId);
        });        
    }

    deletePension(employerId, pensionId) {
        let client = new HttpClient();

        client.delete(`/api/employer/${employerId}/pension/${pensionId}`).then(res => {
            let parsedResponse = JSON.parse(res.response);

            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

            this.apiErrors = null;
            this.status = parsedResponse.status;
            this.getEmployerDetails(employerId);
        });
    }

    openPensionModal(pension) {
        pension.employerId = this.employer.Id;
        
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

    openPayRunInfoModal(employerId, payScheduleId, payRunId) {
        let url = `api/employer/${employerId}/paySchedule/${payScheduleId}/payRun/${payRunId}`;
        let client = new HttpClient();

        client.get(url).then(res => {
            let payRun = JSON.parse(res.response);

            payRun.EmployerId = this.employer.Id;

            let opts = {
                viewModel: InfoModal,
                model: payRun
            };
    
            this.dialogService.open(opts);
        });
    }

    openAddPayRunModal(employerId, payScheduleId) {
        let url = `/api/employer/${employerId}/paySchedule/${payScheduleId}/next-pay-run`;
        let client = new HttpClient();

        client.get(url).then(res => {
            let nextPayRun = JSON.parse(res.response);
            
            let state = {
                Title: "Create PayRun",
                EmployerId: employerId,
                PayScheduleId: payScheduleId,
                PaymentDate: nextPayRun.paymentDate,
                StartDate: nextPayRun.periodStart,
                EndDate: nextPayRun.periodEnd,
                PaySchedules: []
            };
            
            let opts = {
                viewModel: NewPayRunModal,
                model: state
            };

            this.dialogService.open(opts).whenClosed(response => {
                if (!response.wasCancelled) {
                    this.status = response.output;

                    this.getEmployerDetails(this.employer.Id);
                }
            });
        });        
    }

    openRerunPayRunModal(employerId, payScheduleId, payRun) {
        let state = {
            Title: "Rerun PayRun",
            Instruction: "Re-running will delete the previous run.",
            EmployerId: employerId,
            PayScheduleId: payScheduleId,
            PaymentDate: payRun.PaymentDate,
            StartDate: payRun.PeriodStart,
            EndDate: payRun.PeriodEnd,
            PaySchedules: []
        };
        
        let opts = {
            viewModel: NewPayRunModal,
            model: state
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                this.status = response.output;

                this.getEmployerDetails(this.employer.Id);
            }
        });        
    }

    deletePayRun(employerId, payScheduleId, payRunId) {
        let opts = {
            viewModel: Confirm,
            model: {
                title: "Are you sure?",
                message: "Are you sure you want to delete this pay run?"
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                let client = new HttpClient();

                client.delete(`/api/employer/${employerId}/paySchedule/${payScheduleId}/payRun/${payRunId}`).then(res => {
                    let parsedResponse = JSON.parse(res.response);
        
                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }
        
                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                    this.getEmployerDetails(employerId);
                });
            }
        });
    }

    openAddRtiSubmissionModal(employerId) {
        let client = new HttpClient();

        client.get(`/api/employer/${employerId}/payRuns`).then(res => {
            let payRuns = JSON.parse(res.response);

            let opts = {
                viewModel: RtiTransactionModal,
                model: {
                    employerId: employerId,
                    payRuns: payRuns
                }
            };
    
            this.dialogService.open(opts).whenClosed(response => {
                if (!response.wasCancelled) {
                    this.status = response.output;
    
                    this.getEmployerDetails(this.employer.Id);
                }
            });
        }); 
    }

    deleteEmployee(employerId, employeeId) {
        let opts = {
            viewModel: Confirm,
            model: {
                title: "Are you sure?",
                message: "Are you sure you want to delete this employee?"
            }
        };

        this.dialogService.open(opts).whenClosed(response => {
            if (!response.wasCancelled) {
                let client = new HttpClient();

                client.delete(`/api/employer/${employerId}/employee/${employeeId}`).then(res => {
                    let parsedResponse = JSON.parse(res.response);
        
                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }
        
                    this.apiErrors = null;
                    this.status = parsedResponse.status;
                    this.getEmployerDetails(employerId);
                });
            }
        });        
    }
}