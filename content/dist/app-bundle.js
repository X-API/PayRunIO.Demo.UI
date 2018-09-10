define('welcome/welcome',["exports", "aurelia-http-client"], function (exports, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Welcome = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Welcome = exports.Welcome = function () {
        function Welcome() {
            _classCallCheck(this, Welcome);
        }

        Welcome.prototype.activate = function activate() {
            var _this = this;

            var client = new _aureliaHttpClient.HttpClient();

            client.get("/api/has-been-setup").then(function (data) {
                _this.state = JSON.parse(data.response);
            });
        };

        Welcome.prototype.deactivate = function deactivate() {};

        return Welcome;
    }();
});
define('text!welcome/welcome.html', ['module'], function(module) { module.exports = "<template>\n    <h1 class=\"display-4\">Demo-UI Project</h1>\n  \n    <p class=\"lead\">\n        A few things to note before getting started:\n        <ul>\n            <li>Please open a developer account at <a href=\"https://developer.payrun.io/Account/Register\" target=\"_blank\">https://developer.payrun.io/Account/Register</a> </li> and use the keys you are issued.\n            <li>This is demonstration software and is provided without support, warranty or liability.</li>\n            <li>This software is built against the latest browsers (Chrome, Firefox, Safari or MS Edge) and may not function as intended on older browsers.</li>\n            <li>Under no circumstances should you run this software as-is in a production environment. Fork it and make it your own!</li>\n            <li>The application is written in NodeJS and the <a href=\"https://github.com/X-API/PayRunIO.Demo.UI\" target=\"_blank\">source code is available on GitHub</a>.</li>\n            <li>This project has been open-sourced under <a href=\"https://github.com/X-API/PayRunIO.Demo.UI/blob/master/LICENSE\" target=\"_blank\">\"The Unlicense\"</a> license.</li>\n            <li>Finally, this project is <strong>WORK IN PROGRESS</strong>, there are areas of unfinished, missing or broken functionality. If you discover an issue then please either <a href=\"https://github.com/X-API/PayRunIO.Demo.UI/issues\" target=\"_blank\">log it as in issue in GitHub</a> or <a href=\"https://github.com/X-API/PayRunIO.Demo.UI/pulls\" target=\"_blank\">submit a Pull Request</a> with your proposed fix.</li>\n        </ul>\n\n        Get started by clicking on `Get started` below.\n    </p>\n\n    <p class=\"lead\">\n        <a class=\"btn btn-primary btn-lg\" href=\"#employers\" role=\"button\" if.bind=\"state.hasBeenSetup\">Get started</a>\n        <a class=\"btn btn-primary btn-lg\" href=\"#setup\" role=\"button\" if.bind=\"!state.hasBeenSetup\">Get started</a>\n    </p>\n</template>"; });
define('welcome/setup',["exports", "aurelia-framework", "aurelia-http-client", "aurelia-validation", "aurelia-router"], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaValidation, _aureliaRouter) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Setup = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Setup = exports.Setup = (_dec = (0, _aureliaFramework.inject)(_aureliaValidation.ValidationControllerFactory, _aureliaRouter.Router), _dec(_class = function () {
        function Setup(controllerFactory, router) {
            _classCallCheck(this, Setup);

            this.controller = controllerFactory.createForCurrentScope();
            this.router = router;
            this.client = new _aureliaHttpClient.HttpClient();
        }

        Setup.prototype.activate = function activate() {
            var _this = this;

            this.client.get("/api/setup").then(function (data) {
                _this.state = JSON.parse(data.response);
                _this.environments = ["Test", "Production"];

                _this.setupValidationRules();
            });
        };

        Setup.prototype.setupValidationRules = function setupValidationRules() {
            _aureliaValidation.ValidationRules.ensure("ConsumerSecret").required().withMessage("Consumer Secret is required").ensure("ConsumerKey").required().withMessage("Consumer Key is required").ensure("Environment").required().withMessage("Environment is required").on(this.state);
        };

        Setup.prototype.save = function save() {
            var _this2 = this;

            var data = {
                Environment: this.state.Environment,
                ConsumerKey: this.state.ConsumerKey,
                ConsumerSecret: this.state.ConsumerSecret
            };

            this.controller.validate().then(function (result) {
                if (result.valid) {
                    _this2.client.post("/api/setup", data).then(function () {
                        _this2.router.navigate("employers");
                    });
                }
            });
        };

        return Setup;
    }()) || _class);
});
define('text!welcome/setup.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../resources/elements/validation-errors/validation-errors\"></require>\n\n    <div class=\"setup\">\n        <validation-errors errors.bind=\"controller.errors\"></validation-errors>\n\n        <div class=\"row\">\n            <div class=\"col-sm-12\">\n                <div class=\"jumbotron\">\n                    <h3>Setup</h3>\n    \n                    <p class=\"lead\">\n                        Before getting started with the API <a href=\"https://developer.payrun.io/Account/Register\" target=\"_blank\">register</a> to retrieve your consumer key and secret.\n                    </p>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-sm-12\">\n                <div class=\"form-group\">\n                    <label for=\"Environment\">Environment</label>\n\n                    <select \n                        class=\"form-control\" \n                        id=\"Environment\" \n                        name=\"Environment\" \n                        value.bind=\"state.Environment & validate\">\n                        <option model.bind=\"null\">Please Choose...</option>\n                        <option repeat.for=\"env of environments\" value.bind=\"env\">\n                            ${env}\n                        </option>\n                    </select>\n\n                    <span class=\"notes\">\n                        See <a href=\"https://developer.payrun.io/docs/getting-started/environments.html\" target=\"_blank\">Environments</a> for more information on the available environments. \n                    </span>\n                </div>\n\n                <div class=\"form-group\">\n                    <label for=\"ConsumerKey\">Consumer Key</label>\n                    <input id=\"ConsumerKey\" \n                        name=\"ConsumerKey\" \n                        type=\"text\" \n                        class=\"form-control\" \n                        value.bind=\"state.ConsumerKey & validate\">\n                </div>\n\n                <div class=\"form-group\">\n                    <label for=\"ConsumerSecret\">Consumer Secret</label>\n                    <input id=\"ConsumerSecret\" \n                        name=\"ConsumerSecret\" \n                        type=\"text\" \n                        class=\"form-control\" \n                        value.bind=\"state.ConsumerSecret & validate\">\n                </div>            \n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-sm-12 text-right\">\n                <button type=\"submit\" class=\"btn btn-primary\" click.delegate=\"save()\">Setup and get started</button>\n            </div>\n        </div>\n    </div>    \n</template>"; });
define('resources/value-converters/short-date',["exports", "moment"], function (exports, moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var ShortDateValueConverter = exports.ShortDateValueConverter = function () {
		function ShortDateValueConverter() {
			_classCallCheck(this, ShortDateValueConverter);
		}

		ShortDateValueConverter.prototype.toView = function toView(value) {
			if (value) {
				return moment(value).format("YYYY-MM-DD");
			}

			return "";
		};

		return ShortDateValueConverter;
	}();
});
define('resources/value-converters/long-date-time',["exports", "moment"], function (exports, moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var LongDateTimeValueConverter = exports.LongDateTimeValueConverter = function () {
		function LongDateTimeValueConverter() {
			_classCallCheck(this, LongDateTimeValueConverter);
		}

		LongDateTimeValueConverter.prototype.toView = function toView(value) {
			if (value) {
				return moment(value).format("YYYY-MM-DD HH:mm:ss");
			}

			return "";
		};

		return LongDateTimeValueConverter;
	}();
});
define('resources/value-converters/employee-name',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var EmployeeNameValueConverter = exports.EmployeeNameValueConverter = function () {
		function EmployeeNameValueConverter() {
			_classCallCheck(this, EmployeeNameValueConverter);
		}

		EmployeeNameValueConverter.prototype.toView = function toView(employee) {
			var firstname = employee.FirstName || employee.Initials;

			var parts = [employee.Title, firstname, employee.MiddleName, employee.LastName].filter(function (part) {
				return part !== undefined && part !== null && part.trim().length > 0;
			});

			return parts.join(" ");
		};

		return EmployeeNameValueConverter;
	}();
});
define('resources/value-converters/bank-account',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var BankAccountValueConverter = exports.BankAccountValueConverter = function () {
		function BankAccountValueConverter() {
			_classCallCheck(this, BankAccountValueConverter);
		}

		BankAccountValueConverter.prototype.toView = function toView(account) {
			if (account) {
				var parts = [account.AccountName, account.AccountNumber, account.SortCode].filter(function (part) {
					return part !== null && part !== undefined && part.trim().length > 0;
				});

				return parts.join("<br />");
			}

			return "";
		};

		return BankAccountValueConverter;
	}();
});
define('resources/value-converters/address',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var AddressValueConverter = exports.AddressValueConverter = function () {
		function AddressValueConverter() {
			_classCallCheck(this, AddressValueConverter);
		}

		AddressValueConverter.prototype.toView = function toView(address) {
			if (address) {
				var parts = [address.Address1, address.Address2, address.Address3, address.Address4, address.Country, address.Postcode].filter(function (part) {
					return part !== null && part !== undefined && part.trim().length > 0;
				});

				return parts.join("<br />");
			}

			return "";
		};

		return AddressValueConverter;
	}();
});
define('resources/index',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.configure = configure;
	function configure(config) {
		config.globalResources(["./value-converters/address", "./value-converters/bank-account", "./value-converters/employee-name", "./value-converters/long-date-time", "./value-converters/short-date"]);
	}
});
define('resources/elements/validation-errors/validation-errors',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ValidationErrors = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var ValidationErrors = exports.ValidationErrors = (_dec = (0, _aureliaFramework.customElement)("validation-errors"), _dec(_class = (_class2 = function ValidationErrors() {
        _classCallCheck(this, ValidationErrors);

        _initDefineProp(this, "errors", _descriptor, this);
    }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "errors", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return null;
        }
    })), _class2)) || _class);
});
define('text!resources/elements/validation-errors/validation-errors.html', ['module'], function(module) { module.exports = "<template>\n    <div id=\"validation-errors\" class=\"alert alert-danger\" role=\"alert\" if.bind=\"errors.length > 0\">\n        <p>\n            <strong>\n                Please fix the below errors:\n            </strong>\n        </p>\n    \n        <ul>\n            <li repeat.for=\"error of errors\">\n                ${error.message}\n            </li>\n        </ul>\n    </div>\n</template>"; });
define('resources/elements/status/status',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Status = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var Status = exports.Status = (_dec = (0, _aureliaFramework.customElement)("status"), _dec(_class = (_class2 = function Status() {
        _classCallCheck(this, Status);

        _initDefineProp(this, "status", _descriptor, this);
    }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "status", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return null;
        }
    })), _class2)) || _class);
});
define('text!resources/elements/status/status.html', ['module'], function(module) { module.exports = "<template>\n    \n</template>"; });
define('resources/elements/router-progress-indicator/router-progress-indicator',["exports", "aurelia-framework", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RouterProgressIndicator = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var RouterProgressIndicator = exports.RouterProgressIndicator = (_dec = (0, _aureliaFramework.customElement)("router-progress-indicator"), _dec2 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = _dec2(_class = function () {
        function RouterProgressIndicator(EventAggregator) {
            _classCallCheck(this, RouterProgressIndicator);

            this.ea = EventAggregator;
            this.visible = false;
        }

        RouterProgressIndicator.prototype.attached = function attached() {
            this.processingSubscriber = this.ea.subscribe("router:navigation:processing", function () {
                NProgress.start();
            });

            this.completeSubscriber = this.ea.subscribe("router:navigation:complete", function () {
                NProgress.done();
            });
        };

        RouterProgressIndicator.prototype.detached = function detached() {
            this.processingSubscriber.dispose();
            this.completeSubscriber.dispose();
        };

        return RouterProgressIndicator;
    }()) || _class) || _class);
});
define('text!resources/elements/router-progress-indicator/router-progress-indicator.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('resources/elements/coming-soon/coming-soon',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ComingSoon = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ComingSoon = exports.ComingSoon = (_dec = (0, _aureliaFramework.customElement)("coming-soon"), _dec(_class = function ComingSoon() {
    _classCallCheck(this, ComingSoon);
  }) || _class);
});
define('text!resources/elements/coming-soon/coming-soon.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"coming-soon\">\n        <h4>Coming soon!</h4>\n    \n        <p>Check soon to see this functionality wired up with the API</p>\n    </div>\n</template>"; });
define('pay-schedule/add-pay-schedule-modal',["exports", "aurelia-framework", "aurelia-dialog", "aurelia-validation", "aurelia-http-client"], function (exports, _aureliaFramework, _aureliaDialog, _aureliaValidation, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AddPayScheduleModal = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var AddPayScheduleModal = exports.AddPayScheduleModal = (_dec = (0, _aureliaFramework.inject)(_aureliaValidation.ValidationControllerFactory, _aureliaDialog.DialogController), _dec(_class = function () {
        function AddPayScheduleModal(controllerFactory, dialogController) {
            _classCallCheck(this, AddPayScheduleModal);

            this.dialogController = dialogController;
            this.validationController = controllerFactory.createForCurrentScope();
            this.client = new _aureliaHttpClient.HttpClient();
        }

        AddPayScheduleModal.prototype.activate = function activate(state) {
            this.state = state;
            this.frequencies = [{ text: "Weekly", value: "Weekly" }, { text: "Monthly", value: "Monthly" }, { text: "Two weekly", value: "TwoWeekly" }, { text: "Four weekly", value: "FourWeekly" }];

            this.setupValidationRules();
        };

        AddPayScheduleModal.prototype.setupValidationRules = function setupValidationRules() {
            _aureliaValidation.ValidationRules.ensure("Name").required().withMessage("Name is required").ensure("PayFrequency").required().withMessage("Pay Frequency is required").on(this.state);
        };

        AddPayScheduleModal.prototype.save = function save() {
            var _this = this;

            var data = {
                Id: this.state.Key,
                Name: this.state.Name,
                PayFrequency: this.state.PayFrequency
            };

            this.validationController.validate().then(function (result) {
                if (result.valid) {
                    _this.client.post("/api/employer/" + _this.state.employerId + "/paySchedule", data).then(function () {
                        _this.dialogController.ok();
                    });
                }
            });
        };

        return AddPayScheduleModal;
    }()) || _class);
});
define('text!pay-schedule/add-pay-schedule-modal.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../resources/elements/validation-errors/validation-errors\"></require>\n\n    <ux-dialog>\n        <ux-dialog-header>\n            <h5>Pay schedule</h5>\n        </ux-dialog-header>\n        <ux-dialog-body>\n            <div class=\"container-fluid\">\n                <validation-errors errors.bind=\"validationController.errors\"></validation-errors>\n\n                <div class=\"row\">\n                    <div class=\"col-sm-12\">\n                        <div class=\"form-group\">\n                            <label for=\"Name\">Name</label>\n                            <input type=\"text\" \n                                class=\"form-control form-control-lg\" \n                                id=\"Name\" \n                                name=\"Name\" \n                                value.bind=\"state.Name & validate\" \n                                placeholder=\"Name of the pay schedule that unique identifies it\" \n                                maxlength=\"35\">\n                        </div>\n                    \n                        <div class=\"form-group\">\n                            <label for=\"PayFrequency\">Pay Frequency</label>\n                    \n                            <select id=\"PayFrequency\" \n                                name=\"PayFrequency\" \n                                class=\"form-control form-control-lg\" \n                                value.bind=\"state.PayFrequency & validate\">\n                                <option model.bind=\"null\">Please Choose...</option>\n                                <option repeat.for=\"freq of frequencies\" value.bind=\"freq.value\">\n                                    ${freq.text}\n                                </option>\n                            </select>\n                        </div>                        \n                    </div>\n                </div>\n            </div>\n        </ux-dialog-body>\n\n        <ux-dialog-footer>\n            <button class=\"btn btn-secondary\" click.trigger=\"dialogController.cancel()\">Cancel</button>\n            <button class=\"btn btn-primary\" click.trigger=\"save()\">Ok</button>\n        </ux-dialog-footer>\n    </ux-dialog>\n</template>    "; });
define('main',["exports", "aurelia-pal", "./environment"], function (exports, _aureliaPal, _environment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.configure = configure;

	var _environment2 = _interopRequireDefault(_environment);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function configure(aurelia) {
		aurelia.use.standardConfiguration().plugin("aurelia-validation").plugin(_aureliaPal.PLATFORM.moduleName("aurelia-dialog")).feature("resources");

		if (_environment2.default.debug) {
			aurelia.use.developmentLogging();
		}

		if (_environment2.default.testing) {
			aurelia.use.plugin('aurelia-testing');
		}

		return aurelia.start().then(function () {
			return aurelia.setRoot();
		});
	}
});
define('header/header',["exports", "aurelia-framework", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Header = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Header = exports.Header = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function Header(EventAggregator) {
            _classCallCheck(this, Header);

            this.ea = EventAggregator;
        }

        Header.prototype.attached = function attached() {};

        Header.prototype.toggleAPICalls = function toggleAPICalls() {
            this.ea.publish("toggleAPICalls");
        };

        return Header;
    }()) || _class);
});
define('text!header/header.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <nav class=\"navbar\">\n            <a class=\"navbar-brand\" href=\"/\">\n                <img src=\"https://www.payrun.io/images/logo-white-bg.png\">\n            </a>\n\n            <div class=\"justify-content-end\" id=\"navbarCollapse\">\n                <ul class=\"navbar-nav\">\n                    <li class=\"nav-item d-none d-md-block\">\n                        <a class=\"nav-link view-api-calls\" href=\"#\" click.delegate=\"toggleAPICalls()\">View API calls</a>\n                    </li>\n                </ul>\n            </div>\n        </nav>\n    </div>    \n</template>"; });
define('footer/footer',["exports", "aurelia-http-client"], function (exports, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Footer = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Footer = exports.Footer = function () {
        function Footer() {
            _classCallCheck(this, Footer);
        }

        Footer.prototype.attached = function attached() {
            var _this = this;

            var client = new _aureliaHttpClient.HttpClient();

            client.get("/api/version").then(function (data) {
                _this.state = JSON.parse(data.response);
            });
        };

        return Footer;
    }();
});
define('text!footer/footer.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container footer\">\n        <div class=\"row\">\n            <div class=\"col-sm-6\">\n                <!-- Buttons from https://buttons.github.io/ -->\n                <a class=\"github-button\" href=\"https://github.com/X-API/PayRunIO.Demo.UI/fork\" data-size=\"large\" aria-label=\"Fork X-API/PayRunIO.Demo.UI on GitHub\">Fork</a>\n                <a class=\"github-button\" href=\"https://github.com/X-API/PayRunIO.Demo.UI/subscription\" data-size=\"large\" aria-label=\"Watch X-API/PayRunIO.Demo.UI on GitHub\">Watch</a>\n                <a class=\"github-button\" href=\"https://github.com/X-API/PayRunIO.Demo.UI/issues\" data-size=\"large\" aria-label=\"Issue X-API/PayRunIO.Demo.UI on GitHub\">Issues</a>\n                <a class=\"github-button\" href=\"https://github.com/X-API/PayRunIO.Demo.UI/archive/master.zip\" data-size=\"large\" aria-label=\"Download X-API/PayRunIO.Demo.UI on GitHub\">Download</a>\n            </div>\n            <div class=\"col-sm-6\">\n                <p>Demo Version: ${state.version}</p>\n                <p>API Version: ${state.apiVersion}</p>\n            </div>\n        </div>\n\n        <script src=\"https://buttons.github.io/buttons.js\"></script>\n    </div>\n</template>"; });
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('employer/list',["exports", "aurelia-http-client"], function (exports, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.List = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var List = exports.List = function () {
        function List() {
            _classCallCheck(this, List);
        }

        List.prototype.activate = function activate() {
            var _this = this;

            var client = new _aureliaHttpClient.HttpClient();

            client.get("/api/employers").then(function (data) {
                _this.employers = JSON.parse(data.response);

                console.log(_this.employers);
            });
        };

        return List;
    }();
});
define('text!employer/list.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row actions\">\n        <div class=\"col-sm-12\">\n            <a class=\"btn btn-primary btn-lg\" href=\"#employer/\" role=\"button\">Add a new employer</a>\n        </div>\n    </div>\n\n    <table class=\"table\" if.bind=\"employers.length > 0\">\n        <thead>\n            <tr>\n                <th scope=\"col\">Name</th>\n                <th scope=\"col\">PAYE Ref</th>\n                <th scope=\"col\">Pay Schedules\n                    <div class=\"row th-subheader\">\n                        <div class=\"col-sm-12 col-md-12\">\n                            <div class=\"row\">\n                                <div class=\"col-sm-4\">\n                                    Name\n                                </div>      \n                                <div class=\"col-sm-2\">\n                                    Pay Frequency\n                                </div>   \n                                <div class=\"col-sm-2\">\n                                    Employees\n                                </div>   \n                                <div class=\"col-sm-2\">\n                                    Last Pay Date\n                                </div>   \n                                <div class=\"col-sm-2\">\n                                    Next Pay Date\n                                </div>   \n                            </div>\n                        </div>\n                    </div>\n                </th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"employer of employers\">\n                <th scope=\"row\">\n                    <a href=\"#employer/${employer.Key}\">\n                        ${employer.Name}\n                    </a>\n                </th>\n                <td>${employer.TaxOfficeNumber}/${employer.TaxOfficeReference}</td>\n                <td>\n                    <div class=\"row\" if.bind=\"employer.PaySchedule.length > 0\">\n                        <div class=\"col-sm-12 col-md-12\">\n                            <div class=\"row\" repeat.for=\"paySchedule of employer.PaySchedule\">\n                                <div class=\"col-sm-4\">\n                                    ${paySchedule.Name}\n                                </div>      \n                                <div class=\"col-sm-2\">\n                                    ${paySchedule.PayFrequency}\n                                </div>   \n                                <div class=\"col-sm-2\">\n                                    ${paySchedule.EmployeeCount}\n                                </div> \n                                <div class=\"col-sm-2\">\n                                    <span if.bind=\"paySchedule.LastPayDay\">${paySchedule.LastPayDay}</span>\n                                    <span if.bind=\"!paySchedule.LastPayDay\">\n                                        <em>Never</em>\n                                    </span>\n                                </div>\n                                <div class=\"col-sm-2\">\n                                    <span if.bind=\"paySchedule.NextPayDay\">${paySchedule.NextPayDay}</span>\n                                    <span if.bind=\"!paySchedule.NextPayDay\">-</span>\n                                </div>     \n                            </div>\n                        </div>\n                    </div>\n\n                    <a if.bind=\"employer.PaySchedule.length === 0\"\n                        class=\"btn btn-sm btn-default launch-modal\" \n                        data-modal-title=\"Add Pay Schedule\"\n                        href=\"#employer/${employer.Key}/paySchedule/new\" \n                        role=\"button\">Add a Pay Schedule</a>\n                </td>\n            </tr>\n      </tbody>\n    </table>\n</template>"; });
define('employer/employer',["exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-http-client", "aurelia-dialog", "../pay-schedule/add-pay-schedule-modal"], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaHttpClient, _aureliaDialog, _addPayScheduleModal) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Employer = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Employer = exports.Employer = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _aureliaDialog.DialogService), _dec(_class = function () {
        function Employer(eventAggregator, dialogService) {
            _classCallCheck(this, Employer);

            this.employer = null;
            this.ea = eventAggregator;
            this.dialogService = dialogService;
        }

        Employer.prototype.activate = function activate(params) {
            var _this = this;

            if (params && params.id) {
                var client = new _aureliaHttpClient.HttpClient();

                client.get("/api/employer/" + params.id).then(function (data) {
                    _this.employer = JSON.parse(data.response);
                });
            }
        };

        Employer.prototype.canAddPayRun = function canAddPayRun(context) {
            return context.Employees.length > 0 && context.PaySchedules.PaySchedulesTable.PaySchedule && context.PaySchedules.PaySchedulesTable.PaySchedule.length > 0;
        };

        Employer.prototype.addAPaySchedule = function addAPaySchedule() {
            this.openPayScheduleModal({});
        };

        Employer.prototype.editPaySchedule = function editPaySchedule(schedule) {
            this.openPayScheduleModal(schedule);
        };

        Employer.prototype.openPayScheduleModal = function openPayScheduleModal(schedule) {
            schedule.employerId = this.employer.Id;

            var opts = {
                viewModel: _addPayScheduleModal.AddPayScheduleModal,
                model: JSON.parse(JSON.stringify(schedule))
            };

            this.dialogService.open(opts).whenClosed(function (response) {
                if (!response.wasCancelled) {}
            });
        };

        return Employer;
    }()) || _class);
});
define('text!employer/employer.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./employer-form\"></require>\n    <require from=\"../resources/elements/status/status\"></require>\n\n    <status></status>\n    \n    <div if.bind=\"employer\">\n        <ul class=\"nav nav-tabs nav-fill\" id=\"myTab\" role=\"tablist\">\n            <li class=\"nav-item\">\n                <a class=\"nav-link active\" id=\"home-tab\" data-toggle=\"tab\" href=\"#home\" role=\"tab\" aria-controls=\"home\" aria-selected=\"true\">Employer</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"schedules-tab\" data-toggle=\"tab\" href=\"#schedules\" role=\"tab\" aria-controls=\"schedules\" aria-selected=\"false\">Pay Schedules</a>\n            </li>        \n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"employees-tab\" data-toggle=\"tab\" href=\"#employees\" role=\"tab\" aria-controls=\"employees\" aria-selected=\"false\">Employees</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"pensions-tab\" data-toggle=\"tab\" href=\"#pensions\" role=\"tab\" aria-controls=\"pensions\" aria-selected=\"false\">Pensions</a>\n            </li>        \n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"runs-tab\" data-toggle=\"tab\" href=\"#runs\" role=\"tab\" aria-controls=\"runs\" aria-selected=\"false\">Pay Runs</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"rti-submissions-tab\" data-toggle=\"tab\" href=\"#rti-submissions\" role=\"tab\" aria-controls=\"rti-submissions\" aria-selected=\"false\">RTI Submissions</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"reports-tab\" data-toggle=\"tab\" href=\"#reports\" role=\"tab\" aria-controls=\"reports\" aria-selected=\"false\">Reports</a>\n            </li>       \n        </ul>\n    \n        <div class=\"tab-content\" id=\"myTabContent\">\n            <div class=\"tab-pane fade show active\" id=\"home\" role=\"tabpanel\" aria-labelledby=\"home-tab\">\n                <employer-form employer.bind=\"employer\"></employer-form>\n            </div>\n            \n            <div class=\"tab-pane fade\" id=\"employees\" role=\"tabpanel\" aria-labelledby=\"employees-tab\">\n                <div class=\"row actions\">\n                    <div class=\"col-sm-12\">\n                        <a class=\"btn btn-primary\" href=\"#employer/${employer.Id}/employee\" role=\"button\">Add a new employee</a>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.Employees.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Code</th>\n                            <th scope=\"col\">Name</th>\n                            <th scope=\"col\">Address</th>\n                            <th scope=\"col\">Bank Account</th>\n                            <th width=\"50px\"></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"employee of employer.Employees\">\n                            <th scope=\"row\">\n                                <a href=\"#employer/${employer.Id}/employee/${employee.Id}\">\n                                    ${employee.Code}\n                                </a>\n                            </th>\n                            <td>${employee | employeeName}</td>\n                            <td innerhtml.bind=\"employee.Address | address\"></td>\n                            <td innerhtml.bind=\"employee.BankAccount | bankAccount\"></td>\n                            <td>\n                                <!--<a class=\"btn btn-link\" \n                                    data-pay-schedule-id=\"{{this.Id}}\" \n                                    data-employer-id=\"{{../Id}}\">Add leaver details</a>\n                                <br>                            \n                                <a class=\"btn btn-link\" \n                                    data-pay-schedule-id=\"{{this.Id}}\" \n                                    data-employer-id=\"{{../Id}}\">Download P45</a>\n                                <br>\n                                <a class=\"btn btn-link\" href=\"/Employer/{{../Id}}/Employee/{{Id}}/p60\">Download P60</a>\n                                <br>\n                                <a class=\"btn btn-link btn-danger\">Delete</a>-->\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>                           \n            </div>\n            \n            <div class=\"tab-pane fade\" id=\"schedules\" role=\"tabpanel\" aria-labelledby=\"schedules-tab\">\n                <div class=\"row actions\">\n                    <div class=\"col-sm-12\">\n                        <a class=\"btn btn-primary\"\n                            href=\"#\" \n                            role=\"button\" \n                            click.delegate=\"addAPaySchedule()\">Add a Pay Schedule</a>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.PaySchedules.PaySchedulesTable.PaySchedule.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Id</th>\n                            <th scope=\"col\">Name</th>\n                            <th scope=\"col\">Frequency</th>\n                            <th scope=\"col\">Employees</th>\n                            <th scope=\"col\">Last Pay Day</th>\n                            <th scope=\"col\">Next Pay Day</th>\n                            <th width=\"50px\"></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"schedule of employer.PaySchedules.PaySchedulesTable.PaySchedule\">\n                            <th scope=\"row\">\n                                <a href=\"#\" click.delegate=\"editPaySchedule(schedule)\">\n                                    ${schedule.Key}\n                                </a>\n                            </th>\n                            <td>${schedule.Name}</td>\n                            <td>${schedule.PayFrequency}</td>\n                            <td>${schedule.EmployeeCount}</td>\n                            <td>\n                                <span if.bind=\"schedule.LastPayDay\">${schedule.LastPayDay}</span>\n\n                                <span if.bind=\"!schedule.LastPayDay\">\n                                    <em>Never</em>\n                                </span>\n                            </td>\n                            <td>\n                                <span if.bind=\"schedule.NextPayDay\">${schedule.NextPayDay}</span>\n\n                                <span if.bind=\"!schedule.NextPayDay\">-</span>\n                            </td>\n                            <td>\n                                <button type=\"button\" \n                                    class=\"btn btn-danger btn-sm btn-delete-pay-schedule\" \n                                    data-pay-schedule-id=\"${schedule.Key}\" \n                                    data-employer-id=\"${employer.Id}\">Delete\n                                </button>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n    \n            <div class=\"tab-pane fade\" id=\"runs\" role=\"tabpanel\" aria-labelledby=\"runs-tab\">\n                <div class=\"card bg-light\" if.bind=\"!canAddPayRun(employer)\">\n                    <div class=\"card-header\">Pay Runs</div>\n                    <div class=\"card-body\">\n                        <p class=\"card-text\">\n                            Add a <strong>Pay Schedule</strong> and an <strong>Employee</strong> before starting a pay run.\n                        </p>\n                    </div>\n                </div>\n    \n                <div class=\"job-info-container\"></div>\n    \n                <div class=\"card bg-light\" repeat.for=\"schedule of employer.PaySchedules.PaySchedulesTable.PaySchedule\">\n                    <div class=\"card-header\">\n                        <h6 class=\"float-left\">${schedule.Name}</h6>\n                    </div>\n                    <div class=\"card-body\">\n                        <table class=\"table\" if.bind=\"schedule.PayRuns.length > 0\">\n                            <thead>\n                                <tr>\n                                    <th scope=\"col\">Payment Date</th>\n                                    <th scope=\"col\">Tax Period</th>\n                                    <th scope=\"col\">Pay Period</th>\n                                    <th scope=\"col\">Supplementary</th>\n                                    <th scope=\"col\">\n                                        <a class=\"btn btn-sm btn-primary launch-modal float-right\" \n                                            data-modal-title=\"Create PayRun\"\n                                            data-pay-schedule-id=\"${schedule.Key}\" \n                                            href=\"#employer/${employer.Id}/payRun?paySchedule=${schedule.Key}\" \n                                            role=\"button\">Add PayRun</a>\n                                    </th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr repeat.for=\"payrun of schedule.PayRuns\">\n                                    <th scope=\"row\">\n                                        <a href=\"#employer/${employer.Id}/paySchedule/${schedule.Key}/payRun/${payrun.Key}\">\n                                            ${payrun.PaymentDate | shortDate}\n                                        </a>\n                                    </th>\n                                    <td>${payrun.TaxYear}/${payrun.TaxPeriod}</td>\n                                    <td>${payrun.PeriodStart | shortDate} - ${payrun.PeriodEnd | shortDate}</td>\n                                    <td>${payrun.IsSupplementary}</td>\n                                    <td class=\"text-right\">\n                                        <button if.bind=\"schedule.HeadSequence == payrun.Sequence\"\n                                            type=\"button\" \n                                            class=\"btn btn-sm btn-rerun-pay-run launch-modal\" \n                                            data-modal-title=\"Rerun PayRun\"\n                                            href=\"#employer/${employer.Id}/reRun?paySchedule=${schedule.Key}&payRunId=${payrun.Key}\">Rerun\n                                        </button>\n                                        <button if.bind=\"schedule.HeadSequence == payrun.Sequence\"\n                                            type=\"button\" \n                                            class=\"btn btn-danger btn-sm btn-delete-pay-run\" \n                                            data-pay-run-id=\"${payrun.Key}\"\n                                            data-pay-schedule-id=\"${schedule.Key}\"  \n                                            data-employer-id=\"${employer.Id}\">Delete\n                                        </button>          \n                                    </td>\n                                </tr>\n                            </tbody>\n                        </table>\n\n                        <p class=\"card-text\" if.bind=\"schedule.PayRuns.length === 0\">\n                            There are currently no payruns for this pay schedule.\n                            \n                            <a class=\"btn btn-sm btn-primary launch-modal\" \n                                href=\"#employer/${employer.Id}/payRun?paySchedule=${schedule.Key}\" \n                                data-modal-title=\"Create PayRun\"\n                                role=\"button\">Add PayRun</a>\n                        </p>\n                    </div>\n                </div>\n            </div>\n    \n            <div class=\"tab-pane fade\" id=\"pensions\" role=\"tabpanel\" aria-labelledby=\"pensions-tab\">\n                <div class=\"row actions\">\n                    <div class=\"col-sm-12\">\n                        <a class=\"btn btn-primary\" href=\"#employer/${employer.Id}/pension\" role=\"button\">Add a Pension</a>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.Pensions.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Id</th>\n                            <th scope=\"col\">Scheme</th>\n                            <th scope=\"col\">Provider</th>\n                            <th scope=\"col\">Provider Employer Ref</th>\n                            <th width=\"50px\"></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"pension of employer.Pensions\">\n                            <th scope=\"row\">\n                                <a href=\"#employer/${employer.Id}/pension/${pension.Id}\">\n                                    ${pension.Id}\n                                </a>                            \n                            </th>\n                            <td>${pension.SchemeName}</td>\n                            <td>${pension.ProviderName}</td>\n                            <td>${pension.ProviderEmployerRef}</td>\n                            <td>\n                                <button if.bind=\"!pension.UseForAutoEnrolment\"\n                                    type=\"button\" \n                                    class=\"btn btn-link btn-primary btn-sm btn-default-for-ae\" \n                                    data-employer-id=\"${employer.Id}\" \n                                    data-id=\"${pension.Id}\">\n                                    Default for AE\n                                </button>\n    \n                                <button type=\"button\" \n                                    class=\"btn btn-link btn-danger btn-sm btn-delete-pension\" \n                                    data-employer-id=\"${employer.Id}\" \n                                    data-id=\"${this.Id}\">\n                                    Delete\n                                </button>                             \n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n    \n            <div class=\"tab-pane fade\" id=\"rti-submissions\" role=\"tabpanel\" aria-labelledby=\"rti-submissions-tab\">\n                <div class=\"row actions\" if.bind=\"employer.PayRuns\">\n                    <div class=\"col-sm-12\">\n                        <a class=\"btn btn-primary launch-modal\" \n                            href=\"#employer/${employer.Id}/rtiTransaction\" \n                            role=\"button\">Make FPS Submission</a>\n                    </div>\n                </div>\n\n                <div class=\"card bg-light\" if.bind=\"!employer.PayRuns\">\n                    <div class=\"card-header\">RTI submissions</div>\n                    <div class=\"card-body\">\n                        <p class=\"card-text\">\n                            Start a new <strong>Pay Run</strong> before creating an RTI submission.\n                        </p>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.RTITransactions.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Id</th>\n                            <th scope=\"col\">Tax Year</th>\n                            <th scope=\"col\">Transmission Date</th>\n                            <th scope=\"col\">Transaction Status</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"transaction of employer.RTITransactions\">\n                            <th scope=\"row\">\n                                <a href=\"#employer/${employer.Id}/rtiTransaction/${transaction.Id}\" target=\"_blank\">\n                                    ${transaction.Id}\n                                </a>\n                            </th> \n                            <td>${transaction.TaxYear}</td>\n                            <td>${transaction.TransmissionDate | longDateTime}</td>\n                            <td>${transaction.TransactionStatus}</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>    \n    \n            <div class=\"tab-pane fade\" id=\"reports\" role=\"tabpanel\" aria-labelledby=\"reports-tab\">\n                <div class=\"coming-soon\">\n                    <h4>Coming soon!</h4>\n                    <p>Check soon to see this functionality wired up with the API</p>\n                </div>\n            </div>\n    \n        </div>\n    </div>\n\n    <div if.bind=\"!employer\">\n        <employer-form></employer-form>\n    </div>\n    \n    <input id=\"employer-id\" type=\"hidden\" value=\"${employer.Id}\">  \n</template>"; });
define('employer/employer-form',["exports", "aurelia-framework", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EmployerForm = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var EmployerForm = exports.EmployerForm = (_dec = (0, _aureliaFramework.customElement)("employer-form"), _dec2 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = _dec2(_class = function () {
        function EmployerForm(EventAggregator) {
            _classCallCheck(this, EmployerForm);

            this.ea = EventAggregator;
        }

        EmployerForm.prototype.attached = function attached() {};

        EmployerForm.prototype.detached = function detached() {};

        return EmployerForm;
    }()) || _class) || _class);
});
define('text!employer/employer-form.html', ['module'], function(module) { module.exports = "<template>\n    \n</template>"; });
define('app',["exports", "aurelia-pal"], function (exports, _aureliaPal) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.App = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var App = exports.App = function () {
		function App() {
			_classCallCheck(this, App);
		}

		App.prototype.configureRouter = function configureRouter(config, router) {
			config.title = "PayRun.io Demo";

			config.map([{
				route: "",
				moduleId: _aureliaPal.PLATFORM.moduleName("welcome/welcome"),
				title: "Get started"
			}, {
				route: "employers",
				moduleId: _aureliaPal.PLATFORM.moduleName("employer/list"),
				title: "Employers"
			}, {
				route: "setup",
				moduleId: _aureliaPal.PLATFORM.moduleName("welcome/setup"),
				title: "Setup"
			}, {
				route: "employer/:id?",
				moduleId: _aureliaPal.PLATFORM.moduleName("employer/employer"),
				title: "Employer"
			}]);

			this.router = router;
		};

		return App;
	}();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./header/header\"></require>\t\n\t<require from=\"./footer/footer\"></require>\n\t<require from=\"./api-calls/api-calls\"></require>\n\t<require from=\"./resources/elements/router-progress-indicator/router-progress-indicator\"></require>\n\n\t<router-progress-indicator></router-progress-indicator>\n\n\t<header></header>\n\n\t<div class=\"container content-container\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t<router-view></router-view>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<footer></footer>\n\n\t<api-calls></api-calls>\n</template>"; });
