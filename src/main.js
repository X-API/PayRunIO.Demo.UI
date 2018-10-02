import { PLATFORM } from "aurelia-pal";
import environment from "./environment";

export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .plugin("aurelia-validation")
        .plugin(PLATFORM.moduleName("aurelia-dialog"), config => {
            config.useDefaults();
            config.settings.centerHorizontalOnly = true;
        })
        .feature("resources");

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin("aurelia-testing");
    }

    return aurelia.start().then(() => aurelia.setRoot());
}
