define(['services/data', 'durandal/app', 'services/messages', 'plugins/dialog'], function (data, app, msg, dialog) {
    'use strict';
    var Module = function () {
        var self = this;
        var USER = 1, PROJECT = 1;
        var favoriteId;
        var favorite = ko.observable('').extend({ required: true, message: 'Required' });

        this.favorite = favorite;
        this.save = function () {
            if (!favorite.isValid()) {
                return;
            }
            app.trigger('busy', true);
            data.saveFavorite({ ProjectID: PROJECT, UserID: USER, ID: favoriteId, Label : favorite() }).done(function () {
                $("#dialog").modal('hide');
                msg.showInfo('Favoriten-Ordner saved');
                dialog.close(self, {saved: true});
            }).always(function () {
                app.trigger('busy', false);
            });
        };
        this.attached = function () {
            $("#dialog").modal({backdrop: 'static'}).modal('show');
            $('#dialog').on('hidden.bs.modal', function (e) {
                $(".modalBlockout").remove();
                $(".modalHost").remove();
            });
        };
        this.activate = function(id) {
            if (id) {
                data.getFavorite(id).done(function(fav) {
                    favoriteId = fav.ID;
                    favorite(fav.Label);
                }).fail(function() {msg.showError("Failed to load favorite");})
            }
        };
    };
    return Module;
});