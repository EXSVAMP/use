//"use strict"
//var scope = ["$scope","$http","$timeout","$uibModal",'baseUrl',"$interval", function($scope, $http, $timeout, $uibModal, baseUrl, $interval) {
var app = angular.module('Login');
app.register.controller("registerCtrl", function ($scope, $http, $location, $timeout, $interval, $uibModal, $cookieStore, baseUrl, $rootScope, ngDialog) {
    var BaseUrl = baseUrl.getUrl();
    $scope.regstep1 = "reg-step-i reg-step-i-active";
    $scope.regstep2 = "reg-step-i";
    $scope.regstep3 = "reg-step-i";
    $scope.regarrow1 = "/statics/lib/img/icon_arrow_32_32_01 copy.png";
    $scope.regarrow2 = "/statics/lib/img/icon_arrow_32_32_01.png";
    $scope.register_success = 1;
    $scope.register_ok = false;
    $scope.register_res = "抱歉，注册失败!";
    $scope.register_fail = false;
    $scope.countdown1 = 5;
    $scope.countdown2 = 5;
    $scope.information = {
        username:"",
        password:"",
        re_password:"",
        name:"",
        address:"",
        connect_username:"",
        connect_info:"",
        wms_id:""
    };
    console.log($scope.information.password);
    $scope.goNext = function(iNext){
        if(iNext == 2){
            var username = $scope.information.username;
            //console.log($scope.information.password);
            var userpass = $scope.information.password;
            var userre_pass = $scope.information.re_password;
            //console.log(username+","+userpass+","+userre_pass);
            if(username && userpass && userre_pass){
               //console.log(123);
                if(username.length>30){
                    // ngDialog.open({
                    //     template: '<p style=\"text-align: center\">用户名最长30位</p>',
                    //     plain: true
                    // });
                }else if(userpass.length<6 || userpass.length>20){
                    // ngDialog.open({
                    //     template: '<p style=\"text-align: center\">密码设为6-20位</p>',
                    //     plain: true
                    // });
                }else if(userre_pass != userpass){
                    // ngDialog.open({
                    //     template: '<p style=\"text-align: center\">确认密码与密码不一致</p>',
                    //     plain: true
                    // });
                }else{
                    $scope.register_success = 2;
                    $scope.regstep2 = "reg-step-i reg-step-i-active";
                    $scope.regarrow2 = "/statics/lib/img/icon_arrow_32_32_01 copy.png";
                }
                
            }
            // else
            //     ngDialog.open({
            //         template: '<p style=\"text-align: center\">用户名，密码，重复密码为必填项</p>',
            //         plain: true
            //     });
        }else if(iNext == 3){
            var name = $scope.information.name;
            var address = $scope.information.address;
            var connect_username = $scope.information.connect_username;
            var connect_info = $scope.information.connect_info;
            if(name && address && connect_username && connect_info){  
                $http.post(BaseUrl+"/api/1/user/register/", $scope.information).success(function(data){
                $scope.register_success = 3;
                $scope.regstep3 = "reg-step-i reg-step-i-active";
                if(data.code=="200"){
                    $scope.register_res = "恭喜你，注册成功!";
                    $scope.register_res_fail = "";
                    $scope.countdown1 = 5;
                    $scope.register_ok = true;
                    $scope.register_fail = false;
                    var toDo = function () {
                        $scope.countdown1--;
                        if($scope.countdown1 == 1){
                            window.location.href = "/login";
                        }
                    };
                    $interval(toDo, 1000, 5);
                }else{
                    $scope.register_res = data.message+"，注册失败!";
                    $scope.register_res_fail = "register_res_fail";
                    $scope.countdown2 = 5;
                    $scope.register_fail = true;
                    $scope.register_ok = false;
                    //$scope.failureInfo=data.message;
                    var toDo = function () {
                        $scope.countdown2--;
                        if($scope.countdown2 == 0){
                            $scope.register_success = 1;
                            $scope.regstep2 = "reg-step-i";
                            $scope.regarrow2 = "/statics/lib/img/icon_arrow_32_32_01.png";
                        }
                    };
                    $interval(toDo, 1000, 5);
                }
            }).error(function(data){
                $scope.register_res = data.message+"，注册失败!";
                $scope.register_res_fail = "register_res_fail";
                $scope.countdown2 = 5;
                $scope.register_fail = true;
                $scope.register_ok = false;
                //$scope.failureInfo=data.message;
                var toDo = function () {
                    $scope.countdown2--;
                    if($scope.countdown2 == 0){
                        $scope.register_success = 1;
                        $scope.regstep2 = "reg-step-i";
                        $scope.regarrow2 = "/statics/lib/img/icon_arrow_32_32_01.png";
                    }
                };
                $interval(toDo, 1000, 5);
            })
             }
            //else
            //     alert("信息填写不全！");
        }
    }

    $scope.goPre = function(iPre){
        if(iPre == 1){
            $scope.register_success = 1;
            $scope.regstep2 = "reg-step-i";
            $scope.regarrow2 = "/statics/lib/img/icon_arrow_32_32_01.png";
        }
    }
})
//}];
//return scope;