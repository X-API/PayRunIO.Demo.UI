import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { Router } from "aurelia-router";
import { PayScheduleModal } from "../pay-schedule/pay-schedule-modal";
import { PensionModal } from "../pension/pension-modal";
import { PayCodeModal } from "../pay-code/pay-code-modal";
import { InfoModal } from "../pay-run/info-modal";
import { NewPayRunModal } from "../pay-run/new-pay-run-modal";
import { RtiTransactionModal } from "../rti-transaction/rti-transaction-modal";
import { Confirm } from "../dialogs/confirm";
import { BaseViewModel } from "../base-view-model";

@inject(EventAggregator, DialogService, Router)
export class Employer extends BaseViewModel {
    constructor(eventAggregator, dialogService, router) {
        super(router);

        this.employer = null;
        this.ea = eventAggregator;
        this.dialogService = dialogService;
        this.client = new HttpClient();
    }

    activate(params) {
        this.params = params;

        this.reloadEmployerSubscriber = this.ea.subscribe("employer:reload", state => {
            this.getEmployerDetails(state.employerId);
        });

        $("html, body, ux-dialog-container, ux-dialog, ux-dialog-body").animate({
            scrollTop: 0
        }, 100);

        if (params && params.id) {
            return this.getEmployerDetails(params.id);
        }
    }

    attached() {
        super.setParams(this.params);
        
        if (this.employer) {
            super.setTitle(this.employer.Name);
        }
        else {
            super.setTitle("New Employer");
        }
    }

    deactivate() {
        if (this.reloadEmployerSubscriber) {
            this.reloadEmployerSubscriber.dispose();
        }

        if (this.getPaySchedulesTimeout) {
            window.clearTimeout(this.getPaySchedulesTimeout);
        }

        if (this.getRtiSubmissionsTimeout) {
            window.clearTimeout(this.getRtiSubmissionsTimeout);
        }
    }    

    getEmployerDetails(employerId) {
        return new Promise((resolve) => {
            this.ea.publish("request:processing");

            this.client.get(`/api/employer/${employerId}`).then(data => {
                this.ea.publish("request:complete");

                this.employer = JSON.parse(data.response);

                this.createPaySchedulesTimer();
                this.createRtiSubmissionsTimer();

                resolve();
            });
        });
    }

    getPaySchedules() {
        this.ea.publish("request:processing");

        this.client.get(`/api/employer/${this.employer.Id}/pay-schedules`).then(data => {
            this.ea.publish("request:complete");

            this.employer.PaySchedules = JSON.parse(data.response);

            this.createPaySchedulesTimer();
        });
    }

    createPaySchedulesTimer() {
        this.getPaySchedulesTimeout = window.setTimeout(() => this.getPaySchedules(), 15000);
    }

    getRtiSubmissions() {
        this.ea.publish("request:processing");

        this.client.get(`/api/employer/${this.employer.Id}/rti-submissions`).then(data => {
            this.ea.publish("request:complete");

            this.employer.RTITransactions = JSON.parse(data.response);

            this.createRtiSubmissionsTimer();
        });
    }

    createRtiSubmissionsTimer() {
        this.getRtiSubmissionsTimeout = window.setTimeout(() => this.getRtiSubmissions(), 15000);
    }

    canAddPayRun(context) {
        return context.Employees.length > 0 && context.PaySchedules && context.PaySchedules.length > 0;
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
                this.ea.publish("request:processing");

                this.client.post(`/api/employer/${this.employer.Id}/paySchedule/${schedule.Key}/delete/`).then(res => {
                    this.ea.publish("request:complete");

                    let parsedResponse = JSON.parse(res.response);

                    this.apiErrors = null;
                    this.status = null;

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }

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

    addAPayCode() {
        this.openPayCodeModal({
            Niable: false,
            Taxable: false
        });
    }

    editPayCode(payCode) {
        this.openPayCodeModal(payCode);
    }

    deletePayCode(employerId, payCodeId) {
        this.ea.publish("request:processing");

        this.client.delete(`/api/employer/${employerId}/payCode/${payCodeId}`).then(res => {
            this.ea.publish("request:complete");

            let parsedResponse = JSON.parse(res.response);

            this.apiErrors = null;
            this.status = null;

            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

            this.status = parsedResponse.status;
            this.getEmployerDetails(employerId);
        });
    }

    openPayCodeModal(payCode) {
        payCode.employerId = this.employer.Id;
        
        let model = {
            payCode: JSON.parse(JSON.stringify(payCode)),
            nominalCodes: this.employer.NominalCodes
        };
        let opts = {
            viewModel: PayCodeModal,
            model: model
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
        this.ea.publish("request:processing");

        this.client.patch(`/api/employer/${employerId}/pension/${pensionId}`).then(res => {
            this.ea.publish("request:complete");

            let parsedResponse = JSON.parse(res.response);

            this.apiErrors = null;
            this.status = null;

            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

            this.status = parsedResponse.status;
            this.getEmployerDetails(employerId);
        });        
    }

    deletePension(employerId, pensionId) {
        this.ea.publish("request:processing");

        this.client.delete(`/api/employer/${employerId}/pension/${pensionId}`).then(res => {
            this.ea.publish("request:complete");

            let parsedResponse = JSON.parse(res.response);

            this.apiErrors = null;
            this.status = null;

            if (parsedResponse.errors) {
                this.apiErrors = parsedResponse.errors;
                return;
            }

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
        
        this.ea.publish("request:processing");

        this.client.get(url).then(res => {
            this.ea.publish("request:complete");

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
        
        this.ea.publish("request:processing");

        this.client.get(url).then(res => {
            this.ea.publish("request:complete");

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
                this.ea.publish("request:processing");

                this.client.delete(`/api/employer/${employerId}/paySchedule/${payScheduleId}/payRun/${payRunId}`).then(res => {
                    this.ea.publish("request:complete");

                    let parsedResponse = JSON.parse(res.response);
        
                    this.apiErrors = null;
                    this.status = null;

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }
        
                    this.status = parsedResponse.status;
                    this.getEmployerDetails(employerId);
                });
            }
        });
    }

    openAddRtiSubmissionModal(employerId) {
        this.ea.publish("request:processing");

        this.client.get(`/api/employer/${employerId}/payRuns`).then(res => {
            this.ea.publish("request:complete");

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
                this.ea.publish("request:processing");

                this.client.delete(`/api/employer/${employerId}/employee/${employeeId}`).then(res => {
                    this.ea.publish("request:complete");

                    let parsedResponse = JSON.parse(res.response);
        
                    this.apiErrors = null;
                    this.status = null;

                    if (parsedResponse.errors) {
                        this.apiErrors = parsedResponse.errors;
                        return;
                    }
        
                    this.status = parsedResponse.status;
                    this.getEmployerDetails(employerId);
                });
            }
        });        
    }
}