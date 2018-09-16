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
define('resources/value-converters/extract-href',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var ExtractHrefValueConverter = exports.ExtractHrefValueConverter = function () {
		function ExtractHrefValueConverter() {
			_classCallCheck(this, ExtractHrefValueConverter);
		}

		ExtractHrefValueConverter.prototype.toView = function toView(obj) {
			return obj["@href"];
		};

		return ExtractHrefValueConverter;
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
		config.globalResources(["./value-converters/address", "./value-converters/bank-account", "./value-converters/employee-name", "./value-converters/extract-href", "./value-converters/long-date-time", "./value-converters/short-date"]);
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
define('resources/elements/status/status',["exports", "aurelia-framework", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaEventAggregator) {
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

    var _dec, _dec2, _class, _desc, _value, _class2, _descriptor;

    var Status = exports.Status = (_dec = (0, _aureliaFramework.customElement)("status"), _dec2 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = _dec2(_class = (_class2 = function () {
        function Status(eventAggregator) {
            _classCallCheck(this, Status);

            _initDefineProp(this, "status", _descriptor, this);

            this.ea = eventAggregator;
        }

        Status.prototype.viewJob = function viewJob() {
            this.ea.publish("app:view-job", this.status.job);
        };

        return Status;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "status", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return null;
        }
    })), _class2)) || _class) || _class);
});
define('text!resources/elements/status/status.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"status alert alert-${status.type} alert-dismissible fade show\" role=\"alert\" if.bind=\"status\">\n        <span>${status.message}</span>\n\n        <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\" if.bind=\"status.job\" click.delegate=\"viewJob()\">View job</button>\n    \n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">&times;</span>\n        </button>\n    </div>    \n</template>"; });
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
define('resources/elements/api-errors/api-errors',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ApiErrors = undefined;

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

    var ApiErrors = exports.ApiErrors = (_dec = (0, _aureliaFramework.customElement)("api-errors"), _dec(_class = (_class2 = function ApiErrors() {
        _classCallCheck(this, ApiErrors);

        _initDefineProp(this, "errors", _descriptor, this);
    }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "errors", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return null;
        }
    })), _class2)) || _class);
});
define('text!resources/elements/api-errors/api-errors.html', ['module'], function(module) { module.exports = "<template>\n    <div id=\"validation-errors\" class=\"alert alert-warning\" role=\"alert\" if.bind=\"errors.length > 0\">\n        <p>\n            <strong>\n                The PayRun api has returned the following errors:\n            </strong>\n        </p>\n    \n        <ul>\n            <li repeat.for=\"error of errors\">\n                ${error}\n            </li>\n        </ul>\n    </div>\n</template>"; });
define('pension/pension-modal',["exports", "aurelia-framework", "aurelia-dialog", "aurelia-validation", "aurelia-http-client"], function (exports, _aureliaFramework, _aureliaDialog, _aureliaValidation, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PensionModal = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var PensionModal = exports.PensionModal = (_dec = (0, _aureliaFramework.inject)(_aureliaValidation.ValidationControllerFactory, _aureliaDialog.DialogController), _dec(_class = function () {
        function PensionModal(controllerFactory, dialogController) {
            _classCallCheck(this, PensionModal);

            this.dialogController = dialogController;
            this.validationController = controllerFactory.createForCurrentScope();
            this.client = new _aureliaHttpClient.HttpClient();
        }

        PensionModal.prototype.activate = function activate(state) {
            this.state = state;

            this.proRataMethods = [{ value: "NotSet", text: "Not set" }, { value: "Annual260Days", text: "Annual 260 days" }, { value: "Annual365Days", text: "Annual 365 days" }, { value: "AnnualQualifyingDays", text: "Annual qualifying days" }, { value: "DaysPerCalenderMonth", text: "Days per calender month" }, { value: "DaysPerTaxPeriod", text: "Days per tax period" }];

            this.taxationMethods = [{ value: "NotSet", text: "Not set" }, { value: "NetBased", text: "Net based" }, { value: "ReliefAtSource", text: "Relief at source" }];

            this.setupValidationRules();
        };

        PensionModal.prototype.setupValidationRules = function setupValidationRules() {
            _aureliaValidation.ValidationRules.ensure("SchemeName").required().withMessage("Scheme name is required").ensure("ProviderName").required().withMessage("Provider name is required").ensure("ProviderEmployerRef").required().withMessage("Provider employer ref is required").ensure("EffectiveDate").required().withMessage("Effective date is required").on(this.state);
        };

        PensionModal.prototype.save = function save() {
            var _this = this;

            this.validationController.validate().then(function (result) {
                if (result.valid) {
                    _this.client.post("/api/employer/" + _this.state.employerId + "/pension", _this.state).then(function (res) {
                        var parsedResponse = JSON.parse(res.response);

                        if (parsedResponse.errors) {
                            _this.apiErrors = parsedResponse.errors;
                            return;
                        }

                        _this.dialogController.ok(parsedResponse.status);
                    });
                }
            });
        };

        return PensionModal;
    }()) || _class);
});
define('text!pension/pension-modal.html', ['module'], function(module) { module.exports = "<template>\n        <require from=\"../resources/elements/validation-errors/validation-errors\"></require>\n        <require from=\"../resources/elements/api-errors/api-errors\"></require>\n    \n        <ux-dialog>\n            <ux-dialog-header>\n                <h5>Pension</h5>\n            </ux-dialog-header>\n            <ux-dialog-body>\n                <div class=\"container-fluid\">\n                    <form>\n                        <validation-errors errors.bind=\"validationController.errors\"></validation-errors>\n        \n                        <api-errors errors.bind=\"apiErrors\"></api-errors>\n        \n                        <ul class=\"nav nav-pills nav-fill\" id=\"subTab\" role=\"tablist\">\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link active\" id=\"details-tab\" data-toggle=\"tab\" href=\"#details\" role=\"tab\" aria-controls=\"details\" aria-selected=\"true\">Details</a>\n                            </li>\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link\" id=\"advanced-tab\" data-toggle=\"tab\" href=\"#advanced\" role=\"tab\" aria-controls=\"advanced\" aria-selected=\"false\">Advanced</a>\n                            </li>\n                        </ul>\n\n                        <div class=\"tab-content\" id=\"mySubTabContent\">\n                            <div class=\"tab-pane fade show active\" id=\"details\" role=\"tabpanel\" aria-labelledby=\"details-tab\">\n                                <div class=\"row\">\n                                    <div class=\"col-sm-12 col-md-6\">\n                                        <div class=\"form-group\">\n                                            <label for=\"Code\">Code</label>\n                                            <input type=\"text\" \n                                                class=\"form-control\" \n                                                id=\"Code\" \n                                                name=\"Code\" \n                                                value.bind=\"state.Code\" \n                                                placeholder=\"Code\"\n                                                maxlength=\"35\">\n                \n                                            <span class=\"notes\">Allows an override of the default pay code used by the pension scheme.</span>\n                                        </div>\n                \n                                        <div class=\"form-group\">\n                                            <label for=\"SchemeName\">Scheme Name</label>\n                                            <input type=\"text\" \n                                                class=\"form-control\" \n                                                id=\"SchemeName\" \n                                                name=\"SchemeName\" \n                                                value.bind=\"state.SchemeName & validate\" \n                                                placeholder=\"Scheme name\"\n                                                maxlength=\"250\">\n                                        </div>\n                \n                                        <div class=\"form-group\">\n                                            <label for=\"ProviderName\">Provider name</label>\n                                            <input type=\"text\" \n                                                class=\"form-control\" \n                                                id=\"ProviderName\" \n                                                name=\"ProviderName\" \n                                                value.bind=\"state.ProviderName & validate\" \n                                                placeholder=\"Provider name\"\n                                                maxlength=\"250\">\n                                        </div>\n                \n                                        <div class=\"form-group\">\n                                            <label for=\"ProviderEmployerRef\">Provider employer ref</label>\n                                            <input type=\"text\" \n                                                class=\"form-control\" \n                                                id=\"ProviderEmployerRef\" \n                                                name=\"ProviderEmployerRef\" \n                                                value.bind=\"state.ProviderEmployerRef & validate\" \n                                                placeholder=\"Reference issued by the pension provider\"\n                                                maxlength=\"100\">\n                                        </div>  \n                \n                                        <div class=\"form-group\">\n                                            <label for=\"Group\">Group</label>\n                                            <input type=\"text\" \n                                                class=\"form-control\" \n                                                id=\"Group\" \n                                                name=\"Group\" \n                                                value.bind=\"state.Group\" \n                                                placeholder=\"Group name within the pension scheme\"\n                                                maxlength=\"100\">\n                                        </div>\n                \n                                        <div class=\"form-group\">\n                                            <label for=\"SubGroup\">Sub group</label>\n                                            <input type=\"text\" \n                                                class=\"form-control\" \n                                                id=\"SubGroup\" \n                                                name=\"SubGroup\" \n                                                value.bind=\"state.SubGroup\" \n                                                placeholder=\"Sub-group name within the pension scheme\"\n                                                maxlength=\"100\">\n                                        </div>   \n                \n                                        <div class=\"form-group\">\n                                            <label for=\"EmployeeContributionCash\">Employee contribution cash</label>\n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"EmployeeContributionCash\" \n                                                name=\"EmployeeContributionCash\" \n                                                value.bind=\"state.EmployeeContributionCash\" \n                                                placeholder=\"Employee's gross cash contribution\"\n                                                step=\"0.01\">\n                                        </div>  \n                \n                                        <div class=\"form-group\">\n                                            <label for=\"EmployeeContributionCash\">Employer contribution cash</label>\n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"EmployerContributionCash\" \n                                                name=\"EmployerContributionCash\" \n                                                value.bind=\"state.EmployerContributionCash\" \n                                                placeholder=\"Employer's gross cash contribution\"\n                                                step=\"0.01\">\n                                        </div>  \n                \n                                        <div class=\"form-group\">\n                                            <label for=\"EmployeeContributionPercent\">Employee contribution %</label>\n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"EmployeeContributionPercent\" \n                                                name=\"EmployeeContributionPercent\" \n                                                value.bind=\"state.EmployeeContributionPercent\" \n                                                placeholder=\"Employee's percentage contribution from their pensionable pay\"\n                                                step=\"0.01\" \n                                                min=\"0\" \n                                                max=\"1\">\n                \n                                            <span class=\"notes\">A decimal fraction between 0 and 1. Represents a percentage as a fraction of the number 1.</span>\n                                        </div> \n                \n                                        <div class=\"form-group\">\n                                            <label for=\"EmployerContributionPercent\">Employer contribution %</label>\n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"EmployerContributionPercent\" \n                                                name=\"EmployerContributionPercent\" \n                                                value.bind=\"state.EmployerContributionPercent\" \n                                                placeholder=\"Employer's percentage contribution from their pensionable pay\"\n                                                step=\"0.01\" \n                                                min=\"0\" \n                                                max=\"1\">\n                \n                                            <span class=\"notes\">A decimal fraction between 0 and 1. Represents a percentage as a fraction of the number 1.</span>\n                                        </div>                                                                                                                                                                                       \n                                    </div>\n                \n                                    <div class=\"col-sm-12 col-md-6\">\n                                        <div class=\"form-group\">\n                                            <label for=\"LowerThreshold\">Lower threshold</label>\n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"LowerThreshold\" \n                                                name=\"LowerThreshold\" \n                                                value.bind=\"state.LowerThreshold\" \n                                                placeholder=\"Lower threshold\"\n                                                step=\"0.01\">\n                \n                                            <span class=\"notes\">\n                                                The lower earning threshold; only pensionable pay above this value will be included for calculating contributions. \n                                                Thresholds are predominantly used for triggering Auto Enrolment contributions; see <a href=\"http://developer.payrun.io/docs/payroll-help/auto-enrolment.html\" target=\"_blank\">Auto Enrolment</a> for more information.\n                                            </span>\n                                        </div> \n                \n                                        <div class=\"form-group\">\n                                            <label for=\"UpperThreshold\">Upper threshold</label>\n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"UpperThreshold\" \n                                                name=\"UpperThreshold\" \n                                                value.bind=\"state.UpperThreshold\" \n                                                placeholder=\"Upper threshold\"\n                                                step=\"0.01\">\n                \n                                            <span class=\"notes\">\n                                                The upper earning threshold; only pensionable pay above this value will be included for calculating contributions. \n                                                Thresholds are predominantly used for triggering Auto Enrolment contributions; see <a href=\"http://developer.payrun.io/docs/payroll-help/auto-enrolment.html\" target=\"_blank\">Auto Enrolment</a> for more information.\n                                            </span>\n                                        </div> \n                \n                                        <div class=\"form-group\">\n                                            <label for=\"TaxationMethod\">Taxation method</label>\n                \n                                            <select class=\"form-control\" \n                                                id=\"TaxationMethod\" \n                                                name=\"TaxationMethod\"\n                                                value.bind=\"state.TaxationMethod & validate\">\n                                                <option repeat.for=\"method of taxationMethods\" value.bind=\"method.value\">\n                                                    ${method.text}\n                                                </option>\n                                            </select>\n                \n                                            <span class=\"notes\">\n                                                The taxation method to use when calculating pension contributions; this should be mandated by your pension provider.\n                                            </span>\n                                        </div>  \n                    \n                                        <div class=\"form-group\">\n                                            <label for=\"ContributionDeductionDay\">Contribution deduction day</label>\n                \n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"ContributionDeductionDay\" \n                                                name=\"ContributionDeductionDay\" \n                                                value.bind=\"state.ContributionDeductionDay\" \n                                                placeholder=\"The normal day of the month when contributions will be deducted\" \n                                                min=\"1\" \n                                                max=\"31\">\n                                        </div>\n                \n                                        <div class=\"form-check\">\n                                            <input class=\"form-check-input\" type=\"checkbox\" id=\"SalarySacrifice\" name=\"SalarySacrifice\" checked.bind=\"state.SalarySacrifice\">\n                \n                                            <label class=\"form-check-label\" for=\"SalarySacrifice\">\n                                                Salary sacrifice?\n                                            </label>\n                \n                                            <span class=\"notes\">\n                                                The salary sacrifice option. Used to indicate if the pension scheme employee contributions should make use of salary sacrifice.\n                                            </span>\n                                        </div>\n                                        \n                                        <div class=\"form-group\">\n                                            <label for=\"ProRataMethod\">Pro-Rata method</label>\n                \n                                            <select class=\"form-control\" \n                                                id=\"ProRataMethod\" \n                                                name=\"ProRataMethod\" \n                                                value.bind=\"state.ProRataMethod & validate\">\n                                                <option repeat.for=\"method of proRataMethods\" value.bind=\"method.value\">\n                                                    ${method.text}\n                                                </option>\n                                            </select>\n                \n                                            <span class=\"notes\">\n                                                The pro-rata method option to be used; the default is not set. \n                                                See <a href=\"http://developer.payrun.io/docs/payroll-help/prorata-calculation-methods.html\" target=\"_blank\">Pro-rata Calculation Methods</a> for more information.\n                                            </span>\n                                        </div> \n                \n                                        <div class=\"form-check\">\n                                            <input class=\"form-check-input\" \n                                                type=\"checkbox\" \n                                                id=\"AECompatible\" \n                                                name=\"AECompatible\" \n                                                checked.bind=\"state.AECompatible\">\n                \n                                            <label class=\"form-check-label\" for=\"AECompatible\">\n                                                AE compatible?\n                                            </label>\n                \n                                            <span class=\"notes\">\n                                                The Auto Enrolment compatibility indicator. Used to indicate if this pension scheme is compatible with auto enrolment requirements.\n                                            </span>\n                                        </div>\n                \n                                        <div class=\"form-check\">\n                                            <input class=\"form-check-input\" \n                                                type=\"checkbox\" \n                                                id=\"UseAEThresholds\" \n                                                name=\"UseAEThresholds\" \n                                                checked.bind=\"state.UseAEThresholds\">\n                \n                                            <label class=\"form-check-label\" for=\"UseAEThresholds\">\n                                                Use AE thresholds?\n                                            </label>\n                \n                                            <span class=\"notes\">\n                                                The Use Auto Enrolment Thresholds indicator. Used to indicate if this pension scheme uses the auto enrolment thresholds.\n                                            </span>\n                                        </div>                                                                      \n                                    </div>\n                                </div>\n                \n                            </div>\n                \n                            <div class=\"tab-pane fade\" id=\"advanced\" role=\"tabpanel\" aria-labelledby=\"advanced-tab\">\n                                <div class=\"row\">\n                                    <div class=\"col-sm-12 col-md-6\">\n                                        <div class=\"form-group\">\n                                            <label for=\"Revision\">Revision</label>\n                                            <input type=\"number\" \n                                                class=\"form-control\" \n                                                id=\"Revision\" \n                                                name=\"Revision\" \n                                                value.bind=\"state.Revision\" \n                                                placeholder=\"Revision number\"\n                                                readonly \n                                                step=\"1\" \n                                                min=\"0\">\n                                        </div>\n                                    </div>\n                \n                                    <div class=\"col-sm-12 col-md-6\">\n                                        <div class=\"form-group\">\n                                            <label for=\"EffectiveDate\">Effective date</label>\n                                            <input type=\"date\" \n                                                class=\"form-control\" \n                                                id=\"EffectiveDate\" \n                                                name=\"EffectiveDate\" \n                                                value.bind=\"state.EffectiveDate & validate\"\n                                                placeholder=\"Date the revision will come into effect\">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </form>\n                </div>\n            </ux-dialog-body>\n    \n            <ux-dialog-footer>\n                <div class=\"container-fluid\">\n                    <div class=\"row\">\n                        <div class=\"col-sm-6 text-left\">\n                            <button class=\"btn btn-secondary\" click.trigger=\"dialogController.cancel()\">Cancel</button>\n                        </div>\n                        <div class=\"col-sm-6 text-right\">\n                            <button class=\"btn btn-primary\" click.trigger=\"save()\">Save</button>\n                        </div>\n                    </div>\n                </div>\n            </ux-dialog-footer>\n        </ux-dialog>\n    </template>"; });
define('pay-schedule/pay-schedule-modal',["exports", "aurelia-framework", "aurelia-dialog", "aurelia-validation", "aurelia-http-client"], function (exports, _aureliaFramework, _aureliaDialog, _aureliaValidation, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PayScheduleModal = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var PayScheduleModal = exports.PayScheduleModal = (_dec = (0, _aureliaFramework.inject)(_aureliaValidation.ValidationControllerFactory, _aureliaDialog.DialogController), _dec(_class = function () {
        function PayScheduleModal(controllerFactory, dialogController) {
            _classCallCheck(this, PayScheduleModal);

            this.dialogController = dialogController;
            this.validationController = controllerFactory.createForCurrentScope();
            this.client = new _aureliaHttpClient.HttpClient();
        }

        PayScheduleModal.prototype.activate = function activate(state) {
            this.state = state;
            this.frequencies = [{ text: "Weekly", value: "Weekly" }, { text: "Monthly", value: "Monthly" }, { text: "Two weekly", value: "TwoWeekly" }, { text: "Four weekly", value: "FourWeekly" }];

            this.setupValidationRules();
        };

        PayScheduleModal.prototype.setupValidationRules = function setupValidationRules() {
            _aureliaValidation.ValidationRules.ensure("Name").required().withMessage("Name is required").ensure("PayFrequency").required().withMessage("Pay Frequency is required").on(this.state);
        };

        PayScheduleModal.prototype.save = function save() {
            var _this = this;

            var data = {
                Id: this.state.Key,
                Name: this.state.Name,
                PayFrequency: this.state.PayFrequency
            };

            this.validationController.validate().then(function (result) {
                if (result.valid) {
                    _this.client.post("/api/employer/" + _this.state.employerId + "/paySchedule", data).then(function (res) {
                        var parsedResponse = JSON.parse(res.response);

                        if (parsedResponse.errors) {
                            _this.apiErrors = parsedResponse.errors;
                            return;
                        }

                        _this.dialogController.ok(parsedResponse.status);
                    });
                }
            });
        };

        return PayScheduleModal;
    }()) || _class);
});
define('text!pay-schedule/pay-schedule-modal.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../resources/elements/validation-errors/validation-errors\"></require>\n    <require from=\"../resources/elements/api-errors/api-errors\"></require>\n\n    <ux-dialog>\n        <ux-dialog-header>\n            <h5>Pay schedule</h5>\n        </ux-dialog-header>\n        <ux-dialog-body>\n            <div class=\"container-fluid\">\n                <validation-errors errors.bind=\"validationController.errors\"></validation-errors>\n\n                <api-errors errors.bind=\"apiErrors\"></api-errors>\n\n                <div class=\"row\">\n                    <div class=\"col-sm-12\">\n                        <div class=\"form-group\">\n                            <label for=\"Name\">Name</label>\n                            <input type=\"text\" \n                                class=\"form-control form-control-lg\" \n                                id=\"Name\" \n                                name=\"Name\" \n                                value.bind=\"state.Name & validate\" \n                                placeholder=\"Name of the pay schedule that unique identifies it\" \n                                maxlength=\"35\">\n                        </div>\n                    \n                        <div class=\"form-group\">\n                            <label for=\"PayFrequency\">Pay Frequency</label>\n                    \n                            <select id=\"PayFrequency\" \n                                name=\"PayFrequency\" \n                                class=\"form-control form-control-lg\" \n                                value.bind=\"state.PayFrequency & validate\">\n                                <option model.bind=\"null\">Please Choose...</option>\n                                <option repeat.for=\"freq of frequencies\" value.bind=\"freq.value\">\n                                    ${freq.text}\n                                </option>\n                            </select>\n                        </div>                        \n                    </div>\n                </div>\n            </div>\n        </ux-dialog-body>\n\n        <ux-dialog-footer>\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"col-sm-6 text-left\">\n                        <button class=\"btn btn-secondary\" click.trigger=\"dialogController.cancel()\">Cancel</button>\n                    </div>\n                    <div class=\"col-sm-6 text-right\">\n                        <button class=\"btn btn-primary\" click.trigger=\"save()\">Save</button>\n                    </div>\n                </div>\n            </div>\n        </ux-dialog-footer>\n    </ux-dialog>\n</template>    "; });
define('pay-run/new-pay-run-modal',["exports", "aurelia-framework", "aurelia-dialog", "aurelia-validation", "aurelia-http-client"], function (exports, _aureliaFramework, _aureliaDialog, _aureliaValidation, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.NewPayRunModal = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var NewPayRunModal = exports.NewPayRunModal = (_dec = (0, _aureliaFramework.inject)(_aureliaValidation.ValidationControllerFactory, _aureliaDialog.DialogController), _dec(_class = function () {
        function NewPayRunModal(controllerFactory, dialogController) {
            _classCallCheck(this, NewPayRunModal);

            this.dialogController = dialogController;
            this.validationController = controllerFactory.createForCurrentScope();
            this.client = new _aureliaHttpClient.HttpClient();
        }

        NewPayRunModal.prototype.activate = function activate(state) {
            this.state = state;

            this.setupValidationRules();
        };

        NewPayRunModal.prototype.setupValidationRules = function setupValidationRules() {
            _aureliaValidation.ValidationRules.ensure("PayScheduleId").required().withMessage("Pay Schedule is required").ensure("PaymentDate").required().withMessage("Payment Date is required").ensure("StartDate").required().withMessage("Pay Period Start is required").ensure("EndDate").required().withMessage("Pay Period End is required").on(this.state);
        };

        NewPayRunModal.prototype.save = function save() {
            var _this = this;

            var data = {
                PayScheduleId: this.state.PayScheduleId,
                PaymentDate: this.state.PaymentDate,
                StartDate: this.state.StartDate,
                EndDate: this.state.EndDate
            };

            this.validationController.validate().then(function (result) {
                if (result.valid) {
                    _this.client.post("/api/employer/" + _this.state.EmployerId + "/payRun", data).then(function (res) {
                        var parsedResponse = JSON.parse(res.response);

                        if (parsedResponse.errors) {
                            _this.apiErrors = parsedResponse.errors;
                            return;
                        }

                        _this.dialogController.ok(parsedResponse.status);
                    });
                }
            });
        };

        return NewPayRunModal;
    }()) || _class);
});
define('text!pay-run/new-pay-run-modal.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../resources/elements/validation-errors/validation-errors\"></require>\n    <require from=\"../resources/elements/api-errors/api-errors\"></require>\n\n    <ux-dialog>\n        <ux-dialog-header>\n            <h5>${state.Title}</h5>\n        </ux-dialog-header>\n        <ux-dialog-body>\n            <div class=\"container-fluid\">\n                <form>\n                    <validation-errors errors.bind=\"validationController.errors\"></validation-errors>\n    \n                    <api-errors errors.bind=\"apiErrors\"></api-errors>\n\n                    <div class=\"row\" if.bind=\"state.Instruction\">\n                        <div class=\"col-sm-12\">\n                            <p>${state.Instruction}</p>\n                        </div>\n                    </div> \n\n                    <div class=\"row\">\n                        <div class=\"col-sm-12 col-md-12\">        \n                            <div class=\"form-group\" if.bind=\"!state.PayScheduleId\">\n                                <label for=\"PayScheduleId\">Pay Schedule</label>\n                                <select class=\"form-control\" id=\"PayScheduleId\" name=\"PayScheduleId\">\n                                    <option repeat.for=\"paySchedule of state.PaySchedules\" value.bind=\"paySchedule.Id\">\n                                        ${paySchedule.Name}\n                                    </option>\n                                </select>\n                            </div>\n                \n                            <div class=\"form-group\">\n                                <label for=\"PaymentDate\">Payment Date</label>\n                                <input type=\"date\" \n                                    class=\"form-control form-control-lg\" \n                                    id=\"PaymentDate\" \n                                    name=\"PaymentDate\" \n                                    value.bind=\"state.PaymentDate & validate\" \n                                    placeholder=\"The date the employees were paid in the pay run\">\n                \n                                <span class=\"notes\">The date you wish to appear on the employee's payslip (aka pay day).</span>\n                            </div>\n                \n                            <div class=\"row\">\n                                <div class=\"col-sm-12 col-md-6\">    \n                                    <div class=\"form-group\">\n                                        <label for=\"StartDate\">Pay Period Start</label>\n                                        <input type=\"date\" \n                                            class=\"form-control\" \n                                            id=\"StartDate\" \n                                            name=\"StartDate\" \n                                            value.bind=\"state.StartDate & validate\" \n                                            placeholder=\"The pay period start date\">\n                                    </div>\n                                </div>\n                                <div class=\"col-sm-12 col-md-6\"> \n                                    <div class=\"form-group\">\n                                        <label for=\"EndDate\">Pay Period End</label>\n                                        <input type=\"date\" \n                                            class=\"form-control\" \n                                            id=\"EndDate\" \n                                            name=\"EndDate\" \n                                            value.bind=\"state.EndDate & validate\" \n                                            placeholder=\"The pay period end date\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>                    \n                </form>\n            </div>\n        </ux-dialog-body>\n\n        <ux-dialog-footer>\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"col-sm-6 text-left\">\n                        <button class=\"btn btn-secondary\" click.trigger=\"dialogController.cancel()\">Cancel</button>\n                    </div>\n                    <div class=\"col-sm-6 text-right\">\n                        <button class=\"btn btn-primary\" click.trigger=\"save()\">Start</button>\n                    </div>\n                </div>\n            </div>\n        </ux-dialog-footer>\n    </ux-dialog>\n</template>"; });
define('pay-run/info-modal',["exports", "aurelia-framework", "aurelia-dialog"], function (exports, _aureliaFramework, _aureliaDialog) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.InfoModal = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var InfoModal = exports.InfoModal = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
        function InfoModal(dialogController) {
            _classCallCheck(this, InfoModal);

            this.dialogController = dialogController;
        }

        InfoModal.prototype.activate = function activate(state) {
            this.state = state;
        };

        return InfoModal;
    }()) || _class);
});
define('text!pay-run/info-modal.html', ['module'], function(module) { module.exports = "<template>\n    <ux-dialog>\n        <ux-dialog-header>\n            <h5>Pay run</h5>\n        </ux-dialog-header>\n        <ux-dialog-body>\n            <div class=\"container-fluid\">\n                <div class=\"pay-run-info\">\n                    <div class=\"row\">\n                        <div class=\"col-sm-12 col-md-4\">\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Pay Schedule</strong>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    ${state.PaySchedule}\n                                </div>\n                            </div>\n\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Pay Frequency</strong>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    ${state.PayFrequency}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"col-sm-12 col-md-4\">\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Payment Date</strong>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    ${state.PaymentDate}\n                                </div>\n                            </div>\n\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Tax Year / Period</strong>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    ${state.TaxYear}/${state.TaxPeriod}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"col-sm-12 col-md-4\">\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Period start</strong>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    ${state.PeriodStart}\n                                </div>\n                            </div>\n\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Period end</strong>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    ${state.PeriodEnd}\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"row\">\n                        <div class=\"col-sm-12\" if.bind=\"state.Employees.length > 0\">\n                            <p><strong>Employees</strong></p>\n\n                            <table class=\"table\">\n                                <thead>\n                                    <tr>\n                                        <th scope=\"col\">Name</th>\n                                        <th scope=\"col\">Payments</th>\n                                        <th scope=\"col\">Tax</th>\n                                        <th scope=\"col\">EE NI</th>\n                                        <th scope=\"col\">ER NI</th>\n                                        <th scope=\"col\">Other Deducs</th>\n                                        <th scope=\"col\">Net Pay</th>\n                                        <th width=\"210px\"></th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                    <tr repeat.for=\"employee of state.Employees\">\n                                        <td>\n                                            <a href=\"#Employer/${state.EmployerId}/Employee/${employee.Key}\">${employee.Name}</a>\n                                        </td>\n                                        <td>${employee.PAYMENTS}</td>\n                                        <td>${employee.TAX}</td>\n                                        <td>${employee.EE_NI}</td>\n                                        <td>${employee.ER_NI}</td>\n                                        <td>${employee.OTHERDEDNS}</td>\n                                        <td>${employee.NETPAY}</td>\n                                        <td class=\"text-right\">\n                                            <a href=\"/api/Employer/${state.EmployerId}/Employee/${employee.Key}/PaySlipData/${employee.Code}/${state.TaxPeriod}/${state.TaxYear}\" target=\"_blank\">Payslip</a>\n                                            &nbsp;|&nbsp;\n                                            <a href=\"/api${employee.Commentary | extractHref}\" target=\"_blank\" if.bind=\"employee.Commentary\">Commentary</a>\n                                        </td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </ux-dialog-body>\n\n        <ux-dialog-footer>\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"col-sm-12\">\n                        <button class=\"btn btn-primary\" click.trigger=\"dialogController.ok()\">Close</button>\n                    </div>\n                </div>\n            </div>\n        </ux-dialog-footer>\n    </ux-dialog>\n</template>"; });
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
define('job/job-details-modal',["exports", "aurelia-framework", "aurelia-dialog", "aurelia-http-client"], function (exports, _aureliaFramework, _aureliaDialog, _aureliaHttpClient) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.JobDetailsModal = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var JobDetailsModal = exports.JobDetailsModal = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
        function JobDetailsModal(dialogController) {
            _classCallCheck(this, JobDetailsModal);

            this.dialogController = dialogController;
            this.client = new _aureliaHttpClient.HttpClient();
        }

        JobDetailsModal.prototype.activate = function activate(state) {
            this.state = state;
        };

        return JobDetailsModal;
    }()) || _class);
});
define('text!job/job-details-modal.html', ['module'], function(module) { module.exports = "<template>\n    <ux-dialog>\n        <ux-dialog-header>\n            <h5>${state.Title}</h5>\n        </ux-dialog-header>\n        <ux-dialog-body>\n            <div class=\"container-fluid\">\n                <div class=\"job-info\">\n                    <div class=\"row\" if.bind=\"state.Errors.length > 0\">\n                        <div class=\"col-sm-12\">\n                            <div class=\"alert alert-danger\" role=\"alert\">\n                                <p>\n                                    <strong>This job contains the following errors:</strong>\n                                </p>\n            \n                                <ul>\n                                    <li repeat.for=\"error of state.Errors\">${error}</li>\n                                </ul>\n                            </div>            \n                        </div>\n                    </div>\n                \n                    <div class=\"row\">\n                        <div class=\"col-sm-12\">\n                            <strong>Progress</strong>\n                        </div>\n                \n                        <div class=\"col-sm-12\">\n                            <div class=\"progress\">\n                                <div class=\"progress-bar progress-bar-striped progress-bar-animated\" \n                                    role=\"progressbar\"\n                                    style=\"width: ${state.Progress}%\"></div>\n                            </div>        \n                        </div>\n                    </div>\n                \n                    <div class=\"row\">\n                        <div class=\"col-sm-12 col-md-6\">\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Status</strong>\n                                </div>\n                \n                                <div class=\"col-sm-12\">\n                                    ${state.JobStatus}\n                                </div>            \n                            </div>\n                \n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Job Id</strong>\n                                </div>\n                \n                                <div class=\"col-sm-12\">\n                                    ${state.JobId}\n                                </div>            \n                            </div>        \n                        </div>\n                \n                        <div class=\"col-sm-12 col-md-6\">\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Last updated on</strong>\n                                </div>\n                \n                                <div class=\"col-sm-12\">\n                                    ${state.LastUpdated | longDateTime}\n                                </div>            \n                            </div>\n                \n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <strong>Created on</strong>\n                                </div>\n                \n                                <div class=\"col-sm-12\">\n                                    ${state.Created | longDateTime}\n                                </div>            \n                            </div>\n                        </div>    \n                    </div>\n                </div>\n            </div>\n        </ux-dialog-body>\n\n        <ux-dialog-footer>\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"col-sm-12\">\n                        <button class=\"btn btn-primary\" click.trigger=\"dialogController.ok()\">Close</button>\n                    </div>\n                </div>\n            </div>\n        </ux-dialog-footer>\n    </ux-dialog>        \n</template>"; });
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
define('employer/employer',["exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-http-client", "aurelia-dialog", "../pay-schedule/pay-schedule-modal", "../pension/pension-modal", "../pay-run/info-modal", "../pay-run/new-pay-run-modal", "../dialogs/confirm"], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaHttpClient, _aureliaDialog, _payScheduleModal, _pensionModal, _infoModal, _newPayRunModal, _confirm) {
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
            if (params && params.id) {
                return this.getEmployerDetails(params.id);
            }
        };

        Employer.prototype.getEmployerDetails = function getEmployerDetails(employerId) {
            var _this = this;

            return new Promise(function (resolve) {
                var client = new _aureliaHttpClient.HttpClient();

                client.get("/api/employer/" + employerId).then(function (data) {
                    _this.employer = JSON.parse(data.response);

                    resolve();
                });
            });
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

        Employer.prototype.deletePaySchedule = function deletePaySchedule(schedule) {
            var _this2 = this;

            var opts = {
                viewModel: _confirm.Confirm,
                model: {
                    title: "Are you sure?",
                    message: "Are you sure you want to delete this pay schedule?"
                }
            };

            this.dialogService.open(opts).whenClosed(function (response) {
                if (!response.wasCancelled) {
                    var client = new _aureliaHttpClient.HttpClient();

                    client.post("/api/employer/" + _this2.employer.Id + "/paySchedule/" + schedule.Key + "/delete/").then(function (res) {
                        var parsedResponse = JSON.parse(res.response);

                        if (parsedResponse.errors) {
                            _this2.apiErrors = parsedResponse.errors;
                            return;
                        }

                        _this2.apiErrors = null;
                        _this2.status = parsedResponse.status;
                        _this2.getEmployerDetails(_this2.employer.Id);
                    });
                }
            });
        };

        Employer.prototype.openPayScheduleModal = function openPayScheduleModal(schedule) {
            var _this3 = this;

            schedule.employerId = this.employer.Id;

            var opts = {
                viewModel: _payScheduleModal.PayScheduleModal,
                model: JSON.parse(JSON.stringify(schedule))
            };

            this.dialogService.open(opts).whenClosed(function (response) {
                if (!response.wasCancelled) {
                    _this3.status = response.output;

                    _this3.getEmployerDetails(_this3.employer.Id);
                }
            });
        };

        Employer.prototype.addAPension = function addAPension() {
            this.openPensionModal({});
        };

        Employer.prototype.editPension = function editPension(pension) {
            this.openPensionModal(pension);
        };

        Employer.prototype.defaultPensionForAE = function defaultPensionForAE(employerId, pensionId) {
            var _this4 = this;

            var client = new _aureliaHttpClient.HttpClient();

            client.patch("/api/employer/" + employerId + "/pension/" + pensionId).then(function (res) {
                var parsedResponse = JSON.parse(res.response);

                if (parsedResponse.errors) {
                    _this4.apiErrors = parsedResponse.errors;
                    return;
                }

                _this4.apiErrors = null;
                _this4.status = parsedResponse.status;
                _this4.getEmployerDetails(employerId);
            });
        };

        Employer.prototype.deletePension = function deletePension(employerId, pensionId) {
            var _this5 = this;

            var client = new _aureliaHttpClient.HttpClient();

            client.delete("/api/employer/" + employerId + "/pension/" + pensionId).then(function (res) {
                var parsedResponse = JSON.parse(res.response);

                if (parsedResponse.errors) {
                    _this5.apiErrors = parsedResponse.errors;
                    return;
                }

                _this5.apiErrors = null;
                _this5.status = parsedResponse.status;
                _this5.getEmployerDetails(employerId);
            });
        };

        Employer.prototype.openPensionModal = function openPensionModal(pension) {
            var _this6 = this;

            pension.employerId = this.employer.Id;

            var opts = {
                viewModel: _pensionModal.PensionModal,
                model: JSON.parse(JSON.stringify(pension))
            };

            this.dialogService.open(opts).whenClosed(function (response) {
                if (!response.wasCancelled) {
                    _this6.status = response.output;

                    _this6.getEmployerDetails(_this6.employer.Id);
                }
            });
        };

        Employer.prototype.openPayRunInfoModal = function openPayRunInfoModal(employerId, payScheduleId, payRunId) {
            var _this7 = this;

            var url = "api/employer/" + employerId + "/paySchedule/" + payScheduleId + "/payRun/" + payRunId;
            var client = new _aureliaHttpClient.HttpClient();

            client.get(url).then(function (res) {
                var payRun = JSON.parse(res.response);

                payRun.EmployerId = _this7.employer.Id;

                var opts = {
                    viewModel: _infoModal.InfoModal,
                    model: payRun
                };

                _this7.dialogService.open(opts);
            });
        };

        Employer.prototype.openRerunPayRunModal = function openRerunPayRunModal(employerId, payScheduleId, payRun) {
            var _this8 = this;

            var state = {
                Title: "Rerun PayRun",
                Instruction: "Re-running will delete the previous run.",
                EmployerId: employerId,
                PayScheduleId: payScheduleId,
                PaymentDate: payRun.PaymentDate,
                StartDate: payRun.PeriodStart,
                EndDate: payRun.PeriodEnd,
                PaySchedules: []
            };

            var opts = {
                viewModel: _newPayRunModal.NewPayRunModal,
                model: state
            };

            this.dialogService.open(opts).whenClosed(function (response) {
                if (!response.wasCancelled) {
                    _this8.status = response.output;

                    _this8.getEmployerDetails(_this8.employer.Id);
                }
            });
        };

        Employer.prototype.deletePayRun = function deletePayRun(employerId, payScheduleId, payRunId) {
            var _this9 = this;

            var opts = {
                viewModel: _confirm.Confirm,
                model: {
                    title: "Are you sure?",
                    message: "Are you sure you want to delete this pay run?"
                }
            };

            this.dialogService.open(opts).whenClosed(function (response) {
                if (!response.wasCancelled) {
                    var client = new _aureliaHttpClient.HttpClient();

                    client.delete("/api/employer/" + employerId + "/paySchedule/" + payScheduleId + "/payRun/" + payRunId).then(function (res) {
                        var parsedResponse = JSON.parse(res.response);

                        if (parsedResponse.errors) {
                            _this9.apiErrors = parsedResponse.errors;
                            return;
                        }

                        _this9.apiErrors = null;
                        _this9.status = parsedResponse.status;
                        _this9.getEmployerDetails(employerId);
                    });
                }
            });
        };

        return Employer;
    }()) || _class);
});
define('text!employer/employer.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./employer-form\"></require>\n    <require from=\"../resources/elements/status/status\"></require>\n    <require from=\"../resources/elements/api-errors/api-errors\"></require>\n\n    <status status.bind=\"status\"></status>\n    \n    <api-errors errors.bind=\"apiErrors\"></api-errors>\n\n    <div if.bind=\"employer\">\n        <ul class=\"nav nav-tabs nav-fill\" id=\"myTab\" role=\"tablist\">\n            <li class=\"nav-item\">\n                <a class=\"nav-link active\" id=\"home-tab\" data-toggle=\"tab\" href=\"#home\" role=\"tab\" aria-controls=\"home\" aria-selected=\"true\">Employer</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"schedules-tab\" data-toggle=\"tab\" href=\"#schedules\" role=\"tab\" aria-controls=\"schedules\" aria-selected=\"false\">Pay Schedules</a>\n            </li>        \n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"employees-tab\" data-toggle=\"tab\" href=\"#employees\" role=\"tab\" aria-controls=\"employees\" aria-selected=\"false\">Employees</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"pensions-tab\" data-toggle=\"tab\" href=\"#pensions\" role=\"tab\" aria-controls=\"pensions\" aria-selected=\"false\">Pensions</a>\n            </li>        \n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"runs-tab\" data-toggle=\"tab\" href=\"#runs\" role=\"tab\" aria-controls=\"runs\" aria-selected=\"false\">Pay Runs</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"rti-submissions-tab\" data-toggle=\"tab\" href=\"#rti-submissions\" role=\"tab\" aria-controls=\"rti-submissions\" aria-selected=\"false\">RTI Submissions</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" id=\"reports-tab\" data-toggle=\"tab\" href=\"#reports\" role=\"tab\" aria-controls=\"reports\" aria-selected=\"false\">Reports</a>\n            </li>       \n        </ul>\n    \n        <div class=\"tab-content\" id=\"myTabContent\">\n            <div class=\"tab-pane fade show active\" id=\"home\" role=\"tabpanel\" aria-labelledby=\"home-tab\">\n                <employer-form employer.bind=\"employer\"></employer-form>\n            </div>\n            \n            <div class=\"tab-pane fade\" id=\"employees\" role=\"tabpanel\" aria-labelledby=\"employees-tab\">\n                <div class=\"row actions\">\n                    <div class=\"col-sm-12\">\n                        <a class=\"btn btn-primary\" href=\"#employer/${employer.Id}/employee\" role=\"button\">Add a new employee</a>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.Employees.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Code</th>\n                            <th scope=\"col\">Name</th>\n                            <th scope=\"col\">Address</th>\n                            <th scope=\"col\">Bank Account</th>\n                            <th width=\"50px\"></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"employee of employer.Employees\">\n                            <th scope=\"row\">\n                                <a href=\"#employer/${employer.Id}/employee/${employee.Id}\">\n                                    ${employee.Code}\n                                </a>\n                            </th>\n                            <td>${employee | employeeName}</td>\n                            <td innerhtml.bind=\"employee.Address | address\"></td>\n                            <td innerhtml.bind=\"employee.BankAccount | bankAccount\"></td>\n                            <td>\n                                <!--<a class=\"btn btn-link\" \n                                    data-pay-schedule-id=\"{{this.Id}}\" \n                                    data-employer-id=\"{{../Id}}\">Add leaver details</a>\n                                <br>                            \n                                <a class=\"btn btn-link\" \n                                    data-pay-schedule-id=\"{{this.Id}}\" \n                                    data-employer-id=\"{{../Id}}\">Download P45</a>\n                                <br>\n                                <a class=\"btn btn-link\" href=\"/Employer/{{../Id}}/Employee/{{Id}}/p60\">Download P60</a>\n                                <br>\n                                <a class=\"btn btn-link btn-danger\">Delete</a>-->\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>                           \n            </div>\n            \n            <div class=\"tab-pane fade\" id=\"schedules\" role=\"tabpanel\" aria-labelledby=\"schedules-tab\">\n                <div class=\"row actions\">\n                    <div class=\"col-sm-12\">\n                        <a class=\"btn btn-primary\"\n                            href=\"#\" \n                            role=\"button\" \n                            click.delegate=\"addAPaySchedule()\">Add a Pay Schedule</a>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.PaySchedules.PaySchedulesTable.PaySchedule.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Id</th>\n                            <th scope=\"col\">Name</th>\n                            <th scope=\"col\">Frequency</th>\n                            <th scope=\"col\">Employees</th>\n                            <th scope=\"col\">Last Pay Day</th>\n                            <th scope=\"col\">Next Pay Day</th>\n                            <th width=\"50px\"></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"schedule of employer.PaySchedules.PaySchedulesTable.PaySchedule\">\n                            <th scope=\"row\">\n                                <a href=\"#\" click.delegate=\"editPaySchedule(schedule)\">\n                                    ${schedule.Key}\n                                </a>\n                            </th>\n                            <td>${schedule.Name}</td>\n                            <td>${schedule.PayFrequency}</td>\n                            <td>${schedule.EmployeeCount}</td>\n                            <td>\n                                <span if.bind=\"schedule.LastPayDay\">${schedule.LastPayDay}</span>\n\n                                <span if.bind=\"!schedule.LastPayDay\">\n                                    <em>Never</em>\n                                </span>\n                            </td>\n                            <td>\n                                <span if.bind=\"schedule.NextPayDay\">${schedule.NextPayDay}</span>\n\n                                <span if.bind=\"!schedule.NextPayDay\">-</span>\n                            </td>\n                            <td>\n                                <button type=\"button\" \n                                    class=\"btn btn-danger btn-sm btn-delete-pay-schedule\" \n                                    click.delegate=\"deletePaySchedule(schedule)\">\n                                    Delete\n                                </button>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n    \n            <div class=\"tab-pane fade\" id=\"runs\" role=\"tabpanel\" aria-labelledby=\"runs-tab\">\n                <div class=\"card bg-light\" if.bind=\"!canAddPayRun(employer)\">\n                    <div class=\"card-header\">Pay Runs</div>\n                    <div class=\"card-body\">\n                        <p class=\"card-text\">\n                            Add a <strong>Pay Schedule</strong> and an <strong>Employee</strong> before starting a pay run.\n                        </p>\n                    </div>\n                </div>\n    \n                <div class=\"job-info-container\"></div>\n    \n                <div class=\"card bg-light\" repeat.for=\"schedule of employer.PaySchedules.PaySchedulesTable.PaySchedule\">\n                    <div class=\"card-header\">\n                        <h6 class=\"float-left\">${schedule.Name}</h6>\n                    </div>\n                    <div class=\"card-body\">\n                        <table class=\"table\" if.bind=\"schedule.PayRuns.length > 0\">\n                            <thead>\n                                <tr>\n                                    <th scope=\"col\">Payment Date</th>\n                                    <th scope=\"col\">Tax Period</th>\n                                    <th scope=\"col\">Pay Period</th>\n                                    <th scope=\"col\">Supplementary</th>\n                                    <th scope=\"col\">\n                                        <a class=\"btn btn-sm btn-primary launch-modal float-right\" \n                                            data-modal-title=\"Create PayRun\"\n                                            data-pay-schedule-id=\"${schedule.Key}\" \n                                            href=\"#employer/${employer.Id}/payRun?paySchedule=${schedule.Key}\" \n                                            role=\"button\">Add PayRun</a>\n                                    </th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr repeat.for=\"payrun of schedule.PayRuns\">\n                                    <th scope=\"row\">\n                                        <a href=\"#\" click.delegate=\"openPayRunInfoModal(employer.Id, schedule.Key, payrun.Key)\">\n                                            ${payrun.PaymentDate | shortDate}\n                                        </a>\n                                    </th>\n                                    <td>${payrun.TaxYear}/${payrun.TaxPeriod}</td>\n                                    <td>${payrun.PeriodStart | shortDate} - ${payrun.PeriodEnd | shortDate}</td>\n                                    <td>${payrun.IsSupplementary}</td>\n                                    <td class=\"text-right\">\n                                        <button if.bind=\"schedule.HeadSequence == payrun.Sequence\"\n                                            type=\"button\" \n                                            class=\"btn btn-sm btn-rerun-pay-run launch-modal\" \n                                            data-modal-title=\"Rerun PayRun\" \n                                            click.delegate=\"openRerunPayRunModal(employer.Id, schedule.Key, payrun)\">Rerun</button>\n                                        </button>\n                                        \n                                        <button if.bind=\"schedule.HeadSequence == payrun.Sequence\"\n                                            type=\"button\" \n                                            class=\"btn btn-danger btn-sm btn-delete-pay-run\" \n                                            click.delegate=\"deletePayRun(employer.Id, schedule.Key, payrun.Key)\">Delete</button>          \n                                    </td>\n                                </tr>\n                            </tbody>\n                        </table>\n\n                        <p class=\"card-text\" if.bind=\"schedule.PayRuns.length === 0\">\n                            There are currently no payruns for this pay schedule.\n                            \n                            <a class=\"btn btn-sm btn-primary launch-modal\" \n                                href=\"#employer/${employer.Id}/payRun?paySchedule=${schedule.Key}\" \n                                data-modal-title=\"Create PayRun\"\n                                role=\"button\">Add PayRun</a>\n                        </p>\n                    </div>\n                </div>\n            </div>\n    \n            <div class=\"tab-pane fade\" id=\"pensions\" role=\"tabpanel\" aria-labelledby=\"pensions-tab\">\n                <div class=\"row actions\">\n                    <div class=\"col-sm-12\">\n                        <button class=\"btn btn-primary\" type=\"button\" role=\"button\" click.delegate=\"addAPension()\">Add a Pension</button>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.Pensions.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Id</th>\n                            <th scope=\"col\">Scheme</th>\n                            <th scope=\"col\">Provider</th>\n                            <th scope=\"col\">Provider Employer Ref</th>\n                            <th width=\"200px\"></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"pension of employer.Pensions\">\n                            <th scope=\"row\">\n                                <a href=\"#\" click.delegate=\"editPension(pension)\">\n                                    ${pension.Id}\n                                </a>                            \n                            </th>\n                            <td>${pension.SchemeName}</td>\n                            <td>${pension.ProviderName}</td>\n                            <td>${pension.ProviderEmployerRef}</td>\n                            <td>\n                                <button if.bind=\"!pension.UseForAutoEnrolment\"\n                                    type=\"button\" \n                                    class=\"btn btn-primary btn-sm btn-default-for-ae\" \n                                    click.delegate=\"defaultPensionForAE(employer.Id, pension.Id)\">\n                                    Default for AE\n                                </button>\n    \n                                <button type=\"button\" \n                                    class=\"btn btn-danger btn-sm btn-delete-pension\" \n                                    click.delegate=\"deletePension(employer.Id, pension.Id)\">\n                                    Delete\n                                </button>                             \n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n    \n            <div class=\"tab-pane fade\" id=\"rti-submissions\" role=\"tabpanel\" aria-labelledby=\"rti-submissions-tab\">\n                <div class=\"row actions\" if.bind=\"employer.PayRuns\">\n                    <div class=\"col-sm-12\">\n                        <a class=\"btn btn-primary launch-modal\" \n                            href=\"#employer/${employer.Id}/rtiTransaction\" \n                            role=\"button\">Make FPS Submission</a>\n                    </div>\n                </div>\n\n                <div class=\"card bg-light\" if.bind=\"!employer.PayRuns\">\n                    <div class=\"card-header\">RTI submissions</div>\n                    <div class=\"card-body\">\n                        <p class=\"card-text\">\n                            Start a new <strong>Pay Run</strong> before creating an RTI submission.\n                        </p>\n                    </div>\n                </div>\n    \n                <table class=\"table\" if.bind=\"employer.RTITransactions.length > 0\">\n                    <thead>\n                        <tr>\n                            <th scope=\"col\">Id</th>\n                            <th scope=\"col\">Tax Year</th>\n                            <th scope=\"col\">Transmission Date</th>\n                            <th scope=\"col\">Transaction Status</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr repeat.for=\"transaction of employer.RTITransactions\">\n                            <th scope=\"row\">\n                                <a href=\"#employer/${employer.Id}/rtiTransaction/${transaction.Id}\" target=\"_blank\">\n                                    ${transaction.Id}\n                                </a>\n                            </th> \n                            <td>${transaction.TaxYear}</td>\n                            <td>${transaction.TransmissionDate | longDateTime}</td>\n                            <td>${transaction.TransactionStatus}</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>    \n    \n            <div class=\"tab-pane fade\" id=\"reports\" role=\"tabpanel\" aria-labelledby=\"reports-tab\">\n                <div class=\"coming-soon\">\n                    <h4>Coming soon!</h4>\n                    <p>Check soon to see this functionality wired up with the API</p>\n                </div>\n            </div>\n    \n        </div>\n    </div>\n\n    <div if.bind=\"!employer\">\n        <employer-form></employer-form>\n    </div>\n    \n    <input id=\"employer-id\" type=\"hidden\" value=\"${employer.Id}\">  \n</template>"; });
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
define('dialogs/confirm',["exports", "aurelia-framework", "aurelia-dialog"], function (exports, _aureliaFramework, _aureliaDialog) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Confirm = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Confirm = exports.Confirm = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
        function Confirm(dialogController) {
            _classCallCheck(this, Confirm);

            this.dialogController = dialogController;
        }

        Confirm.prototype.activate = function activate(state) {
            this.state = state;
        };

        Confirm.prototype.yes = function yes() {
            this.dialogController.ok();
        };

        Confirm.prototype.no = function no() {
            this.dialogController.cancel();
        };

        return Confirm;
    }()) || _class);
});
define('text!dialogs/confirm.html', ['module'], function(module) { module.exports = "<template>\n    <ux-dialog>\n        <ux-dialog-header>\n            <h5>\n                ${state.title}\n            </h5>\n        </ux-dialog-header>\n        <ux-dialog-body>\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"col-sm-12 text-left\">\n                        <p>${state.message}</p>\n                    </div>\n                </div>\n            </div>\n        </ux-dialog-body>\n\n        <ux-dialog-footer>\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"col-sm-6 text-left\">\n                        <button class=\"btn btn-secondary\" click.trigger=\"no()\">No</button>\n                    </div>\n                    <div class=\"col-sm-6 text-right\">\n                        <button class=\"btn btn-danger\" click.trigger=\"yes()\">Yes</button>\n                    </div>\n                </div>\n            </div>\n        </ux-dialog-footer>\n    </ux-dialog>\n</template>"; });
define('app',["exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-dialog", "aurelia-http-client", "job/job-details-modal", "aurelia-pal"], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaDialog, _aureliaHttpClient, _jobDetailsModal, _aureliaPal) {
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

	var _dec, _class;

	var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _aureliaDialog.DialogService), _dec(_class = function () {
		function App(eventAggregator, dialogService) {
			_classCallCheck(this, App);

			this.ea = eventAggregator;
			this.dialogService = dialogService;
		}

		App.prototype.activate = function activate() {
			var _this = this;

			this.ea.subscribe("app:view-job", function (job) {
				var client = new _aureliaHttpClient.HttpClient();

				client.get("/api/job/" + job.id + "/" + job.type).then(function (data) {
					var job = JSON.parse(data.response);

					var opts = {
						viewModel: _jobDetailsModal.JobDetailsModal,
						model: job
					};

					_this.dialogService.open(opts);
				});
			});
		};

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
	}()) || _class);
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