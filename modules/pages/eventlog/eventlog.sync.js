var app = angular.module('RDash');
app.register.controller("eventlogCtrl", function ($scope, $http, $timeout,$location,baseUrl,listService,params) {
    $scope.numbers = [10,20,30,40,50];
    $scope.selections={};
    $scope.selections.event_type={"-1":'--------'};
    $scope.selections.event_feedback_type={"-1":'--------'};
    $scope.selections.handle_result={"-1":'--------'};
    $http.get(baseUrl.getUrl()+'/api/1/common/choices/?key=eventlog').success(function(data){
        if(data.code==200){
            angular.merge($scope.selections,data.data);

        }
    });

    console.log($scope.selections)
    
    
    
    





    listService.init($scope,'/api/1/eventlog/');





});