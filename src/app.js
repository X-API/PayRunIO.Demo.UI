import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { JobDetailsModal } from "job/job-details-modal";
import { PLATFORM } from "aurelia-pal";

@inject(EventAggregator, DialogService)
export class App {
    constructor(eventAggregator, dialogService) {
        this.ea = eventAggregator;
        this.dialogService = dialogService;
    }

    activate() {
        this.ea.subscribe("app:view-job", job => {
            let opts = {
                viewModel: JobDetailsModal,
                model: job
            };
    
            this.dialogService.open(opts);
        });
    }

    configureRouter(config, router) {
        config.title = "PayRun.io Demo";

        config.map([
            { 
                route: "",
                moduleId: PLATFORM.moduleName("welcome/welcome"),
                title: "Get started" 
            },
            { 
                route: "employers",
                moduleId: PLATFORM.moduleName("employer/list"),
                title: "Employers" 
            },
            { 
                route: "setup",
                moduleId: PLATFORM.moduleName("welcome/setup"),
                title: "Setup" 
            },
            { 
                route: "employer/:id?",
                moduleId: PLATFORM.moduleName("employer/employer"),
                title: "Employer" 
            },
            { 
                route: "employer/:employerId/employee/:employeeId?",
                moduleId: PLATFORM.moduleName("employee/employee"),
                title: "Employee" 
            }
        ]);

        this.router = router;
    }
}