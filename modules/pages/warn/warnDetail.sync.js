var app = angular.module('RDash');
app.register.controller("warnDetailCtrl", function ($scope, $http, params,$location,baseUrl,$uibModal,utils,popService) {
    utils.init($scope);
    var data = $location.search();
    $scope.refresh=function(){
        $http.get(baseUrl.getUrl()+'/api/1/eventlog/'+data.id+"/").success(function(data){
            if(data.code==200){
                $scope.detail = data.data;
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
    $scope.handleEvent = popService.handleEvent;
});