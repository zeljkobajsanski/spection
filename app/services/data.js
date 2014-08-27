define(['plugins/http'], function (http) {
    "use strict";
    //var url = 'http://localhost:49754/MobileData/',
    var url = 'http://spection.brizb.rs/MobileData/',
        module = {
            getProject: function (projectId) {
                return http.get(url + 'GetProject/' + projectId);
            },
            filterTasks: function (filterId) {
                return http.get(url + 'FilterTasks/' + filterId);
            },
            saveFavorite: function (favorite) {
                return $.ajax({
                    url: url + 'SaveFavorite',
                    type: 'POST',
                    crossDomain: true,
                    dataType: 'json',//server response type
                    data: favorite
                });
            },
            getFavorites: function (projId, userId) {
                return http.get(url + 'GetFavorites', { projectId: projId, userId: userId });
            },
            getTasksForFavorite: function (id) {
                return http.get(url + 'GetTasksForFavorite/' + id);
            },
            getFavorite: function(id) {
                return http.get(url + 'GetFavorite/' + id);
            },
            getPhases: function (projectId) {
                return http.get(url + 'GetCaptions', { projectId: projectId });
            },
            savePhase: function (data) {
                return $.ajax({
                    url: url + 'SavePhase',
                    type: 'POST',
                    processData: false,//important
                    contentType: false,//important
                    dataType: 'json',//server response type
                    data: data
                });
            },
            getSubPhases: function (projectId, superphase) {
                return http.get(url + 'GetSubPhases', { projectId: projectId, superPhaseId: superphase });
            },
            getPhase: function (id) {
                return http.get(url + 'GetPhase/' + id);
            },
            deleteFavorite: function (id) {
                return $.ajax({
                    url: url + 'DeleteFavorite/' + id,
                    crossDomain: true,
                    type: 'POST'
                });
            },
            getPriorities: function () {
                return http.get(url + 'GetPriorities');
            },
            getTaskStatuses: function () {
                return http.get(url + 'GetTaskStatuses');
            },
            getAllPhases: function (projectId) {
                return http.get(url + 'GetAllPhases', {projectId: projectId});
            },
            getTaskTypes: function () {
                return http.get(url + 'GetTaskTypes');
            },
            getMilestones: function () {
                return http.get(url + 'GetMilestones');
            },
            getProjectRisks: function () {
                return http.get(url + 'GetProjectRisks');
            },
            getProductRisks: function () {
                return http.get(url + 'GetProductRisks');
            },
            getLevels: function () {
                return http.get(url + 'GetLevels');
            },
            saveTask: function (task) {
                //return http.post(url + "SaveTask", task);
                return $.ajax({
                    url: url + 'SaveTask',
                    type: 'POST',
                    crossDomain: true,
                    dataType: 'json',//server response type
                    data: task
                });
            },
            getPhaseWithDetails : function (id) {
                return http.get(url + 'GetPhaseWithDetails/' + id);
            },
            getTask : function (taskId) {
                return http.get(url + 'GetTask/' + taskId);
            },
            getNumerOfTasksForPhase: function (id) {
                return http.get(url + 'GetNumerOfTasksForPhase/' + id);
            },
            saveFiles: function(data) {
                return $.ajax({
                        url: url + 'SaveFiles',
                        processData: false,//important
                        contentType: false,//important
                        type: 'POST',
                        //dataType: 'json',//depending on your server side response
                        data: data//our FormData object
                    })
            },
            downloadFile: function(id) {
                window.open(url + 'DownloadFile/' + id, 'Preview');   
            },
            deleteFile: function (id) {
                return $.ajax({
                    url: url + "DeleteFile",
                    type: 'POST',
                    crossDomain: true,
                    data: {id: id}
                });
            },
            savePicture: function(data) {
                return $.ajax({
                        url: url + 'SavePicture',
                        processData: false,//important
                        contentType: false,//important
                        type: 'POST',
                        //dataType: 'json',//depending on your server side response
                        data: data//our FormData object
                    });
            }
        };
    return module;
});