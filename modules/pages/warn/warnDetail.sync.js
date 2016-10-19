var app = angular.module('RDash');
app.register.controller("warnDetailCtrl", function ($scope, $http, params,$location,baseUrl,$uibModal,utils,popService,listService) {
    utils.init($scope);
    var data = $location.search();
    $scope.container={};
    $("#detail-img-url").resize(function(){
        $scope.container.width=$("#detail-img-video").width();
        $scope.container.height=$("#detail-img-video").height();
    })
    $scope.refreshData=function(){
        $http.get(baseUrl.getUrl()+'/api/1/eventlog/'+data.id+"/").success(function(data){
            if(data.code==200){
                $scope.detail = data.data;
                $scope.detail.video_url= "http://o71xixzmn.bkt.clouddn.com/gz0120160616_172743_717000.flv";
                var rfid_list_display = '';
                angular.forEach($scope.detail.rfid_list,function(item){
                    if(rfid_list_display!=''){
                        rfid_list_display+=',';
                    }
                    rfid_list_display+=item.rfid_id;
                });
                $scope.detail.rfid_list_display=rfid_list_display;
                $("#container").empty();
                if($scope.tabSwitch==0){
                    $scope.container.width=$("#detail-img-url img").width();
                    $scope.container.height=$("#detail-img-url img").height();
                }
                var play=jwplayer ( "container" ). setup ({
                    autostart:true,
                    //flashplayer : "/statics/lib/player.swf" ,
                    flashplayer : "/statics/lib/jwplayer-7.7.1/jwplayer.flash.swf" ,
                    file : $scope.detail.video_url,
                    width: $scope.container.width ,
                    height:$scope.container.height,
                    dock: false,
                    primary: 'flash',
                    //repeat:true,
                    events: {
                        onComplete: function () {
                            console.log("播放结束!!!");
                        }
                    }

                });

            }
        });
    }
    $scope.refreshData();
    $scope.tabSwitch = 0;
    $scope.handleEvent = popService.handleEvent;
    listService.init($scope,'/api/1/eventhandlelog/',{isAdd:true,autoRefresh:true,listElement:'.record-list'});
    $scope.params.event_log_id =  data.id;
    $scope.listCallback=function(data){
        // $scope.dataList=$scope.dataList.concat([{},{},{},{},{},{},{},{},{},{}]);
        $scope.dataList=data.data;
    };
    $scope.refresh();
});