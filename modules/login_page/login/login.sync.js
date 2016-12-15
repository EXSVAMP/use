var app = angular.module('RDash');
app.register.controller("loginCtr", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope) {
    var BaseUrl = baseUrl.getUrl();
    $scope.loginResponse = "";
    $scope.person = {
        username: "",
        password: ""
    };
    $scope.remember_account = false;
    var iotcloud_account = localStorage.getItem("iotcloud-account");
    if(iotcloud_account){
        $scope.remember_account = true;
        $scope.person.username = iotcloud_account;

    }
    var iotcloud_token=$cookieStore.get("iotcloud-token");
    if(iotcloud_token){
        window.location.href = "/index.html";
    }
    $scope.login=function(){
        $http.post(BaseUrl+"/api/1/user/login/",$scope.person).success(function(data){
             console.log(data);
             if(data.code=='200'){
                 $cookieStore.put("iotcloud-token",{
                     token: data.data.token
                 });
                 
                 sessionStorage.setItem("loginName",$scope.person.username);
                 // $cookieStore.put("passlen",$scope.person.password);
                 localStorage.setItem("storeMap",data.data.storehouse.storehouse_type);
                 localStorage.setItem("storeHouseId",data.data.storehouse.id);
                 if($scope.remember_account){
                    localStorage.setItem("iotcloud-account",$scope.person.username);
                 }else{
                    localStorage.removeItem("iotcloud-account");
                 }
                 window.location.href = "/index.html";

             }else{
                 $scope.showError = true;
                 $scope.loginResponse = data.message;
             }
         })
     }

})