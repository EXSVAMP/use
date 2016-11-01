var app = angular.module('RDash');
app.register.controller("locationCtrl", function ($scope, $http, $timeout, $interval, $uibModal,baseUrl,$sce,$templateCache,$location) {
    var BaseUrl = baseUrl.getUrl();
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    $scope.fullscreenObj = false
    // $scope.warnInfo="";
    var scale_ratio_width = 1;
    var scale_ratio_height = 1;
    //$scope.icon_icon_compress = "";
    $scope.fullScreenStatus = function(){
        return document.fullscreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen ||
                false;
    }

    $scope.openfull_body = function(){
        elem=document.getElementById("body_ele");
        if(elem.webkitRequestFullScreen){
            elem.webkitRequestFullScreen();
        }else if(elem.mozRequestFullScreen){
            elem.mozRequestFullScreen();
        }else if(elem.requestFullScreen){
            elem.requestFullscreen();
        }else{
            //浏览器不支持全屏API或已被禁用
            ngDialog.open({
                template: '<p style=\"text-align: center\">浏览器不支持全屏API或已被禁用</p>',
                plain: true
            });
        }
    }

    $scope.closeFull = function(){
        $scope.fullscreenObj = false;
        $(".sideBar").show();
        $(".header_com").show();
        $("#page-wrapper").css("padding-left","200px");
        $("#content-wrapper").css("padding-top","48px");
        $("html").attr("style","top:0;left:0;");
        //$scope.icon_icon_compress = "";
        $("#icon_icon_expand").addClass("icon-icon_expand");

         //new alter
        // $("#contain").width(3990);
        // $("#contain").height(4235);

        // $(".ungoods").width(500);
        // $(".ungoods").height(900);

        // $(".ungoods span").css("left","");
        // $(".ungoods span").css("top",ungoods_span_t+"%");
    }

    $scope.openFull = function(){
        //console.log($("#location").width());
        //console.log($("#location").height());
        //console.log($("body").width());
        //console.log($("body").height());
        $scope.fullscreenObj = true;
        $(".sideBar").hide();
        $(".header_com").hide();
        $("#page-wrapper").css("padding-left","0");
        $("#content-wrapper").css("padding-top","0");
        $("html").css("background","#f3f3f3");
        //$scope.icon_icon_compress = "icon-icon_compress";
        $("#icon_icon_expand").removeClass("icon-icon_expand");

        //new alter
        //$("#contain").width("100%");
        //$("#contain").height("100%");

        // var containW = 3990;
        // var containH = 4235;

        // var ungoodsW = 500/containW;
        // var ungoodsH = 900/containH;
        // $(".ungoods").width(ungoodsW+"%");
        // $(".ungoods").height(ungoodsH+"%");

        // var ungoods_span_l = 250/500;
        // var ungoods_span_t = 650/900;
        // $(".ungoods span").css("left",ungoods_span_l+"%");
        // $(".ungoods span").css("top",ungoods_span_t+"%");        

    }

     $scope.custom_open_close_full = function(){
        if($scope.fullScreenStatus())
            $scope.openFull();
        else
            $scope.closeFull();
     }

     $(window).on( 'fullscreenchange',function(){
        $scope.custom_open_close_full();
     });

     $(window).on( 'mozfullscreenchange',function(){
        $scope.custom_open_close_full();
     });
     $(window).on( 'webkitfullscreenchange',function(){
        $scope.custom_open_close_full();
     });

    var getData=function(){
        $scope.myPromise=$http.get(BaseUrl + "/api/1/location/init/").success(function(data){
            if($(".mgNavigator").length>0){
                $(".mgNavigator").remove();
            }

            if(data.code==200){
                $scope.dataList = data.data;
                $scope.firstDataArray=[];
                $scope.secondDataArray=[];

                // console.log($scope.dataList);

                // 判断警告框
                $scope.warn=function(list){
                    var flag;
                    angular.forEach(list,function(value,key){
                        // console.log("<=====>"+value.status);
                        if(value.status==2){
                            flag=true;
                            return flag;
                        }
                    })
                    return flag;
                }

                $scope.info=function(list){
                    var  res="";
                    for(var i=0;i<list.length;i++){
                        var status=list[i].status;
                        var name;
                        if(status==2){
                            //yi
                            name=list[i].name;
                            var des="";
                            var eventsList=list[i].events;

                            for(var j=0;j<eventsList.length;j++){
                                des+="[编号:"+eventsList[j].id+"]"+"&nbsp;&nbsp;"+eventsList[j].event_datetime+"&nbsp;<br/>"+eventsList[j].description+"<br/><br/>";
                            }
                            res+=name+":"+"<br/>"+des;

                        }

                    }
                    // $scope.warnInfo=res;
                    return $sce.trustAsHtml(res);

                }

                //$(window).mgMiniMap({elements: '.board_1',liveScroll: true, draggable: true,debug:true,resizable:true});
                $(window).mgMiniMap({elements: '.board_1',liveScroll: true, draggable: true,debug:true,resizable:true});
                $(".mgNavigator").append("<div class='minimap-fullscreen' style='position: absolute;top: -60px;right: 0px;width:35px;height:35px;background:#000;text-align:center;cursor:pointer;'><span class='icon-icon_compress icon-icon_expand' id='icon_icon_expand' style='font-size: 32px;color: #fff;'></span></div>");
               
                $(".minimap-fullscreen").click(function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    if($scope.fullscreenObj){
                        $("#body_ele").fullScreen();
                         $scope.closeFull();
                    }else{
                        $scope.openfull_body();
                        $(window).mgMiniMap("update");
                         $scope.openFull();
                        
                    }
                }); 

            }else{
                alert(data.message)
            }
        }).error(function(data,state){
            if(state == 403){
                baseUrl.redirect()
            }
        });

    };
    getData();


    // window.setInterval(function(){
    //     getData();
    // },30000);

    $scope.warnShow=function(obj){
        obj.warnflag=true;
    }
    $scope.warnhide=function(obj){
        obj.warnflag=false;
    }
    //
    // $scope.openfull=function(){
    //     elem=document.getElementById("location");
    //     if(elem.webkitRequestFullScreen){
    //         elem.webkitRequestFullScreen();
    //     }else if(elem.mozRequestFullScreen){
    //         elem.mozRequestFullScreen();
    //     }else if(elem.requestFullScreen){
    //         elem.requestFullscreen();
    //     }else{
    //         //浏览器不支持全屏API或已被禁用
    //     }
    // }

    $scope.wsFunc3 = function(){
        // var url="139.196.148.70";
        // var testSocket=new WebSocket("211.152.46.42",8083);
        // testSocket.send("123");
        // testSocket.onopen=function (event) {
        //
        // }
        client = new Paho.MQTT.Client("211.152.46.42", 8083,"myclientid_" + parseInt(Math.random() * 100, 10));
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        //client.onSubscribeSuccess = onSubscribeSuccess;
        //client.onSubscribeFailure = onSubscribeFailure;

        // connect the client
        client.connect({onSuccess:onConnect, userName: "iotweb", password: "123qwe!@#", mqttVersion: 3});

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");

            var store_house_id = localStorage.getItem("storeHouseId");
            console.log("store_house_id:"+store_house_id);

            client.subscribe("exingcai/iot/clould/"+store_house_id+"/eventlog/warning", {onSuccess:onSubscribeSuccess,onFailure:onSubscribeFailure});

            // message = new Paho.MQTT.Message("Hello");
            // message.destinationName = "/World";
            // client.send(message);
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            console.log("responseObject.errorCode:"+responseObject.errorCode);
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {
            console.log("onMessageArrived:"+message.payloadString);
            console.log(message);
            var data=JSON.parse(message.payloadString)
            var rfid_list=data.rfid_list;
            var event_feedback_detail_display=data.event_feedback_detail_display;

            console.log(data);
        }

        function onSubscribeSuccess() {
            subscribed = true;
            console.log("subscribed",subscribed);
        };

        function onSubscribeFailure(err) {
            subscribed = false;
            console.log("subscribe fail. ErrorCode: %s, ErrorMsg: %s",err.errCode,err.errorMessage);
        };

    }
    $scope.wsFunc3();
})