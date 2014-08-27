define(['jquery'], function (jQuery) {
    "use strict";
    var module = {
        showInfo: function (message) {
            jQuery.gritter.add({
                title: 'Information',
                text: message,
                class_name: 'gritter-info'
            });
        },
        showError: function (message) {
            jQuery.gritter.add({
                title: 'Fehler',
                text: message,
                class_name: 'gritter-error'
            });
        },
        showWarning: function (message) {
            jQuery.gritter.add({
                title: 'Warning',
                text: message,
                class_name: 'gritter-warning'
            });
        }
    };
    return module;
})