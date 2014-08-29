define(['plugins/router', 'services/data', 'services/messages', 'durandal/system', 'durandal/app', 'services/auth'], function(router, data, msg, sys, app, auth) {

    var favorites       = ko.observableArray([]),
        myFilter        = ko.observableArray([]),
        kapitelStruktur = ko.observableArray([]),
        busy            = ko.observable(false);
    router.isNavigating.subscribe(function (value){
        busy(value);
    });
    return {
        router: router,
        busy: busy,
        filters: myFilter,
        favorites: favorites,
        kapitelStruktur: kapitelStruktur,
        activate: function() {
            auth.tryLoadUser();
            loadFilters();
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
                { route: 'search/:id', title: 'Tasks', moduleId: 'viewmodels/search' },
                { route: 'login', title: '', moduleId: 'viewmodels/login', },
                { route: 'login/:redirect', title: '', moduleId: 'viewmodels/login' },
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
        newFilter: function() {
            app.showDialog('viewmodels/dialogs/filter').then(function (saved) {
                if (saved) loadFilters();    
            });   
        },
        searchTasks: function(filter) {
            app.trigger('search', filter.filter.ID);
            router.navigate('#search/' + filter.filter.ID);
        },
        auth: auth,
        logout: function () {
            auth.logout();
        },
        attached: function() {
            app.on('busy', function(isBusy){busy(isBusy);}),
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
            $("#filters").contextmenu({
                scopes: '.filter',
                target: '#filterContextMenu1',
                onItem: function (ctx, e) {
                    var id = $(ctx).data('id');
                    var action = $(e.target).data('action');
                    switch(action) {
                        case "edit":
                            app.showDialog('viewmodels/dialogs/filter', id).then(function (saved) {
                                if (saved) loadFilters();    
                            }); 
                            break;
                        case "delete":
                            data.deleteFilter(id).done(function(){
                                loadFilters();
                            }).fail(function(){
                                msg.showError('Filter not deleted');
                            });
                            break;
                    }
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
                
    function loadFilters() {
        data.loadFilters(1, 1).done(function (f) {
            myFilter(f);
        }).fail(function () { 
            msg.showError('Filters loading failed') 
        });
    }
})