import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { HttpClient } from "aurelia-http-client";
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
			let client = new HttpClient();

            client.get(`/api/job/${job.id}/${job.type}`).then(data => {
				let job = JSON.parse(data.response);
				
				let opts = {
					viewModel: JobDetailsModal,
					model: job
				};
		
				this.dialogService.open(opts);				
            });			
		})
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
			}
		]);

    	this.router = router;
	}
}