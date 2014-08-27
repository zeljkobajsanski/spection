define(['durandal/system', 'services/data', 'services/messages', 'plugins/router'], function(system, data, msg, router) {
    var kapitel     = ko.observable(''),
        description = ko.observable(''),
        tasks       = ko.observableArray([]);
    var viewModel = {
        kapitel: kapitel,
        description: description,
        tasks: tasks,
        activate: function(captionId) {
            data.getPhaseWithDetails(captionId).done(function(phase) {
                kapitel(phase.Order + " " + phase.Title);
                description(phase.Description);
                tasks(phase.Tasks);
            }).fail(function() {
                msg.showError("Failed to load kapitel");
            });
        },
        gotoTask: function(task) {
            router.navigate("#task/" + task.ID);
        }
    };
    return viewModel;
})