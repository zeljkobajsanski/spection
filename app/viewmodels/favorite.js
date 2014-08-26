define(['services/data', 'services/messages'], function(data, msg) {
    
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
        }
    };
    return viewModel;
})