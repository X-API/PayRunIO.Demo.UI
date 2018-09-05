define('welcome/welcome',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Welcome = exports.Welcome = function Welcome() {
        _classCallCheck(this, Welcome);
    };
});
define('text!welcome/welcome.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"no-selection text-center\">\n        <h2>${message}</h2>\n    </div>\n</template>"; });
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

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
    aurelia.use.standardConfiguration().feature('resources');

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
define('app',['exports', 'aurelia-pal'], function (exports, _aureliaPal) {
	'use strict';

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
			config.title = 'Welcome';
			config.map([{
				route: '',
				moduleId: _aureliaPal.PLATFORM.moduleName('welcome/welcome'),
				title: 'Welcome'
			}]);

			this.router = router;
		};

		return App;
	}();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./header/header\"></require>\t\n\t<require from=\"./footer/footer\"></require>\n\t<require from=\"./api-calls/api-calls\"></require>\n\n\t<header></header>\n\n\t<div class=\"container content-container\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t<router-view></router-view>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<footer></footer>\n\n\t<api-calls></api-calls>\n</template>"; });
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