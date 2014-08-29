define(['plugins/router', 'services/data', 'durandal/app'], function(router, data, app) {
    var model = {
        isAuthenticated: ko.observable(false),
        username: ko.observable(''),
        userID : 0,
        project: ko.observable(''),
        projectID: 0,
        logout: function () {
            model.isAuthenticated(false);
            router.navigate('#login');
        },
        login: function(credentials) {
            var dfd = $.Deferred();
            app.trigger('busy', true);
            data.login(credentials).done(function (result) {
                model.username(result.Username);
                model.userID = result.UserID;
                model.project(result.Project);
                model.projectID = result.ProjectID;
                model.isAuthenticated(true);
                var storage = new ace.data_storage();
                if (credentials.remember()) {
                    storage.set('userdata', JSON.stringify(result));
                } else {
                    storage.remove('userdata');
                }
                dfd.resolve();
            }).fail(function (err) {
                dfd.reject(err);
            }).always(function() {app.trigger('busy', false);})
            return dfd;
        },
        tryLoadUser: function() {
            var storage = new ace.data_storage();
            var userdata = storage.get('userdata');
            if (userdata) {
                var result = JSON.parse(userdata);
                model.username(result.Username);
                model.userID = result.UserID;
                model.project(result.Project);
                model.projectID = result.ProjectID;
                model.isAuthenticated(true);
            }
        }
    }
    return model;
})