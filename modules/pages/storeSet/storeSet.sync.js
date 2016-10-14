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
    $scope.searchStore();

   //$scope.startcopy=function(obj){

        // var swfPath = ZeroClipboard.config("swfPath");
        // ZeroClipboard.clearData();
        // var client = new ZeroClipboard( document.getElementById("wms") );
        // console.log("<====@@@===>"+swfPath);
        // client.clearData("text/plain");
        // client.on("ready",function(event){
        //     console.log("<====复制开启1===>");
        //     //client.on("copy",function(event){
        //       console.log(client);
        //         client.on("copy",function(event){
        //        console.log("<====复制过程====>");
        //         event.clipboardData.setData("text/plain","dddddddbbb");
        //     });
        //     client.on( 'aftercopy', function(event) {
        //         console.log('Copied text to clipboard: ' + event.data['text/plain']);
        //     } );


        // });
      $scope.text="烟光凝而暮山紫";
        $('#wms').zclip({
        path: '/statics/lib/zclip/ZeroClipboard.swf',
        copy: function(e){//复制内容
            console.log("77777777");
            //return $('#ticket').text();
            return $scope.text;
        },
        afterCopy: function(e){//复制成功
            //$("<span id='msg'/>").insertAfter($('#copy_input')).text('复制成功');
            console.log("复制cheng g");
             ngDialog.open({
                    template: '<p style=\"text-align: center\">复制'+$scope.text+'</p>',
                    plain: true
                });
        
        }
    });
        
   //}





})