fontSubsetterControllers.controller('UploadController', ["$scope", "$http", "FontInfoService",

    function UploadController($scope, $http, FontInfoService) {

        var worker = new Worker("worker.js");
        $scope.fontInfo = null;

        worker.onmessage = function (event) {

            var hash = event.data.hash;
            var file = event.data.file;
            FontInfoService.uploadFont(hash, file).then(function (data) {
                FontInfoService.getFontInfo(hash).then(function (data) {
                    $scope.fontInfo = data;
                }, function (data) {
                    alert(data.message);
                });
            }, function (data) {
                alert(data.message);
            });
        }

        function calCulateMd5(file) {
            worker.postMessage(file);
        }

        $scope.upload = function () {

            var fileSelector = document.getElementById("file-selector");
            var file = fileSelector.files[0] || null;
            if (!file) {
                return alert("No file is selected.");
            }
            worker.postMessage(file);
        }
    }
]);