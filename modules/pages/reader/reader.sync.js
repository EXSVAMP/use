/**
 * Created by tangjianfeng on 16/5/18.
 */
"use strict"
var scope = ["$scope","$http","$uibModal", "baseUrl","url_junction", function($scope, $http,$uibModal, baseUrl,url_junction) {
    var urlBase = baseUrl.getUrl();
    $scope.choice = {};
    $scope.func_type = '-1';
    $scope.status = "-1";
    $scope.description = "";
    $scope.serial_number = "";
    $scope.query_result = {};
    $http.get(urlBase + "/api/1/common/choices/?key=rfidreader").success(function(data){
        if(data.code==200){
            $scope.choice["func_type"] = data.data.func_type;
            $scope.choice["status"] = data.data.status;
        }else{
            alert(data);
        }
    }).error(function(data,state){
        if(state == 403){
            baseUrl.redirect()
        }
    });
    //pager
    $scope.setPage = function (pageNo){
        $scope.submit_search();
    };
    $scope.changePage = function(a){
        $scope.submit_search();
    };
    $scope.number = '10';
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    //
    $scope.order={
        id:false,
        serial_number:false,
        status:false,
        func_type:false,
        updated_at:false,
        created_at:false
    };
    $scope.switch_order = function(key){
        $scope.order[key] = !$scope.order[key];
        $scope.submit_search()
    };
    $scope.submit_search = function(){
        var order_str = "";
        for(var i in $scope.order){
            if($scope.order[i]){
                if(order_str){
                    order_str += ','+i
                }else{
                    order_str += i;
                }
            }
        };
        $http.get(urlBase + "/api/1/reader/"+ url_junction.getQuery({
                func_type:$scope.func_type,
                status:$scope.status,
                description:$scope.description,
                serial_number:$scope.serial_number,
                descent:order_str,
                index:$scope.bigCurrentPage,
                number:$scope.number
            })).success(function(data){
            if(data.code==200){
                $scope.query_result = data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;
            }else{
                console.log(data)
            }
        }).error(function(data,state){
            if(state == 403){
                baseUrl.redirect()
            }
        })
    };
    $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalReader',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if(method=="delete"){
                        return {
                            text:"确认删除这条记录？",
                            method:"delete",
                            data:$scope.query_result[index],
                            scope:$scope
                        }
                    }else if(method=="add"){
                        return {
                            title:"增加一条记录",
                            method:"add",
                            status_disable:true,
                            choice:$scope.choice,  //
                            scope:$scope
                            //data:
                        }
                    }else{
                        return {
                            title:"修改记录",
                            method:"modify",
                            status_disable:false,
                            data:$scope.query_result[index],  //
                            choice:$scope.choice, //
                            scope:$scope
                        }
                    }
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function(){});
    };
    $scope.submit_search();
}]
return scope