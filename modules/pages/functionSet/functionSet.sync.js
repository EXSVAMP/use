var app = angular.module('RDash');
app.register.controller("functionSetCtrl", function ($scope, $http, $timeout,$location,baseUrl,listService,global,utils,popService) {
    $scope.item={};
    $scope.item.checked=false;
     $scope.change=function(){
         alert("123");
     }
    $scope.selections=['警报1','警报2','警报3','警报4'];
});
