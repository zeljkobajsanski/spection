define(['durandal/app', 'services/data', 'services/storage', 'plugins/dialog', 'services/messages'],
    function (app, data, storage, dialog, msg) {
    var projId = 1;
    var Module = function () {
        var self = this;
        var phase = {
            ID: 0,
            ProjectID: projId,
            Order: ko.observable(''),
            Title: ko.observable('').extend({ required: true }),
            Description: ko.observable(''),
            SuperPhase: ko.observable('')
        };
        this.phase = phase;
        this.phases = ko.observableArray([]);
        this.attached = function () {
            $("#phase-dialog").modal({keyboard: true}).modal('show');
            $('#phase-dialog').on('hidden.bs.modal', function (e) {
                $(".modalBlockout").remove();
                $(".modalHost").remove();
                
            });
            try {
                document.createElement('IMG').appendChild(document.createElement('B'));
            } catch (e) {
                Image.prototype.appendChild = function(el) {
                };
            }
            $("#photo").editable({
                type: 'image',
                name: 'ImageWrapper',
                //value: phase.Image,
                mode: 'inline',
                showbuttons: false,
                image: {
                    name: 'ImageWrapper',
                    btn_choose: 'Select',
                    droppable: true,
                    maxSize: 500000,
                    on_error: function(error) {
                        
                    },
                    on_success: function() {
                        
                    }
                },
                
            });
            data.getPhases(projId).done(function(dataSource) {
                self.phases(dataSource);
            });
        };
        this.save = function () {
            if (!phase.Title.isValid()) return;
            // Post
            app.trigger('busy', true);
            data.savePhase(phase).done(function () {
                $("#phase-dialog").modal('hide');
                msg.showInfo('Kapitel saved');
                app.trigger('refresh:phases');
                dialog.close(self, { saved: true });
            }).always(function () { app.trigger('busy', false); });
        };
        this.activate = function(id) {
            if (id) {
                data.getPhase(id).done(function(p) {
                    self.phase.ProjectID = p.ProjectID,
                    self.phase.ID = p.ID;
                    self.phase.Order(p.Order);
                    self.phase.Title(p.Title);
                    self.phase.Description(p.Description);
                    if (p.SuperPhaseID) {
                        $.each(self.phases(), function (i, item) {
                            if (item.ID == p.SuperPhaseID) {
                                self.phase.SuperPhase(item);
                            }
                        });
                    }
                });
            }
        }
    };
    
    return Module;
})