define(['services/data', 'services/messages', 'plugins/router'], function(data, msg, router) {
    
    var favorite = ko.observable(''),
        tasks    = ko.observableArray([]);
    
    var viewModel = {
        favorite: favorite,
        tasks: tasks,
        activate: function(favoriteId) {
            data.getTasksForFavorite(favoriteId).done(function(fav) {
                favorite(fav.Favorite);
                tasks(fav.Tasks)
            }).fail(function() {
                msg.showError("Error during retriving tasks");
            });
        },
        gotoTask: function(task) {
            router.navigate("#task/" + task.ID);
        }
    };
    return viewModel;
})