'use strict';
var scope = ['$scope', '$http', '$timeout', '$interval', '$uibModal', "baseUrl", function ($scope, $http, $timeout, $interval, $uibModal, baseUrl) {
    var BaseUrl = baseUrl.getUrl();
    var row = 8,
        col = 4;
    $scope.matrix = new Array(row);
    for (var i = 0; i < row; i++) {
        //$scope.matrix[i] = [1,2,1,1];
        $scope.matrix[i] = new Array(col)
    }
    var last_event_id=0;
    var same_event_count = 0;
    var reNewInfo = function () {
        $http.get(BaseUrl + "/api/1/location/init/").success(function (data) {
            var data = data.data;
            for (var i = 0; i < $scope.matrix.length; i++) {
                for (var j = 0; j < $scope.matrix[i].length; j++) {
                    $scope.matrix[i][j] = 0;
                }
            }
            for (var i = 0; i < data.length; i++) {
                var name = data[i].name;
                if (name.length == 5) {
                    var posX = parseInt(name.slice(0, 2)) - 1,
                        posY = parseInt(name.slice(2, 4)) - 1,
                        posZ = name.slice(4, 5);
                } else if (name.length == 4) {
                    var posX = parseInt(name.slice(0, 1)) - 1,
                        posY = parseInt(name.slice(1, 3)) - 1,
                        posZ = name.slice(3, 4);
                }
                console.log(posX, posY, posZ);
                $scope.matrix[posX][posY] = 1;
            }
        }).error(function () {

        });

        $http.get(BaseUrl + "/api/1/eventlog/?descent=id&number=1&index=1&event_feedback_type=1").success(function (data) {
            if (data.code != 200 | data.data.length == 0) {
                return false;
            }
            var data = data.data[0];
            var event_log_id= data.id;
            if (event_log_id == last_event_id){
                return false
            }
            last_event_id = event_log_id;
            $scope.warn = data.description;

        }).error(function () {

        })
    };
    reNewInfo();
    var interval = $interval(reNewInfo, 6000);
    $scope.$on("$destroy",function(){
        $interval.cancel(interval)
    });
    $scope.click = function () {
        console.log(2)
    }
}];
return scope;
