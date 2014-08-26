define(['durandal/system', 'services/data', 'services/messages'], function(system, data, msg) {
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
        }
    };
    return viewModel;
})