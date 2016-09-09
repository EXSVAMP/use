/**
 * Created by tangjianfeng on 16/5/18.
 */
"use strict"
var scope = ["$scope","$http","baseUrl","url_junction","$uibModal", function($scope, $http, baseUrl, url_junction,$uibModal) {
    var urlBase = baseUrl.getUrl();
    $scope.event_type="-1";
    $scope.rfid_id="";
    $scope.reader_id="-1";
    $scope.camera_id="-1";
    $scope.event_feedback_type="-1";
    $scope.handle_id="-1";
    $scope.number = '10';
    $scope.numPages = 10;
    $scope.order={
        id:true,
        event_type:false,
        event_feedback_type:false,
        event_feedback_detail:false,
        event_datetime:false,
        handle_result:false
    };
    ///
    $scope.setPage = function (pageNo) {
        $scope.submit_search();
    };
    $scope.changePage = function(a){
        $scope.submit_search();
    };
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    //
    $scope.switch_order = function(key){
        $scope.order[key] = !$scope.order[key];
        $scope.submit_search()
    };
    $http.get(urlBase + "/api/1/common/choices/?key=eventlog").success(function(data){
        if(data.code==200){
            $scope.choice = data;
        }else{
            alert(data.message)
        }
    });
    $http.get(urlBase + "/api/1/camera/").success(function(data){
        $scope.camera = data;
    });
    $http.get(urlBase + "/api/1/reader/").success(function(data){
        $scope.reader = data;
    });
    
    $scope.submit_search = function(){  //search type 0:搜索1:更新
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
            event_type: $scope.event_type,
            rfid_id: $scope.rfid_id,
            reader_id: $scope.reader_id,
            camera_id: $scope.camera_id,
            event_feedback_type: $scope.event_feedback_type,
            handle_result:$scope.handle_id,
            descent:order_str,
            index:$scope.bigCurrentPage,
            number:$scope.number
        });
        $http.get(urlBase+"/api/1/eventlog/"+ query_url).success(function(data){
            if(data.code==200){
                $scope.query_result = data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;
            }else{
                alert(data.message)
            }
        })
    };

    $scope.submit_search()
    // 警告处理弹
    $scope.open=function(size,index){
        var modalInstance=$uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalEventlog',
            templateUrl: "myModalContent.html",
            size: size,
            resolve:{
                items:function(){
                    return {
                        title:"处理记录",
                        method:"modify",
                        status_disable:false,
                        data:$scope.query_result[index],
                        scope:$scope
                    }
                }
            }


        });
        modalInstance.result.then(function(selectedItem){
            console.log("<====modalInstance实例运行成功===>");
        },function () {
            console.log("<====modalInstance实例运行失败===>");
        })

    }

}]

return scope