/**
 * Created by tangjianfeng on 16/5/18.
 */
"use strict"

var scope = ["$scope","$http",'$uibModal',"baseUrl","url_junction", function($scope, $http, $uibModal,baseUrl,url_junction) {
    var urlBase = baseUrl.getUrl();
    $scope.$emit("addr_change",'card');
  
    $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalInstanceCtrl',
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
                            choice:$scope.choice,
                            scope:$scope,
                            data:{'status':0}
                        }
                    }else if(method=="replace"){
                        return {
                            title:"替换RFID卡",
                            method:"replace",
                            status_disable:true,
                            data:$scope.query_result[index],
                            scope:$scope
                        }
                    }
                    else{
                        return {
                            title:"修改记录",
                            method:"modify",
                            status_disable:false,
                            data:$scope.query_result[index],
                            choice:$scope.choice,
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
    $scope.serial_number = "";
    $scope.status = "-1";
    $scope.table_hide = true;
    $scope.choice = {};
    $scope.number = '10';
    $scope.query_result = {}
    $http.get(urlBase + "/api/1/common/choices/?key=rfidcard").success(function(data){
        if(data.code==200){
            $scope.choice = data;
        }else{
            alert(data.message)
        }
    }).error(function(data,state){
        if(state == 403){
            baseUrl.redirect()
        }
    });
    $scope.order = {
        id: false,
        serial_number: false,
        status:false,
        updated_at:false,
        created_at:false
    };
    $scope.switch_order = function(key){
        $scope.order[key] = !$scope.order[key];
        $scope.submit_search()
    };
    ///
    $scope.setPage = function (pageNo) {
        $scope.submit_search();
    };
    $scope.changePage = function(a){
        $scope.submit_search()
    };
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    //
    $scope.submit_search = function(){
        $scope.table_hide = false;
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
        var query_url = url_junction.getQuery({
            serial_number:$scope.serial_number,
            status:$scope.status,
            index:$scope.bigCurrentPage,
            number:$scope.number,
            descent:order_str
        });
        $http.get(urlBase+"/api/1/card/"+ query_url).success(function(data){
            if(data.code==200){
                $scope.query_result = data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;
            }else{
                alert(data.message)
            }
        }).error(function(data,state){
            if(state == 403){
                baseUrl.redirect()
            }
        })
    };
    $scope.submit_search()
}]

return scope