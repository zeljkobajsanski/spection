requirejs.config({
    urlArgs: "version=1.3",
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins',
        'transitions': '../js/durandal/transitions',
        'knockout': '../js/knockout-3.1.0',
        'jquery': '../js/jquery1x.min.js',
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

define(function (require) {
    var system = require('durandal/system'),
        app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator')
        router = require('plugins/router'),
        auth = require('services/auth');

    system.debug(true);

    app.title = 'Spection';

    app.configurePlugins({
        router: true,
        dialog: true
    });
    
    router.guardRoute = function (instance, instruction) {
        if (auth.isAuthenticated()) {
            return true;
        } else {
            if (instance && typeof (instance.preventAnonymous) === "boolean") {
                if (instance.preventAnonymous) {
                    return 'login/' + instruction.fragment;
                }
            }

            return true;
        }
    };

    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot('viewmodels/shell', 'entrance');
    });
});