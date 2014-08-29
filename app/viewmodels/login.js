define(['services/auth', 'plugins/router'], function(auth, router) {
    
    var username = ko.observable(''),
        password = ko.observable('');
        project = ko.observable('');
    
    username.extend({required: true});
    password.extend({required: true});
    project.extend({required: true});
    
    var viewModel = {
        rememberMe: ko.observable(false),
        username: username,
        password: password,
        project: project,
        message: ko.observable(''),
        canActivate: function() {
            if (!auth.isAuthenticated()) {
                return true;
            }
            return true;
        },
        activate: function(redirect) {
            viewModel.redirect = redirect || "";
        },
        login: function() {
            if (!username.isValid() || !password.isValid() || !project.isValid()) {
                viewModel.message('Please enter username, password and project');
                return;
            }
            var msg = auth.login({username: viewModel.username, password: viewModel.password, remember: viewModel.rememberMe, projectCode: viewModel.project})
            msg.done(function() {
                router.navigate(viewModel.redirect);
            }).fail(function(err) {
                viewModel.message(err.statusText)
            })
        }
    };
    return viewModel;
})