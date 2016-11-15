var app = angular.module('RDash');
app.register.controller("locationCtrl", function ($scope, $http, $timeout, $interval, $uibModal, baseUrl, $sce, $templateCache, $location, constant) {
    var BaseUrl = baseUrl.getUrl();

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    $scope.fullscreenObj = false;
    // $scope.sizeTemp=2;
    $scope.size = 1.0;
    $scope.dataList = {};
    // $scope.warnInfo="";
    var scale_ratio_width = 1;
    var scale_ratio_height = 1;
    //$scope.icon_icon_compress = "";
    $scope.fullScreenStatus = function () {
        return document.fullscreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen ||
            false;
    }

    $scope.openfull_body = function () {
        elem = document.getElementById("body_ele");
        if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.requestFullScreen) {
            elem.requestFullscreen();
        } else {
            //浏览器不支持全屏API或已被禁用
            ngDialog.open({
                template: '<p style=\"text-align: center\">浏览器不支持全屏API或已被禁用</p>',
                plain: true
            });
        }
    }


    $scope.zoomin = function () {
        $scope.size = $scope.size - 0.1;
        $scope.set();
    }
    $scope.set = function () {
        if ($scope.size >= 0.2 && $scope.size <= 2) {
            document.getElementById("location").style.cssText = document.getElementById("location").style.cssText + ';-webkit-transform:scale(' + $scope.size + ');-webkit-transform-origin:0 0;';
        }
        // var miniMap_cssText=$(".mgNavigator").css("cssText");
        // var  res=miniMap_cssText+';-webkit-transform:scale('+size+');-webkit-transform-origin:0 0;';
        // $(".mgNavigator").css("cssText",res);
        if ($scope.size == 1) {
            // $(".mgNavigator").show();
        }
        if ($scope.size < 0.5) {
            // $(".mgNavigator").hide();
        }
        // $scope.size=size;
    }

    $scope.zoomout = function () {
        $scope.size = $scope.size + 0.1;
        $scope.set();
    }


    $scope.closeFull = function () {
        $scope.fullscreenObj = false;
        $(".sideBar").show();
        $(".header_com").show();
        $("#page-wrapper").css("padding-left", "200px");
        $("#content-wrapper").css("padding-top", "48px");
        $("html").attr("style", "top:0;left:0;");
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

    $scope.openFull = function () {
        //console.log($("#location").width());
        //console.log($("#location").height());
        //console.log($("body").width());
        //console.log($("body").height());
        $scope.fullscreenObj = true;
        $(".sideBar").hide();
        $(".header_com").hide();
        $("#page-wrapper").css("padding-left", "0");
        $("#content-wrapper").css("padding-top", "0");
        $("html").css("background", "#f3f3f3");
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

    $scope.custom_open_close_full = function () {
        if ($scope.fullScreenStatus())
            $scope.openFull();
        else
            $scope.closeFull();
    }

    $(window).on('fullscreenchange', function () {
        $scope.custom_open_close_full();
    });

    $(window).on('mozfullscreenchange', function () {
        $scope.custom_open_close_full();
    });
    $(window).on('webkitfullscreenchange', function () {
        $scope.custom_open_close_full();
    });

    var getData = function () {
        $scope.myPromise = $http.get(BaseUrl + "/api/1/location/init/").success(function (data) {
            if ($(".mgNavigator").length > 0) {
                $(".mgNavigator").remove();
            }
            // if($scope.size==1){
            //     $(".mgNavigator").show();
            // }
            // if($scope.size<0.5){
            //     $(".mgNavigator").hide();
            // }

            if (data.code == 200) {
                $scope.dataList = data.data;
                $scope.firstDataArray = [];
                $scope.secondDataArray = [];

                // console.log($scope.dataList);


                // 判断警告框
                $scope.warn = function (list) {
                    var flag;
                    angular.forEach(list, function (value, key) {
                        // console.log("<=====>"+value.status);
                        if (value.status == 2) {
                            flag = true;
                            return flag;
                        }
                    })
                    return flag;
                }
                //地图保存错误状态
                $scope.errorState = function (obj, img) {
                    //有异常
                    if (img.status == 2) {
                        obj.error = 2;
                        return false;
                    } else if (img.status == 1) {
                        obj.unerror = 1;
                    }

                }
                $scope.info = function (list) {
                    var res = "";
                    for (var i = 0; i < list.length; i++) {
                        var status = list[i].status;
                        var name;
                        if (status == 2) {
                            //yi
                            name = list[i].name;
                            var des = "";
                            var eventsList = list[i].events;

                            for (var j = 0; j < eventsList.length; j++) {
                                des += "[编号:" + eventsList[j].id + "]" + "&nbsp;&nbsp;" + eventsList[j].event_datetime + "&nbsp;<br/>" + eventsList[j].description + "<br/><br/>";
                            }
                            res += name + ":" + "<br/>" + des;

                        }

                    }
                    // $scope.warnInfo=res;
                    return $sce.trustAsHtml(res);

                }

                //$(window).mgMiniMap({elements: '.board_1',liveScroll: true, draggable: true,debug:true,resizable:true});
                $(window).mgMiniMap({
                    elements: '.bor',
                    liveScroll: true,
                    draggable: true,
                    debug: true,
                    resizable: true
                });
                $(".mgNavigator").append("<div class='minimap-fullscreen' style='position: absolute;top: -60px;right: 0px;width:35px;height:35px;background:#000;text-align:center;cursor:pointer;'><span class='icon-icon_compress icon-icon_expand' id='icon_icon_expand' style='font-size: 32px;color: #fff;'></span></div>");

                $(".minimap-fullscreen").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if ($scope.fullscreenObj) {
                        $("#body_ele").fullScreen();
                        $scope.closeFull();
                    } else {
                        $scope.openfull_body();
                        $(window).mgMiniMap("update");
                        $scope.openFull();

                    }
                });
                // $scope.wsFunc3();

            } else {
                alert(data.message)
            }
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        });

    };
    getData();


    // window.setInterval(function(){
    //     getData();
    // },50000);

    $scope.warnShow = function (obj) {
        obj.warnflag = true;
    }
    $scope.warnhide = function (obj) {
        obj.warnflag = false;
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

    $scope.wsFunc3 = function () {
        // var url="139.196.148.70";
        // var testSocket=new WebSocket("211.152.46.42",8083);
        // testSocket.send("123");
        // testSocket.onopen=function (event) {
        //
        // }


        var websocket_url = constant.websocket_url;
        var websocket_userName = constant.websocket_userName;
        var websocket_password = constant.websocket_password;
        var websocket_port = constant.websocket_port;

        client = new Paho.MQTT.Client(constant.websocket_url, constant.websocket_port, "myclientid_" + parseInt(Math.random() * 100, 10));
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        //client.onSubscribeSuccess = onSubscribeSuccess;
        //client.onSubscribeFailure = onSubscribeFailure;

        // connect the client
        client.connect({
            onSuccess: onConnect,
            userName: constant.websocket_userName,
            password: constant.websocket_password,
            mqttVersion: 3
        });

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");

            var store_house_id = localStorage.getItem("storeHouseId");
            console.log("store_house_id:" + store_house_id);


            client.subscribe("exingcai/iot/clould/storehouse/" + store_house_id + "/eventlog/warning", {
                onSuccess: onSubscribeSuccess,
                onFailure: onSubscribeFailure
            });


            // message = new Paho.MQTT.Message("Hello");
            // message.destinationName = "/World";
            // client.send(message);
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            console.log("responseObject.errorCode:" + responseObject.errorCode);
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {

            console.log("onMessageArrived:" + message.payloadString);

            // var data_res={
            //     "pile_name": "0201",
            //     "status": "1",
            //     "content": {},
            //     "name": "0201D",
            //     "status_display": "无货",
            //     "id": 137,
            //     "events":
            //     {
            //         "id": 150,
            //         "event_type": "3",
            //         "event_type_display": "出库",
            //         "rfid_reader": 7,
            //         "camera": 6,
            //         "description": "[报警]读卡器:[编号:7][序列号:R0002];摄像头:[编号:6][序列号:192.168.11.3];监视到事件:出库;原因:异常出入库,入库监视的RFID不能合法出入库",
            //         "video_url": "",
            //         "photo_url": "",
            //         "event_feedback_type": "1",
            //         "event_feedback_type_display": "报警",
            //         "event_feedback_detail": "201",
            //         "event_feedback_detail_display": "异常出入库,入库监视的RFID不能合法出入库",
            //         "handle_result": "0",
            //         "handle_result_display": "未处理",
            //         "event_datetime": "2016-07-25T15:19:29",
            //         "camera_ip_address": "192.168.11.3",
            //         "rfid_reader_serializer": "R0002"
            //     }
            //
            // }
            // $scope.$broadcast("Update",data_res);

            try {
                var data_res = JSON.parse(message.payloadString)
            } catch (e) {
                return false;
            }
            angular.forEach($scope.dataList, function (itemsAll) {
                angular.forEach(itemsAll, function (items) {
                    angular.forEach(items, function (item) {
                        angular.forEach(item.goods_list, function (item_single) {
                            // var arry_temp=[];
                            // var event_temp=[];
                            if (item_single.name == data_res.name) {
                                item_single.events.unshift(data_res.events);
                                angular.merge(item_single, data_res);
                                //地图保存错误状态
                                if (item_single.status == 2) {
                                    item.error = 2;
                                    return false;
                                } else if (item_single.status == 1) {
                                    item.unerror = 1;
                                }
                            }
                        })
                    })
                })
            });
            $scope.$digest();
            $(".mgNavigator").remove();
            $(window).mgMiniMap({elements: '.bor', liveScroll: true, draggable: true, debug: true, resizable: true});
            $(".mgNavigator").append("<div class='minimap-fullscreen' style='position: absolute;top: -60px;right: 0px;width:35px;height:35px;background:#000;text-align:center;cursor:pointer;'><span class='icon-icon_compress icon-icon_expand' id='icon_icon_expand' style='font-size: 32px;color: #fff;'></span></div>");
            $(".minimap-fullscreen").click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                if ($scope.fullscreenObj) {
                    $("#body_ele").fullScreen();
                    $scope.closeFull();
                } else {
                    $scope.openfull_body();
                    $(window).mgMiniMap("update");
                    $scope.openFull();

                }
            });
            console.log(data_res);


            // console.log("<===$scope.dataList===>"+$scope.dataList);
        }

        function onSubscribeSuccess() {
            subscribed = true;
            console.log("subscribed", subscribed);
        };

        function onSubscribeFailure(err) {
            subscribed = false;
            console.log("subscribe fail. ErrorCode: %s, ErrorMsg: %s", err.errCode, err.errorMessage);
        };

    }

    $scope.wsFunc3();


})