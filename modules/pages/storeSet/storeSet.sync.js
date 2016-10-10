var app = angular.module('RDash');
app.register.controller("storeSetCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope,url_junction,listService,params) {
    var urlBase = baseUrl.getUrl();
    $scope.params={}



    $scope.searchStore=function(){
        $http.get(urlBase+"/api/1/storehouse/self/").success(function(data){
            if(data.code==200){
                var data=data.data;
                $scope.params.name=data.name;
                $scope.params.address=data.address;
                $scope.params.connect_username=data.connect_username;
                $scope.params.connect_info=data.connect_info;
            }
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        })
    }
    
    $scope.open = function (size, method, index) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalStore',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if (method == "edit") {
                        return {
                            title: "仓库设置修改",
                            method: "edit",
                            status_disable: true,
                            scope: $scope
                            //data:
                        }
                    }
                }

            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    $scope.searchStore();

})