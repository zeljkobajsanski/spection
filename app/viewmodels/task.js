define(['durandal/app', 'services/data', 'services/messages'], function(app, data, msg) {
    var PROJECT = 1, USER = 1;
    var taskId;
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
        Picture: '',
        //Documents: [{ ID: 0, Name: 'test.pdf', Size: 100 }],
        Files: [],
        Comments: [],
        Shortcuts: [],
        History: []
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
        },
        loadTask = function() {
            if (taskId) {
                app.trigger('busy', true);
                data.getTask(taskId).done(function(t) {
                    ko.mapping.fromJS(t, task);
                }).always(function() { app.trigger('busy', false); });
            } else {
                createNewTask();
            }
        },
        createNewTask = function() {
            ko.mapping.fromJS({
                ID: '',
                AuthorID: '',
                ProjectID: '',
                Title: '',
                PriorityID: '',
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
                Files: [],
                Picture: '',
                //Documents: [{ ID: 0, Name: 'test.pdf', Size: 100 }],
                Comments: [],
                Shortcuts: [],
                History: []
            }, task);
        }
    
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
        save: function() {
            if (!task.Title.isValid()) {
                msg.showWarning("Data are invalid");
                return;
            };
            app.trigger('busy', true);
            if (!task.ID()) {
                task.AuthorID(USER);
                task.ProjectID(PROJECT);
            }
            var forSave = ko.mapping.toJS(task);
            forSave.Picture = undefined;
            data.saveTask(forSave).done(function(id) {
                task.ID(id);
                var fd = new FormData();
                fd.append('taskId', id);
                var fileInput = $("#my-file-input");
                var files = fileInput.data('ace_input_files');
                if (files && files.length > 0) {
                    for(var i = 0; i < files.length; i++) {
                        fd.append('files', files[i]);
                    }
                    fileInput.ace_file_input('loading' , true);
                    data.saveFiles(fd).done(function() {
                        for(var i = 0; i < files.length; i++) {
                            var f = {FileName: files[i].name, Size: files[i].size};
                            task.Files.push(f);
                        }
                        fileInput.ace_file_input("reset_input");
                    }).fail(function(){
                        msg.showError("File not saved");
                    }).always(function(){fileInput.ace_file_input('loading' , false);});
                }
                fd = new FormData();
                var pictureInput = $("input[name=bild]");
                var picture = pictureInput.data('ace_input_files');
                if (picture && picture.length == 1) {
                    fd.append('taskId', id);
                    fd.append('picture', picture[0]);
                    pictureInput.ace_file_input('loading' , true);
                    data.savePicture(fd).done(function(result) {
/*                        $("#bild").get(0).src = result;
                        $("#bild").show().next().hide();*/
                    }).fail(function(){
                        msg.showError("Picture not saved");})
                    .always(function(){
                        pictureInput.ace_file_input('loading' , false);
                    });
                }
                msg.showInfo('Anforderung saved');
                app.trigger('refresh:kapitel');
            })
            .fail(function ()      
                 { msg.showError("Fehler"); 
             }).always(function () { app.trigger('busy', false); });
        },
        downloadFile: function(file) {
            data.downloadFile(file.ID());
        },
        deleteFile: function(file) {
            data.deleteFile(file.ID()).done(function(){
                task.Files().forEach(function(item, ix){
                    if (item.ID() == file.ID()) {
                        task.Files.splice(ix, 1);
                    }
                })
                msg.showWarning("File deleted");
            }).fail(function(){msg.showError("Delete failed")});
        },
        activate: function(task) {
            taskId = task;
            loadData();
            loadTask();
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
                    showbuttons: false,
                    image: {
                        name: 'bild',//name should be here as well

                        //custom file input options
                        btn_choose: 'Select Image',
                        maxSize: 3145728,   //~3 Mb

                        //inline editable callback option
                        on_error: function (error_type) {
                            //invalid file selected, for example display an error message
                            if (error_type == 1) {
                                msg.showWarning("Image type is incorrect");
                            } else if (error_type == 2) {
                                msg.showWarning("Image size is greater than 3MB");
                            }
                            else {
                                msg.showWarning("Image is not valid");
                            }
                        },
                        on_success: function () {
                            
                        }
                    }
                });
            });
        }
    };
    return viewModel;
})