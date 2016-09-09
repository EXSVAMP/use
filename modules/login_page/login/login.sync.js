/**
 * Created by tangjianfeng on 16/5/18.
 */
"use strict"

var scope = ["$scope","$http","$location","$uibModal",'$cookieStore','baseUrl',"$rootScope", function($scope, $http,$location , $uibModal,$cookieStore, baseUrl,$rootScope) {
    var BaseUrl = baseUrl.getUrl();
    $scope.loginResponse = "";
    $scope.person = {
        username:"",
        password:""
    };
    $scope.login = function(){
        $http.post(BaseUrl+"/api/1/user/login/",$scope.person).success(function(data){

            if(data.code=='200'){

                $cookieStore.put("iotcloud-token", {
                    loginName: $scope.person.loginName,
                    token: data.data.token

                });
                localStorage.setItem("storeMap",data.data.storehouse.storehouse_type);
                // sessionStorage.setItem("id",data.data.id);
                window.location.href = "/";

            }else{

                $scope.showError = true;
                $scope.loginResponse = data.message
            }
        })
    };

    $scope.validateKey=function($event){
        if($event.keyCode==13){
            $scope.login();
        }

    }

}];
return scope;
