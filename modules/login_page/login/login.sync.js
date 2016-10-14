var app = angular.module('Login');
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
     $scope.login=function(){
        $http.post(BaseUrl+"/api/1/user/login/",$scope.person).success(function(data){
             console.log(data);
             if(data.code=='200'){
                 $cookieStore.put("iotcloud-token",{
                     loginName: $scope.person.username,
                     token: data.data.token
                 });
                 $cookieStore.put("passlen",$scope.person.password);
                 localStorage.setItem("storeMap",data.data.storehouse.storehouse_type);
                 if($scope.remember_account){
                    localStorage.setItem("iotcloud-account",$scope.person.username);
                 }else{
                    localStorage.removeItem("iotcloud-account");
                 }
                 window.location.href = "/";

             }else{
                 $scope.showError = true;
                 $scope.loginResponse = data.message;
             }
         })
     }

})