define(['durandal/app', 'services/data', 'services/messages'], function(app, data, msg) {
    var PROJECT = 1;
    var task = ko.mapping.fromJS({
        ID: '',
        AuthorID: '',
        ProjectID: '',
        Title: '',
        PriorityID : '',
        StatusID: '',
        PhaseID: '',
        Description: '',
        Remark: '',
        TypeID: '',
        Solution: '',
        ProjectRiskID: '',
        ProductRiskID: '',
        LevelID: '',
        ProductCosts: '',
        ProductionCosts: '',
        BeneficialNumber: '',
        Source: '',
        Use: '',
        TestCriteria: '',
        //Documents: [{ ID: 0, Name: 'test.pdf', Size: 100 }],
        //Comments: [],
        //Shortcuts: [],
        //History: []
    }),
        priorities = ko.observableArray([]),
        statuses = ko.observableArray([]),
        phases = ko.observableArray([]),
        types = ko.observableArray([]),
        milestones = ko.observableArray([]),
        projectRisks = ko.observableArray([]),
        productRisks = ko.observableArray([]),
        levels = ko.observableArray([]);
    var loadData = function() {
            app.trigger('busy', true);
            $.when(data.getPriorities().done(function(p) { priorities(p); }),
                data.getTaskStatuses().done(function(s) { statuses(s); })),
            data.getAllPhases(PROJECT).done(function(p) { phases(p); }),
            data.getMilestones().done(function(m) { milestones(m); }),
            data.getTaskTypes().done(function(t) { types(t); }),
            data.getProjectRisks().done(function(p) { projectRisks(p); }),
            data.getProductRisks().done(function(p) { productRisks(p); }),
            data.getLevels().done(function(l) { levels(l); })
                .then(function() { app.trigger('busy', false); });
        };
    
    task.Title.extend({ required: true });
    var viewModel = {
        task: task,
        priorities : priorities,
        statuses : statuses,
        phases : phases,
        types : types,
        milestones : milestones,
        projectRisks : projectRisks,
        productRisks : productRisks,
        levels : levels,
        save: function() {},
        activate: function(taskId) {
            loadData();
        }
    };
    return viewModel;
})