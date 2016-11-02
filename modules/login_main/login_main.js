angular.module("RDash", ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngDialog'])
require('login_router');
require('common/constant');
var app = angular.module('RDash');

app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});

app.controller("MasterCtrl", function ($scope,$cookieStore) {
    var accountInfo = $cookieStore.get("iotcloud-token");
    if(accountInfo){
         window.location.href = "/#statistics";
    }
    window.onresize = function () {
        $scope.$apply();
    }
});

app.service("baseUrl",function(constant){
    var url=constant.url;
     // var url="http://172.16.83.149:9011";
    return {
        getUrl:function(){
            return url;
        }
    }
})