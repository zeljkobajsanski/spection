define([], function() {
    'use strict';
    var s = new ace.data_storage(),
        module = {
            get : function (namespace, key) {
                return s.get(namespace, key);
            },
            set : function (namespace, key, value) {
                s.set(namespace, key, value);
            }
        };
    return module;
});