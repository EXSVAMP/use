var app = angular.module('RDash');
app.register.controller("accountCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope,listService,params) {
	$scope.lastlogindate = "";
    $http.get(baseUrl.getUrl() + "/api/1/user/login/").success(function(data){
        if(data.code==200){
            var user = data.data;
            $scope.username = user.username;
            $scope.userrole = user.get_user_role_type_display;
            var is_active = user.is_active;
            if(is_active)
                is_active = "激活";
            else
                is_active = "未激活"; 
            $scope.active =  is_active;
            $scope.joindate = user.date_joined;
            $scope.lastlogindate = user.last_login;
        }
    }).error(function(data,state){
        if(state == 403){
            baseUrl.redirect()
        }
    });

})