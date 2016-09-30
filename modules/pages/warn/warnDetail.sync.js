var app = angular.module('RDash');
app.register.controller("warnDetailCtrl", function ($scope, $http, params,$location,baseUrl,$uibModal,utils,popService,listService) {
    utils.init($scope);
    var data = $location.search();
    $scope.refreshData=function(){
        $http.get(baseUrl.getUrl()+'/api/1/eventlog/'+data.id+"/").success(function(data){
            if(data.code==200){
                $scope.detail = data.data;
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
    $scope.refreshData();
    $scope.tabSwitch = 0;
    $scope.handleEvent = popService.handleEvent;
    listService.init($scope,'/api/1/eventhandlelog/',{isAdd:true,autoRefresh:true,listElement:'.record-list'});
    $scope.params.event_log_id =  data.id;
    $scope.listCallback=function(data){
        $scope.dataList=$scope.dataList.concat([{},{},{},{},{},{},{},{},{},{}]);
    };
    $scope.refresh();
});