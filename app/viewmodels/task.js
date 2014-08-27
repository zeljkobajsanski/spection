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
        },
        attached: function() {
               $('#tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                try {
                    document.createElement('IMG').appendChild(document.createElement('B'));
                } catch (e) {
                    Image.prototype.appendChild = function (el) {
                    };
                }
                $('#my-file-input').ace_file_input({});
                $('#bild').editable({
                    type: 'image',
                    name: 'bild',
                    mode: 'inline',
                    showbuttons: true,
                    value: null,
                    image: {
                        name: 'bild',//name should be here as well

                        //custom file input options
                        //btn_choose: 'Change Avatar',
                        droppable: true,
                        maxSize: 1100000,//~1000kb

                        //inline editable callback option
                        on_error: function (error_type) {
                            //invalid file selected, for example display an error message
                            if (error_type == 1) {
                                //file format error
                            } else if (error_type == 2) {
                                //file size rror
                            }
                            else {
                                //other error
                            }
                        },
                        on_success: function () {
                            $("#bild").show();
                        }
                    },
                    url: function (params) {
                        //actual file upload happens here
                        //see "examples/profile-avatar-update.js"
                    }
                });
            });
        }
    };
    return viewModel;
})