define('api-calls/api-calls',["exports", "aurelia-framework", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.APICalls = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var APICalls = exports.APICalls = (_dec = (0, _aureliaFramework.customElement)("api-calls"), _dec2 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = _dec2(_class = function () {
        function APICalls(EventAggregator) {
            _classCallCheck(this, APICalls);

            this.ea = EventAggregator;
            this.visible = false;
        }

        APICalls.prototype.attached = function attached() {
            var _this = this;

            this.toggleAPICallsSubscriber = this.ea.subscribe("toggleAPICalls", function () {
                _this.visible = !_this.visible;
            });
        };

        APICalls.prototype.detached = function detached() {
            this.toggleAPICallsSubscriber.dispose();
        };

        APICalls.prototype.close = function close() {
            this.visible = false;
        };

        return APICalls;
    }()) || _class) || _class);
});
define('text!api-calls/api-calls.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"api-calls\" if.bind=\"visible\">\n        <div class=\"rui-resizable-content\">\n            <div class=\"container-fluid\">\n                <div class=\"row resize-handle\">\n                    <div class=\"col-sm-12\"></div>\n                </div>                    \n                <div class=\"row title\">\n                    <div class=\"col-sm-11\">\n                        API calls\n                    </div>\n\n                    <div class=\"col-sm-1 text-right close-api-calls\" click.delegate=\"close()\">\n                        <i class=\"fas fa-times\"></i>\n                    </div>\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-sm-12\">\n                        {{>apiCalls}}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>    \n</template>"; });
//# sourceMappingURL=app-bundle.js.map