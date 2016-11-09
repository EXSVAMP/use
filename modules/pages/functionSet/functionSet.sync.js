var app = angular.module('RDash');
app.register.controller("functionSetCtrl", function ($scope, $http, $timeout,$location,baseUrl,listService,global,utils,popService) {
    var urlBase = baseUrl.getUrl();

    $scope.item={};
    $scope.item.checked=true;
     $scope.change=function(){
         alert("123");
     }
    $scope.selections=['警报1','警报2','警报3','警报4'];
    $scope.search_common=function(){
        $http.get(urlBase+"/api/2/func/mainset").success(function(data){
            $scope.dataList_common=data.data;
            angular.forEach($scope.dataList_common,function(item){
                if(item.status==0){
                    item.checked=true;
                }
                if(item.status==1){
                    item.checked=false;
                }
            })

        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        });
    }



    $scope.setCommon=function(main_event,state){
        $scope.main_event=main_event;
        if(state==false){
            $scope.status="1";
        }
        if(state==true){
            $scope.status="0";
        }
       $http.post(urlBase+"/api/2/func/mainset",{"main_event":$scope.main_event,"status":$scope.status}).success(function(data){
           $scope.search_common();
       }).error(function (data, state) {
           if (state == 403) {
               baseUrl.redirect()
           }
       });
    }
    $scope.search_common();

});
