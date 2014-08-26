define(['plugins/router', 'services/data', 'services/messages'], function(router, data, msg) {

    var favorites       = ko.observableArray([]),
        myFilter        = ko.observableArray([]),
        kapitelStruktur = ko.observableArray([]);
    return {
        router: router,
        favorites: favorites,
        kapitelStruktur: kapitelStruktur,
        activate: function() {
            msg.showInfo("Willkommen zu Spection")
            data.getFavorites().done(function(fav) {
                favorites(fav);
            }).fail(function() {});
            data.getPhases(1).done(function(kapitel){
                kapitelStruktur(kapitel);
            }).fail(function(){
                msg.showError("Error");
            });
            router.map([
                { route: '', title: 'Home', moduleId: 'viewmodels/home' },
                { route: 'projekte', title: 'Projekte', moduleId: 'viewmodels/projekte' },
                //{ route: 'useCases', title: 'Use Cases', moduleId: 'viewmodels/useCases' },
                { route: 'review', title: 'Review', moduleId: 'viewmodels/review' },
                { route: 'umsetzung', title: 'Umsetzung', moduleId: 'viewmodels/umsetzung' },
                { route: 'feedback', title: 'Produktfeedback', moduleId: 'viewmodels/feedback' },
            ]).buildNavigationModel();

            return router.activate();
        },
    };
    
    
})