fontSubsetterControllers.controller('UploadController', ["$scope", "$http",

    function UploadController($scope, $http) {

        var worker = new Worker("worker.js");
        $scope.fontInfo = null;

        worker.onmessage = function (event) {

            var hash = event.data.hash;
            var file = event.data.file;
            var fontUrl = "/font/" + hash;
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
                $http({
                    method: "GET",
                    url: fontUrl
                }).success(function (data, status, headers, config) {
                    $scope.fontInfo = data;
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
            }).error(function (data, status, headers, config) {
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