var fontSubsetter = angular.module("fontSubsetter", [
    'ngRoute',
    'ngSanitize',
    'fontSubsetterControllers'
]);

fontSubsetter.config([
    '$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(data:application\/x-font-|http|https|ftp|mailto)/);
    }
]);

fontSubsetter.filter('slice', function () {
    return function (arr, start, pageSize) {
        return (arr || []).slice(start, start + pageSize);
    };
});

fontSubsetter.service('CssService', [

    function CssService() {

        this.addRule = function (text) {
            var s = document.createElement('style');
            s.type = "text/css";
            s.innerHTML = text;
            document.getElementsByTagName('head')[0].appendChild(s);
        }
    }
]);

fontSubsetter.service('FontInfoService', ["$q", "$http",
    function FontInfoService($q, $http) {

        this.uploadFont = function (hash, file) {
            var fontUrl = "/font/" + hash;
            var deffered = $q.defer();
            $http({
                method: "POST",
                url: fontUrl,
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    font: file
                },
                transformRequest: function (data) {
                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        fd.append(key, value);
                    });
                    return fd;
                }
            }).success(function (data, status, headers, config) {
                deffered.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                deffered.reject(data, status, headers, config);
            });
            return deffered.promise;
        }

        this.getFontInfo = function (hash) {
            var fontUrl = "/font/" + hash;
            var deffered = $q.defer();
            $http({
                method: "GET",
                url: fontUrl
            }).success(function (data, status, headers, config) {
                deffered.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                deffered.reject(data, status, headers, config);
            });
            return deffered.promise;
        }

        this.deleteFont = function (hash) {
            var fontUrl = "/font/" + hash;
            var deffered = $q.defer();
            $http({
                method: "DELETE",
                url: fontUrl
            }).success(function (data, status, headers, config) {
                deffered.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                deffered.reject(data, status, headers, config);
            });
            return deffered.promise;
        }

        this.getFontList = function () {
            var deffered = $q.defer();
            $http({
                method: "GET",
                url: '/font'
            }).success(function (data, status, headers, config) {
                deffered.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                deffered.reject(data, status, headers, config);
            });
            return deffered.promise;
        }

        this.genSubset = function (hash, chars) {
            var deffered = $q.defer();
            $http({
                method: "GET",
                url: '/subset/' + hash,
                params: {
                    'chars': chars
                },
            }).success(function (data, status, headers, config) {
                deffered.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                deffered.reject(data, status, headers, config);
            });
            return deffered.promise;
        }
    }
]);

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
    }).when('/font/:hash', {
        templateUrl: "./partials/font.html",
        controller: "FontController"
    });

});