var app = angular.module('Login');
app.register.controller("loginCtr", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope) {
    var BaseUrl = baseUrl.getUrl();
    $scope.loginResponse = "";
    $scope.person = {
        username: "",
        password: ""
    };
     $scope.login=function(){
         $http.post(BaseUrl+"/api/1/user/login/",$scope.person).success(function(data){
             console.log(data);
             if(data.code=='200'){
                 $cookieStore.put("iotcloud-token",{
                     loginName: $scope.person.loginName,
                     token: data.data.token
                 });
                 localStorage.setItem("storeMap",data.data.storehouse.storehouse_type);
                 window.location.href = "/";

             }else{
                 $scope.showError = true;
                 $scope.loginResponse = data.message;
             }
         })
     }

})