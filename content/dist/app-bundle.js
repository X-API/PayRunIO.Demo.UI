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

    var NoSelection = exports.NoSelection = function NoSelection() {
        _classCallCheck(this, NoSelection);

        this.message = "Please Select a Contact.";
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\t<div class=\"container\">\n\t\t<div class=\"row\">\n\t\t\t<router-view class=\"col-md-8\"></router-view>\n\t\t</div>\n\t</div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map