define(['plugins/router', 'services/data'], function(router, data) {

    var favorites       = ko.observableArray([]),
        myFilter        = ko.observableArray([]),
        kapitelStruktur = ko.observableArray([]);
    return {
        router: router,
        favorites: favorites,
        kapitelStruktur: kapitelStruktur,
        activate: function() {
            data.getFavorites().done(function(fav) {
                favorites(fav);
            }).fail(function() {});
            data.getPhases(1).done(function(kapitel){
                kapitelStruktur(kapitel);
            }).fail(function(){});
            router.map([
                { route: '', title: 'Home', moduleId: 'viewmodels/home' },
            ]).buildNavigationModel();

            return router.activate();
        },
    };
    
    
})