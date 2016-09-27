var app = angular.module('RDash');
app.register.controller("cameraCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, url_junction) {
    console.log("5678sss");
    var urlBase = baseUrl.getUrl();


    $scope.status = "-1";
    $scope.func_type = "-1";
    $scope.description = "";
    $scope.storage_names = "";
    // $scope.choice = {};
    $scope.query_result = {};
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
   

    $http.get(urlBase + "/api/1/common/choices/?key=camera").success(function (data) {
        $scope.func_type_Items = [];
        $scope.status_Items = [];
        if (data.code == 200) {

            var dataTemp1 = data.data.func_type;
            var dataTemp2 = data.data.status;
            //功能类型
            $scope.func_type_Items.push({state: '-1', name: '-------------'});
            $scope.status_Items.push({state: '-1', name: '-------------'});
            for (dataItem in dataTemp1) {

                $scope.func_type_Items.push({state: dataItem, name: dataTemp1[dataItem]});
            }
            ;
            //摄像头状态
            for (dataItem in dataTemp2) {
                $scope.status_Items.push({state: dataItem, name: dataTemp2[dataItem]});
            }
            ;

        } else {
            // alert(data);
        }
    }).error(function (data, state) {
        if (state == 403) {
            baseUrl.redirect()
        }
    });

    $scope.select_func_type = function (functype) {
        $scope.func_type = functype;
    }
    $scope.select_status = function (state) {
        $scope.status = state;
    }

    //排序
    $scope.order = {
        id: false,
        serial_number: false,
        func_type: false,
        status: false,
        'updated_at': false,
        'created_at': false
    };

    $scope.switch_order = function (key) {
        $scope.order[key] = !$scope.order[key];
        $scope.submit_search();
    };

     
    $scope.submit_search = function () {
        console.log("<==功能类型==>" + $scope.func_type)
        console.log("<==摄像头状态==>" + $scope.status);

        var order_str = "";
        for (var i in $scope.order) {
            if ($scope.order[i]) {
                if (order_str) {
                    order_str += ',' + i
                } else {
                    order_str += i;
                }
            }
        }

        $http.get(urlBase + "/api/1/camera/" + url_junction.getQuery({
                func_type: $scope.func_type,
                status: $scope.status,
                description: $scope.description,
                storage_names: $scope.storage_names,
                descent: order_str,
                index: $scope.bigCurrentPage,
                number: $scope.number

            })).success(function (data) {
            if (data.code == 200) {
                $scope.query_result = data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;
                $scope.total_page=data.pageinfo.total_page;
                $scope.currentPageTotal=$scope.query_result.length;
                if($scope.currentPageTotal>0){
                    $scope.notFound=false;
                }else{
                    $scope.notFound=true;
                }


            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        })

    };
     $scope.changePage=function(){
         $scope.submit_search();
     }

    $scope.submit_search();
    $scope.open=function(size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalCamera',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items:function(){
                    if(method=="add"){
                        return {
                            title:"新增摄像头信息",
                            method:"add",
                            status_disable:true,
                            scope:$scope
                            //data:
                        }
                    }else if(method=="modify"){
                        return {
                            title:"修改摄像头信息",
                            method:"modify",
                            status_disable:true,
                            data:$scope.query_result[index],
                            scope:$scope
                        }
                    }else if(method=="delete"){
                        return {
                            title:"删除摄像头信息",
                            method:"delete",
                            data:$scope.query_result[index],
                            scope:$scope
                        }
                    }

                }


            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function(){});
    }


 


})