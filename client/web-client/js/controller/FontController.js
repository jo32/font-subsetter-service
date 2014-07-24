fontSubsetterControllers.controller('FontController', ["$http", "$scope", "$routeParams", "FontInfoService",

    function FontController($http, $scope, $routeParams, FontInfoService) {

        $scope.fontInfo = null;

        FontInfoService.getFontInfo($routeParams.hash).then(function (data) {
            $scope.fontInfo = data;
        }, function (data) {
            alert(data.message);
        });
    }
]);