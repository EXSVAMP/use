var app = angular.module('RDash');
app.register.controller("storeSetCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope,url_junction,listService,params,ngDialog) {
    var urlBase = baseUrl.getUrl();
    $scope.params={};
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
    $scope.wmsInfo=function(){
        $http.get(urlBase+"/api/1/storehouse/reset/wms/").success(function(data){
            if(data.code==200){
                var data=data.data;
                $scope.wms_token=data.token;
            }
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        });
    };

    $scope.boxInfo=function(){
        $http.get(urlBase+"/api/1/storehouse/reset/box/").success(function(data){
            if(data.code==200){
                var data=data.data;
                $scope.box_token=data.token;
            }
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        })
    }
    $scope.searchStore();
    $scope.wmsInfo();
    $scope.boxInfo();


    $('#wms').zclip({
        path: '/statics/lib/zclip/ZeroClipboard.swf',
        copy: function(e){//复制内容
            //return $('#ticket').text();
            return $scope.wms_token;
        },
        afterCopy: function(e){//复制成功
            ngDialog.open({
                template: '<p style=\"text-align: center\">wms票据复制成功</p>',
                plain: true
            });

        }
    });
    $('#box').zclip({
        path: '/statics/lib/zclip/ZeroClipboard.swf',
        copy: function(e){//复制内容
            //return $('#ticket').text();
            return $scope.box_token;
        },
        afterCopy: function(e){//复制成功
            ngDialog.open({
                template: '<p style=\"text-align: center\">盒子票据复制成功</p>',
                plain: true
            });

        }
    });

    $scope.reset=function(obj){
        if(obj==0){
            $http.post(urlBase+'/api/1/storehouse/reset/wms/').success(function(data){
                if(data.code==200){
                    $scope.wmsInfo();
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">wms票据重置成功</p>',
                        plain: true
                    });
                }
            })
        };
        if(obj==1){
            $http.post(urlBase+'/api/1/storehouse/reset/box/').success(function(data){
                if(data.code==200){
                    $scope.boxInfo();
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">盒子票据重置成功</p>',
                        plain: true
                    });
                }
            })
        }

    }

   $scope.set=function(obj){
       if(obj=="wms"){
           $scope.set_active="set_active";
       }
       if(obj=="box"){
           $scope.set_active1="set_active1";
       }
    }
    $scope.set_reset=function(obj){
        if(obj=="wms"){
            $scope.set_active="";
        }
        if(obj=="box"){
            $scope.set_active1="";
        }
    }
 
})