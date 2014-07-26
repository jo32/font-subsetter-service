fontSubsetterControllers.controller('FontListController', ["$http", "$scope", "FontInfoService",

    function FontListController($http, $scope, FontInfoService) {

        $scope.fontList = [];

        function getFontList() {
            FontInfoService.getFontList().then(function (data) {
                $scope.fontList = data;
            }, function (data) {
                alert(data.message);
            });
        }
        getFontList();

        $scope.delete = function (index) {
            var fontView = $scope.fontList[index];
            FontInfoService.deleteFont(fontView.hash).then(function (data) {
                getFontList();
            }, function (data) {
                alert(data.message);
            });
        }
    }
]);