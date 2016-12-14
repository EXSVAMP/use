var app = angular.module('RDash');
app.register.controller("cameraCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, url_junction, PageHandle) {
    var urlBase = baseUrl.getUrl();


    $scope.status = "-1";
    $scope.func_type = "-1";
    $scope.description = "";
    $scope.storage_names = "";
    // $scope.choice = {};
    $scope.query_result = {};
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];

    $scope.state={};
    $scope.functype={};

    $http.get(urlBase + "/api/1/common/choices/?key=camera").success(function (data) {
        $scope.func_type_Items = [];
        $scope.status_Items = [];
        if (data.code == 200) {

            var dataTemp1 = data.data.func_type;
            var dataTemp2 = data.data.status;
            //功能类型
            $scope.func_type_Items.push({state: '-1', name: '-------------'});
            $scope.status_Items.push({state: '-1', name: '-------------'});
            for (dataItem in dataTemp1) {

                $scope.func_type_Items.push({state: dataItem, name: dataTemp1[dataItem]});
            }
            ;
            //摄像头状态
            for (dataItem in dataTemp2) {
                $scope.status_Items.push({state: dataItem, name: dataTemp2[dataItem]});
            }
            ;

        } else {
            // alert(data);
        }
    }).error(function (data, state) {
        if (state == 403) {
            baseUrl.redirect()
        }
    });

    $scope.select_func_type = function (functype) {
        $scope.func_type = functype;
    }
    $scope.select_status = function (state) {
        $scope.status = state;
    }
    $scope.setShowNum = function (number) {
        $scope.number = number;
        $scope.submit_search();
    }

    //排序
    $scope.order = {
        id: true,
        serial_number: false,
        func_type: false,
        status: false,
        'updated_at': false,
        'created_at': false
    };

    $scope.switch_order = function (key) {
        $scope.order[key] = !$scope.order[key];
        for(var i in $scope.order){
            if(i!==key){
                $scope.order[i]=false;
            }
        }
        $scope.submit_search();
    };


    $scope.submit_search = function () {
        // console.log("<==功能类型==>" + $scope.func_type)
        // console.log("<==摄像头状态==>" + $scope.status);

        var order_str = "";
        for (var i in $scope.order) {
            if ($scope.order[i]) {
                if (order_str) {
                    order_str += ',' + i
                } else {
                    order_str += i;
                }
            }
        }

        $http.get(urlBase + "/api/1/camera/" + url_junction.getQuery({
                func_type: $scope.func_type,
                status: $scope.status,
                description: $scope.description,
                storage_names: $scope.storage_names,
                descent: order_str,
                index: $scope.bigCurrentPage,
                number: $scope.number

            })).success(function (data) {
            if (data.code == 200) {
                $scope.query_result = data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;
                $scope.total_page = data.pageinfo.total_page;
                $scope.currentPageTotal = $scope.query_result.length;
                if ($scope.currentPageTotal > 0) {
                    $scope.notFound = false;
                } else {
                    $scope.notFound = true;
                }


            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        })

    };
    $scope.changePage = function () {
        $scope.submit_search();
    }

    $scope.submit_search();
    $scope.open = function (size, method, index) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalCamera',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if (method == "add") {
                        return {
                            title: "新增摄像头信息",
                            method: "add",
                            status_disable: true,
                            scope: $scope
                            //data:
                        }
                    } else if (method == "modify") {
                        return {
                            title: "修改摄像头信息",
                            method: "modify",
                            status_disable: true,
                            data: $scope.query_result[index],
                            scope: $scope
                        }
                    } else if (method == "delete") {
                        return {
                            title: "删除摄像头信息",
                            method: "delete",
                            data: $scope.query_result[index],
                            scope: $scope
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
    $scope.setPage = function (pageNo) {
        if (PageHandle.setPageInput($scope.index_sel, $scope.total_page)) {
            $scope.bigCurrentPage = $scope.index_sel;
            $scope.index_sel = "";
            $scope.submit_search();
        } else
            $scope.index_sel = "";
    };
    //MQTT客户端变量
    var client;
    var timer_beat;
    $scope.live = function (appId, storage_list, ip_address) {
        $scope.ipAddress = ip_address;
        $scope.open_hls_storage = storage_list[0];
        console.log($scope.open_hls_storage);
        $http.post(urlBase + "/api/2/livecontrol/tostorage/" + $scope.open_hls_storage + "/").success(function (dtata) {
            console.log("<=======开流成功====>");
        }).error(function () {

        })
        $scope.liveStatus = true;
        $("#play").empty();
        var appId = appId;


        var objectPlayer = new mpsPlayer({
            container: 'play',//播放器容器ID，必要参数
            uin: '21884',//用户ID
            appId: appId,//播放实例ID
            width: '500',//播放器宽度，可用数字、百分比等
            height: '400',//播放器高度，可用数字、百分比等
            autostart: true,//是否自动播放，默认为false
            controlbardisplay: 'enable',//是否显示控制栏，值为：disable、enable默认为disable。
            isclickplay: false,//是否单击播放，默认为false
            isfullscreen: true//是否双击全屏，默认为true
        });

        //登陆到MQTT的密钥 以后希望从该系统中分发获取
        var pub = "camera";
        var sub = "123qwe";
        //订阅的主题；需要GetKey()计算
        var topic = "exingcai/iot/camera/"
        //标志位：标记是否已经进行初始化
        var initDone = 0;
        //标志位：用来表示是否需要打开定时器发送心跳包
        var setTimer = true;
        //定时发送心跳包的定时器变量

        //计算订阅主题的函数
        function GetKey() {
            if (appId == null) {
                setTimer = false;
                return;
            }
            if (appId.indexOf("GZ") >= 0) {
                topic = topic + "IOTGZ";
            }
            else if (appId.indexOf("YT") >= 0) {
                topic = topic + "IOTYT"

            }
            else if (appId.indexOf("iot") >= 0) {

                topic = topic + "IOTSH"

            }
            else {
                setTimer = false;
            }
        }

        //网页一加载就开始运行
        function Init() {


            //获取MQTT密钥
            GetKey();
            //连接MQTT
            InitMqtt();
            initDone = 1;
        }

        //初始化MQTT的函数
        function InitMqtt() {

            client = new Paho.MQTT.Client("211.152.46.42", 8083, "myclientid_" + parseInt(Math.random() * 100, 10));
            // set callback handlers
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;
            //client.onSubscribeSuccess = onSubscribeSuccess;
            //client.onSubscribeFailure = onSubscribeFailure;

            // connect the client
            client.connect({onSuccess: onConnect, userName: pub, password: sub, mqttVersion: 3});

            // called when the client connects
            function onConnect() {
                // Once a connection has been made, make a subscription and send a message.
                console.log("onConnect");
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
                console.log(message);
                var data = JSON.parse(message.payloadString);
                console.log(data);
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

        function sendMqtt(string) {
            var message = new Paho.MQTT.Message(string);
            message.destinationName = topic;
            client.send(message);
        }


        //发送心跳包函数
        function HeartBeat() {
            var jstr =
            {
                type: 4120,
                appID: appId//appID，用来确定频道位置以后会换成新的标记
            };
            // console.log("<====发送心跳包函数======>")
            sendMqtt(JSON.stringify(jstr));
        }

        //打开直播流


        if (initDone == 0) {
            Init();
        }
        var jstr = {type: 4310, appID: appId}
        // sendMqtt(JSON.stringify(jstr));
        //打开定时器
        clearInterval(timer_beat);
        timer_beat = window.setInterval(HeartBeat, 20000);
        //20s 的周期发送心跳包


    };
    $scope.close = function () {
        $scope.liveStatus = false;
        //闭流
        $http.post(urlBase + "/api/2/livecontrol/closestorage/" + $scope.open_hls_storage + "/").success(function (dtata) {
            console.log("<=======闭流成功====>" + $scope.open_hls_storage);
            clearInterval(timer_beat);
            client.disconnect();

        }).error(function () {
            alert("有点错误");
        })

    };
    $scope.reset=function(){
        $scope.state={};
        $scope.functype={};
        $scope.status = "-1";
        $scope.func_type = "-1";
        $scope.description="";
        $scope.storage_names="";
        $scope.submit_search();
    }


})