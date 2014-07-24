var fontSubsetter = angular.module("fontSubsetter", [
    'ngRoute',
    'ngSanitize',
    'fontSubsetterControllers'
]);

fontSubsetter.filter('slice', function () {
    return function (arr, start, pageSize) {
        return (arr || []).slice(start, start + pageSize);
    };
});

var fontSubsetterControllers = angular.module("fontSubsetterControllers", []);

// routing of this app
fontSubsetterControllers.config(function ($routeProvider, $locationProvider) {

    // routing for struct
    $routeProvider.when('/', {
        templateUrl: "./partials/list.html",
        controller: "FontListController"
    }).when('/upload', {
        templateUrl: "./partials/upload.html",
        controller: "UploadController"
    });

});