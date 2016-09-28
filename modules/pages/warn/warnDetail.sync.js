var app = angular.module('RDash');
app.register.controller("warnDetailCtrl", function ($scope, $http, params,$location,baseUrl,$uibModal) {
    var data = $location.search();
    $scope.refresh=function(){
        $http.get(baseUrl.getUrl()+'/api/1/eventlog/'+data.id+"/").success(function(data){
            if(data.code==200){
                $scope.detail = data.data;
                $scope.detail.img2='http://img0.imgtn.bdimg.com/it/u=3761389663,2619900045&fm=11&gp=0.jpg';
                $scope.detail.records=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
                var rfid_list_display = '';
                angular.forEach($scope.detail.rfid_list,function(item){
                    if(rfid_list_display!=''){
                        rfid_list_display+=',';
                    }
                    rfid_list_display+=item.rfid_id;
                });
                $scope.detail.rfid_list_display=rfid_list_display
            }
        });
    }
    $scope.refresh();
    $scope.tabSwitch = 0;
    $scope.open=function(){
        var modalInstance = $uibModal.open({
            controller: 'warnHandlePopCtrl',
            templateUrl: "statics/modules/pages/warn/warnHandlePop.html",
            size: 'md',
            resolve: {
                callbackFn:function(){
                    return function(data){
                        $scope.detail=data;
                        $scope.detail.img2='http://img0.imgtn.bdimg.com/it/u=3761389663,2619900045&fm=11&gp=0.jpg';
                        $scope.detail.records=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
                        var rfid_list_display = '';
                        angular.forEach($scope.detail.rfid_list,function(item){
                            if(rfid_list_display!=''){
                                rfid_list_display+=',';
                            }
                            rfid_list_display+=item.rfid_id;
                        });
                        $scope.detail.rfid_list_display=rfid_list_display
                    }
                },
                dataObj:function() {
                    return {
                        id:$scope.detail.id,
                        handle_result:$scope.detail.handle_result,
                        handle_description:$scope.detail.handle_description
                    }
                }
            }
        });
        modalInstance.result.then(function(){
            $scope.refresh();
        });
    }
});

app.register.controller("warnHandlePopCtrl", function ($scope,$http,$uibModalInstance,baseUrl,dataObj,callbackFn) {
    $scope.params = dataObj;
    $scope.handle_results={};
    $http.get(baseUrl.getUrl()+'/api/1/common/choices/?key=eventlog').success(function(data){
        if(data.code==200){
            $scope.handle_results=data.data.handle_result;
        }
    });
    $scope.ok=function(){
        $http.put(baseUrl.getUrl()+'/api/1/eventlog/'+$scope.params.id+'/',$scope.params).success(function(data){
            if(callbackFn)callbackFn(data.data);
            $uibModalInstance.dismiss();
        });
    }
    $scope.cancel=function(){
        $uibModalInstance.dismiss();
    }
});