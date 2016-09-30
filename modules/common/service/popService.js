var app = angular.module('RDash');
app.factory('popService', function ($uibModal) {
    var handleEvent = function(detail){
        $uibModal.open({
            controller: 'warnHandlePopCtrl',
            templateUrl: "statics/modules/pages/warn/warnHandlePop.html",
            size: 'md',
            resolve: {
                callbackFn:function(){
                    return function(data){
                        angular.merge(detail,data);
                        var rfid_list_display = '';
                        angular.forEach(detail.rfid_list,function(item){
                            if(rfid_list_display!=''){
                                rfid_list_display+=',';
                            }
                            rfid_list_display+=item.rfid_id;
                        });
                        detail.rfid_list_display=rfid_list_display
                    };
                },
                dataObj:function() {
                    return {
                        id:detail.id,
                        handle_result:detail.handle_result,
                        handle_description:detail.handle_description
                    }
                }
            }
        });
    }
    return {
        handleEvent:handleEvent
    }
});

app.controller("warnHandlePopCtrl", function ($scope,$http,$uibModalInstance,baseUrl,dataObj,callbackFn) {
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
        }) ;
    }
    $scope.cancel=function(){
        $uibModalInstance.dismiss();
    }
});