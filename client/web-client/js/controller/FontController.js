fontSubsetterControllers.controller('FontController', ["$timeout", "$http", "$scope", "$routeParams", "FontInfoService", "CssService",

    function FontController($timeout, $http, $scope, $routeParams, FontInfoService, CssService) {

        var STYLE_TEMPLATE = "@font-face{font-family:'%family-name%';src:url(data:application/x-font-ttf;charset=utf-8;base64,%base64%) format('woff')}";

        var hash = $routeParams.hash;
        $scope.chars = null;
        $scope.subset = null;
        $scope.fontInfo = null;

        $scope.genSubset = function () {
            var chars = $scope.chars = angular.element(document.getElementById('subset-input')).val();
            FontInfoService.genSubset(hash, chars).then(function (data) {
                $scope.subset = data;
                var woffBase64 = data['woff'];
                var rule = STYLE_TEMPLATE.replace("%family-name%", hash).replace('%base64%', woffBase64);
                CssService.addRule(rule);
                $timeout(function () {
                    angular.element(document.getElementById('chars-preview-container')).css('font-family', "'" + hash + "'");
                }, 0);
            }, function (data) {
                alert(data.message);
            });
        }

        FontInfoService.getFontInfo(hash).then(function (data) {
            $scope.fontInfo = data;
        }, function (data) {
            alert(data.message);
        });
    }
]);