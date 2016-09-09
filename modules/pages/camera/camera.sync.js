/**
 * Created by tangjianfeng on 16/5/18.
 */
"use strict"
var scope = ["$scope","$http","$uibModal", "baseUrl","url_junction", function($scope, $http,$uibModal, baseUrl,url_junction) {
    var urlBase = baseUrl.getUrl();
    $scope.choice = {};
    $scope.func_type = "-1";
    $scope.status = "-1";
    $scope.description = "";
    $scope.storage_names = "";
    $scope.query_result = {};
    $scope.open_hls_storage="";
    $http.get(urlBase + "/api/1/common/choices/?key=camera").success(function(data){
        if(data.code==200){
            $scope.choice["func_type"] = data.data.func_type;
            $scope.choice["status"] = data.data.status;
        }else{
            // alert(data);
        }
    }).error(function(data,state){
        if(state == 403){
            baseUrl.redirect()
        }
    });
    $scope.order={
        id:false,
        serial_number:false,
        func_type:false,
        status:false,
        'updated_at':false,
        'created_at':false
    };
    $scope.switch_order = function(key){
        $scope.order[key] = !$scope.order[key];
        $scope.submit_search()
    };
    //
    $scope.setPage = function (pageNo){
        $scope.submit_search();
    };
    $scope.changePage = function(a){
        $scope.submit_search();
    };
    $scope.number = '10';
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    //
    $scope.submit_search = function(){
        var order_str = "";
        for(var i in $scope.order){
            if($scope.order[i]){
                if(order_str){
                    order_str += ','+i
                }else{
                    order_str += i;
                }
            }
        };
        $http.get(urlBase + "/api/1/camera/"+ url_junction.getQuery({
                func_type:$scope.func_type,
                status:$scope.status,
                description:$scope.description,
                storage_names:$scope.storage_names,
                descent:order_str,
                index:$scope.bigCurrentPage,
                number:$scope.number
            })).success(function(data){
            if(data.code==200){
                $scope.query_result = data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;


            }else{
                console.log(data)
            }
        }).error(function(data,state){
            if(state == 403){
                baseUrl.redirect()
            }
        })
    };
    $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalCamera',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if(method=="delete"){
                        return {
                            text:"确认删除这条记录？",
                            method:"delete",
                            data:$scope.query_result[index],
                            scope:$scope
                        }
                    }else if(method=="add"){
                        return {
                            title:"增加一条记录",
                            method:"add",
                            status_disable:true,
                            choice:$scope.choice,  //
                            scope:$scope
                            //data:
                        }
                    }else{
                        return {
                            title:"修改记录",
                            method:"modify",
                            status_disable:false,
                            data:$scope.query_result[index],  //
                            choice:$scope.choice, //
                            scope:$scope
                        }
                    }
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function(){});
    };
    $scope.submit_search();
    $scope.live=function(appId,storage_list){

        $scope.open_hls_storage=storage_list[0];
        console.log($scope.open_hls_storage);
        $http.post(urlBase+"/api/2/livecontrol/tostorage/"+$scope.open_hls_storage+"/").success(function(dtata){
             console.log("<=======开流成功====>");
        }).error(function(){

        })
        $scope.liveStatus=true;
        $("#play").empty();
        var appId =appId;

        var objectPlayer=new mpsPlayer({
            container:'play',//播放器容器ID，必要参数
            uin: '21884',//用户ID
            appId: appId,//播放实例ID
            width: '500',//播放器宽度，可用数字、百分比等
            height: '400',//播放器高度，可用数字、百分比等
            autostart: true,//是否自动播放，默认为false
            controlbardisplay: 'enable',//是否显示控制栏，值为：disable、enable默认为disable。
            isclickplay: false,//是否单击播放，默认为false
            isfullscreen: true//是否双击全屏，默认为true
        });
        // /* rtmpUrl与hlsUrl同时存在时播放器优先加载rtmp*/
        // /* 以下为Aodian Player支持的事件 */
        // /* objectPlayer.startPlay();//播放 */
        // /* objectPlayer.pausePlay();//暂停 */
        // /* objectPlayer.stopPlay();//停止 hls不支持*/
        // /* objectPlayer.closeConnect();//断开连接 */
        // /* objectPlayer.setMute(true);//静音或恢复音量，参数为true|false */
        // /* objectPlayer.setVolume(volume);//设置音量，参数为0-100数字 */
        // /* objectPlayer.setFullScreenMode(1);//设置全屏模式,1代表按比例撑满至全屏,2代表铺满全屏,3代表视频原始大小,默认值为1。手机不支持 */


    };
    $scope.close=function () {
        $scope.liveStatus=false;
        //闭流
        $http.post(urlBase+"/api/2/livecontrol/closestorage/"+$scope.open_hls_storage+"/").success(function(dtata){
                console.log("<=======闭流成功====>"+$scope.open_hls_storage);
        }).error(function(){
           alert("有点错误");
        })

    };

}]
return scope