define(['plugins/router', 'services/data', 'services/messages', 'durandal/system', 'durandal/app'], function(router, data, msg, sys, app) {

    var favorites       = ko.observableArray([]),
        myFilter        = ko.observableArray([]),
        kapitelStruktur = ko.observableArray([]);
    return {
        router: router,
        favorites: favorites,
        kapitelStruktur: kapitelStruktur,
        activate: function() {
            loadFavorites();
            loadKapitel();
            router.map([
                { route: '', title: 'Home', moduleId: 'viewmodels/home' },
                { route: 'projekte', title: 'Projekte', moduleId: 'viewmodels/projekte' },
                { route: 'usecase', title: 'Use Cases', moduleId: 'viewmodels/usecases' },
                { route: 'review', title: 'Review', moduleId: 'viewmodels/review' },
                { route: 'umsetzung', title: 'Umsetzung', moduleId: 'viewmodels/umsetzung' },
                { route: 'feedback', title: 'Produktfeedback', moduleId: 'viewmodels/feedback' },
                { route: 'favorite/:id', title: 'Favorite', moduleId: 'viewmodels/favorite' },
                { route: 'caption/:id', title: 'Kapitel', moduleId: 'viewmodels/caption' },
                { route: 'task(/:id)', title: 'Task', moduleId: 'viewmodels/task' },
            ]).buildNavigationModel();

            return router.activate();
        },
        gotoFavorite: function(favorite) {
            router.navigate('#favorite/' + favorite.Id);
        },
        gotoCaption: function(caption) {
            router.navigate("#caption/" + caption.Id);
        },
        createNewTask: function() {
            router.navigate("#task");
        },
        newFavorites: function() {
            app.showDialog('viewmodels/dialogs/favorite').then(function(result) {
                if (result.saved) {
                    loadFavorites();
                };
            })
        },
        attached: function() {
            $(".nav-list").contextmenu({
                scopes: '.favorites', 
                target: '#favoritesContexMenu1',
                onItem: function(ctx, e) {
                    var id = $(ctx).data('id');
                    var target = $(e.target).data('action');
                    if (target === 'edit') {
                        app.showDialog('viewmodels/dialogs/favorite', id).then(function(result) {
                            if (result.saved) {
                                loadFavorites();
                            }
                        });
                    } else if (target === 'delete') {
                        data.deleteFavorite(id).done(function(){
                            loadFavorites();
                        });
                    }
                }
            });
            $("#kapitelStruktur").contextmenu({
                scopes: '.kapitel', 
                target: '#kapitelContexMenu',
                onItem: function(ctx, e) {
                    var id = $(ctx).data('id');
                    app.showDialog('viewmodels/dialogs/kapitel', id).then(function(result){
                        if (result.saved) { loadKapitel(); }
                    });
                }
            });
            app.on('refresh:kapitel', loadKapitel);
            /*$("#favorites").on('taphold', {duration: 500}, function (tapEvt) {
                $(this).contextmenu('show', tapEvt);
                return false;
            });*/
        }
    };
    
    function loadFavorites() {
        data.getFavorites(1,1).done(function(fav) {
            favorites(fav);
        }).fail(function() {msg.showError("Favorites loading failed");});
    }
                
    function loadKapitel(){
        data.getPhases(1).done(function(kapitel){
        kapitelStruktur(kapitel);
        }).fail(function(){
            msg.showError("Kapitelstruktur loading failed");
        });
    }
})