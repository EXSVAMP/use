var app = angular.module('RDash');
app.register.controller("eventlogCtrl", function ($scope, $http, $timeout,$location,baseUrl,listService,global,utils,popService) {
    $scope.selections={};
    $scope.camera=[];
    $scope.reader=[];
    $scope.selections.event_type={"-1":'--------'};
    $scope.selections.event_feedback_type={"-1":'--------'};
    $scope.selections.handle_result={"-1":'--------'};
    $scope.selections.numbers=global.pageNumSelections;
    $scope.currentIndex = 0;
    utils.init($scope);
    listService.init($scope,'/api/1/eventlog/');
    $scope.listCallback=function(data){
        $scope.currentIndex=0;
        if(data.data.length>0)$scope.showDetail($scope.currentIndex);
    };
    $scope.refresh();

    $scope.tabSwitch = 0;
    $scope.detail={};

    $http.get(baseUrl.getUrl()+'/api/1/common/choices/?key=eventlog').success(function(data){
        if(data.code==200){
            angular.merge($scope.selections,data.data);
        }
    });
    $http.get(baseUrl.getUrl()+"/api/1/camera/").success(function(data){
        if(data.code==200){
          $scope.camera=data.data;
            $scope.camera.push({id: '-1', serial_number: '-------------'});

        }
    });
    $http.get(baseUrl.getUrl()+"/api/1/reader/").success(function(data){
        if(data.code==200){
            $scope.reader=data.data;
            $scope.reader.push({id: '-1', serial_number: '-------------'});

        }
    });
    $scope.showDetail=function(index){
        $scope.currentIndex=index;
        $scope.detail.id=$scope.dataList[index].id;
        $http.get(baseUrl.getUrl()+'/api/1/eventlog/'+ $scope.detail.id+"/").success(function(data){
            if(data.code==200){
                $scope.detail = data.data;
                $scope.detail.video_url= "http://o71xixzmn.bkt.clouddn.com/gz0120160616_172743_717000.flv";
                // $scope.detail.img2='http://img0.imgtn.bdimg.com/it/u=3761389663,2619900045&fm=11&gp=0.jpg';
                var rfid_list_display = '';
                angular.forEach($scope.detail.rfid_list,function(item){
                    if(rfid_list_display!=''){
                        rfid_list_display+=',';
                    }
                    rfid_list_display+=item.rfid_id;
                });
                $scope.detail.rfid_list_display=rfid_list_display;
                // var width=$(".detail-img1").width();
                // var height=$(".detail-img1").height();
                $("#container").empty();
                var play=jwplayer ( "container" ). setup ({
                    autostart:true,
                    //flashplayer : "/statics/lib/player.swf" ,
                    flashplayer : "/statics/lib/jwplayer-7.7.1/jwplayer.flash.swf" ,
                    file : $scope.detail.video_url,
                    width :810  ,
                    height:500 ,
                    dock: false,
                    primary: 'flash',
                    //repeat:true,
                    events: {
                        onComplete: function () {
                            console.log("播放结束!!!");
                        }
                        // onVolume: function () { console.log("声音大小改变!!!"); },
                        //  onReady: function () { console.log("准备就绪!!!"); },
                        //  onPlay: function () { console.log("开始播放!!!"); },
                        // onPause: function () { console.log("暂停!!!"); },
                        // onBufferChange: function () { console.log("缓冲改变!!!"); },
                        //  onBufferFull: function () { console.log("视频缓冲完成!!!"); },
                        //  onError: function (obj) { console.log("播放器出错!!!" + obj.message); },
                        //  onFullscreen: function (obj) { if (obj.fullscreen) { console.log("全屏"); } else { console.log("非全屏"); } },
                        //  onMute: function (obj) { console.log("静音/取消静音") }
                    }


                });
            }
        });
    }
    $scope.handleEvent = popService.handleEvent;
});