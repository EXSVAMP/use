var app = angular.module('RDash');
app.register.controller("functionSetCtrl", function ($scope, $http, $timeout, $location, baseUrl, listService, global, utils, popService) {
    var urlBase = baseUrl.getUrl();
    // $scope.selections={};
    $scope.params = {};
    $scope.light_action_list = {};
    $scope.camera_action_list = {};
    $scope.params.flag = false;
    $scope.search_common = function () {
        $http.get(urlBase + "/api/2/func/mainset").success(function (data) {
            $scope.dataList_common = data.data;
            angular.forEach($scope.dataList_common, function (item) {
                if (item.status == 0) {
                    item.checked = true;
                }
                if (item.status == 1) {
                    item.checked = false;
                }
            })

        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        });
    }


    $scope.setCommon = function (main_event, state) {
        $scope.main_event = main_event;
        if (state == false) {
            $scope.status = "1";
        }
        if (state == true) {
            $scope.status = "0";
        }
        $http.post(urlBase + "/api/2/func/mainset", {
            "main_event": $scope.main_event,
            "status": $scope.status
        }).success(function (data) {
            $scope.search_common();
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        });
    }


    $scope.search_detail = function () {
        $http.get(urlBase + "/api/2/func/subset").success(function (data) {
            $scope.dataList_detail = data.data;
            angular.forEach($scope.dataList_detail, function (item) {
                if (item.status == 0) {
                    item.checked = true;
                }
                if (item.status == 1) {
                    item.checked = false;
                }

            })
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        });
    }
    $scope.choice = function () {
        $http.get(urlBase + "/api/1/common/choices/?key=sub_event_set").success(function (data) {
            if (data.code == 200) {
                $scope.light_action_list = data.data.light_action;
                $scope.camera_action_list = data.data.camera_action;
            }
        })
    }


    $scope.changeset = function (subject, value, items) {
        if (subject == "light_action") {
            items.light_action = value;
        }
        if (subject == "camera_action") {
            items.camera_action = value;
        }

        $scope.setDetail(items);

    }


    $scope.setDetail = function (items) {
        if (items.checked == false) {
            items.status = "1";
        }
        if (items.checked == true) {
            items.status = "0";
        }

        $scope.paramsList = {
            "sub_event": items.sub_event,
            "status": items.status,
            "set_type": items.set_type,
            "light_action": items.light_action,
            "camera_action": items.camera_action,
        }

        $http.post(urlBase + "/api/2/func/subset", $scope.paramsList).success(function (data) {
            // $scope.search_detail();
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        });
    }
  
    $scope.search_common();
    $scope.search_detail();
    $scope.choice();
});
