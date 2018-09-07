import { PLATFORM } from 'aurelia-pal';

export class App {
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