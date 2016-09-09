/**
 * Created by tangjianfeng on 16/6/14.
 */
"use strict"
var scope = ["$scope","$http","$timeout","$uibModal",'baseUrl', function($scope, $http, $timeout, $uibModal, baseUrl) {
    var BaseUrl = baseUrl.getUrl();
    $scope.register_success = -1;
    $scope.itemStyle = {
        left:"0"
    };
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
    $scope.active = 0;
    $scope.check_valid1 = function(){
        if($scope.information.username&&$scope.information.password&&$scope.information.re_password==$scope.information.password){
            $scope.itemStyle.left = "-480px";
            $timeout(function(){
                $scope.active = 1
            },400)
        }else{
            alert("信息有误！")
        }
    };
    $scope.goBack = function(index){
        $scope.itemStyle.left = "-"+(480*index)+"px";
        $scope.active = index
    };
    $scope.check_valid2 = function(){
        if($scope.information.name&&$scope.information.address&&$scope.information.connect_username&&$scope.information.connect_info){
            $scope.itemStyle.left = "-960px";
            $timeout(function(){
                $scope.active = 2
            },400);
            $http.post(BaseUrl+"/api/1/user/register/", $scope.information).success(function(data){
                if(data.code=="200"){
                    $scope.register_success = 1;
                    // window.location.href = "/"
                }else{
                    $scope.register_success = 0;
                    $scope.failureInfo=data.message;
                }
            }).error(function(data){
                $scope.register_success = 0;
            })
        }else{
            alert("信息填写不全！")
        }

    };
    $scope.re_register = function(){
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
        $scope.goBack(0)
    }
}];

return scope;
