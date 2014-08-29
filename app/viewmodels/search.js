define(['services/data', 'services/messages', 'plugins/router', 'durandal/app'], function (data, msg, router, app) {
    var vm = function() {
        
        var filterName   = ko.observable(),
            tasks        = ko.observableArray([]),
            subscription = undefined,
            search = function (filter) {
                app.trigger('busy', true);
                data.filterTasks(filter).done(function (result) {
                        filterName(result.filterName);
                        tasks(result.tasks);
                }).fail(function () {
                    msg.showError("Failed to filter tasks");
                }).always(function(){ app.trigger('busy', false) });
            };
        
        this.filterName = filterName;
        this.tasks = tasks;
        this.gotoTask = function (task) {
            router.navigate("#task/" + task.ID);
        };
        this.activate = function (filter) {
            search(filter);
            subscription = app.on('search', search);
        };
        
        this.deactivate = function (){
            if (subscription) subscription.off();
        };
        this.preventAnonymous = true;
    };
    
    return vm;
});