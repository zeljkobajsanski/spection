define(['plugins/router', 'services/data', 'services/messages'], function(router, data, msg) {

    var favorites       = ko.observableArray([]),
        myFilter        = ko.observableArray([]),
        kapitelStruktur = ko.observableArray([]);
    return {
        router: router,
        favorites: favorites,
        kapitelStruktur: kapitelStruktur,
        activate: function() {
            data.getFavorites(1,1).done(function(fav) {
                favorites(fav);
            }).fail(function() {msg.showError("Favorites loading failed");});
            data.getPhases(1).done(function(kapitel){
                kapitelStruktur(kapitel);
            }).fail(function(){
                msg.showError("Kapitelstruktur loading failed");
            });
            router.map([
                { route: '', title: 'Home', moduleId: 'viewmodels/home' },
                { route: 'projekte', title: 'Projekte', moduleId: 'viewmodels/projekte' },
                { route: 'usecase', title: 'Use Cases', moduleId: 'viewmodels/usecases' },
                { route: 'review', title: 'Review', moduleId: 'viewmodels/review' },
                { route: 'umsetzung', title: 'Umsetzung', moduleId: 'viewmodels/umsetzung' },
                { route: 'feedback', title: 'Produktfeedback', moduleId: 'viewmodels/feedback' },
                { route: 'favorite/:id', title: 'Favorite', moduleId: 'viewmodels/favorite' },
            ]).buildNavigationModel();

            return router.activate();
        },
        gotoFavorite: function(favorite) {
            router.navigate('#favorite/' + favorite.Id);
        }
    };
    
    
})