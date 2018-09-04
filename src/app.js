import { PLATFORM } from 'aurelia-pal';

export class App {
	configureRouter(config, router) {
		config.title = 'Welcome';
		config.map([
			{ 
				route: '',
				moduleId: PLATFORM.moduleName('welcome/welcome'),
				title: 'Welcome' 
			}
		]);

    	this.router = router;
	}
}