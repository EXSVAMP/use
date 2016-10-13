angular.module("Login", ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngDialog'])
require('login_router');

var app = angular.module('Login');

app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});

app.controller("MasterCtrl", function ($scope,$cookieStore) {
    var accountInfo = $cookieStore.get("iotcloud-token");
    if(accountInfo){
         window.location.href = "/#card";
    }
    window.onresize = function () {
        $scope.$apply();
    }
});

app.service("baseUrl",function(){
    var url="http://211.152.46.42:9011";

    return {
        getUrl:function(){
            return url;
        }
    }
})