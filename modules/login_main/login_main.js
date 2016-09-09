angular.module('Login', ['ui.bootstrap', 'ui.router', 'ngCookies','ngDialog']);
require('login_router');



var app = angular.module('Login');

app.controller("MasterCtrl",function($scope){

    window.onresize = function () {
        $scope.$apply();
    };
});

app.config(function($httpProvider){
    $httpProvider.defaults.withCredentials = true;
});

app.service("baseUrl", function(){
    var url="http://211.152.46.42:9011";
    //var url="http://127.0.0.1:9002";
    //   var url="http://139.196.148.70:9002";
    //url = "http://192.168.20.45:8000";
    return {
        getUrl:function(){
            return url
        }
    }
});