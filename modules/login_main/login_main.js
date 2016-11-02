angular.module("Login", ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngDialog'])
require('login_router');

var app = angular.module('Login');

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

app.service("baseUrl",function(){
    var url="http://139.196.148.70:9011";
     // var url="http://172.16.83.149:9011";
    return {
        getUrl:function(){
            return url;
        }
    }
})