fontSubsetterControllers.controller('FontListController', ["$http", "$scope", "FontInfoService",

    function FontListController($http, $scope, FontInfoService) {

        $scope.fontList = [];

        FontInfoService.getFontList().then(function (data) {
            $scope.fontList = data;
        }, function (data) {
            alert(data.message);
        });
    }
]);