var app = angular.module('RDash');
app.register.controller("pollinventoryCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, url_junction, $timeout,ngDialog) {
	//console.log("Test app.register.controller");
  var urlBase = baseUrl.getUrl();
  $scope.open = function (size, method,index){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      controller: 'ModalPollinventory',
      templateUrl: "myModalContent.html",
      size: size,
      resolve: {
        items: function () {
          if(method=="delete"){
            return {
              title:"删除检测",
              method:"delete",
              data:$scope.dataList[index],
              scope:$scope
            }
          }else if(method=="info"){
            return {
              title:"检测结果",
              method:"info",
              data:$scope.dataList[index],
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

  $scope.emptyDataListShow = "";
  $scope.currentPageDataNum = 0;

  $scope.index = 1;
  $scope.number = 10;
  $scope.maxSize = 5;
  $scope.status = "-1";
  //user sel status but not click search
  $scope.statusTemp = "-1";
  $scope.numbers = [10,20,30,40,50];
  $scope.numbers2 = [5,6,7,8,9,10];
    $scope.order = {
      id: false,
      status:false,
      updated_at:false,
      date:false
    };

  $scope.state = [{flag:0,name:'未执行'},{flag:1,name:'正在执行'},{flag:2,name:'已执行'},{flag:3,name:'执行异常'},{flag:-1,name:'--请选择-'}];

  $scope.startDate = "";
  $scope.startDateTemp = "";
  $scope.endDate = "";
  $scope.endDateTemp = "";

  $scope.intervalTaskTime = 5;
  $scope.timeSetEnable = true;

  $scope.statusSelFunc = function(data){
    $scope.statusTemp = data.flag;
  }

  $scope.setShowNum2 = function(data){
    $scope.intervalTaskTime = data;
    $scope.setIntervalTask(0);
  }

  $scope.timeSetEnableFunc = function(){
    $scope.timeSetEnable = !$scope.timeSetEnable;
    if($scope.timeSetEnable)
      $scope.setIntervalTask();
    else{
      //console.log(12);
      $scope.cancelIntervalTask();
    }
  }

  $scope.switch_order = function(key){
    $scope.order[key] = !$scope.order[key];
    $scope.submit_search()
  };

  $scope.setShowNum = function(data){
    $scope.number = data;
    $scope.index = 1;
    $scope.submit_search();
  }

  $scope.setPage = function (pageNo) {
    $scope.submit_search();
  };
  $scope.changePage = function(a){
    $scope.submit_search()
  };

  $scope.submit_search = function(iStartIdx,iStatus){
    //console.log("test:"+$scope.startDate);
    if(iStartIdx)
      $scope.index = iStartIdx;
    if(iStatus)
      $scope.status = iStatus;
    else{
    }
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
  		
    var from = $scope.startDateTemp;
    var to = $scope.endDateTemp;
    if(from)
      from += ':00';
    if(to)
      to += ':00';
    var query_url = url_junction.getQuery({
      from:from,
      to:to,
      state:$scope.status,
      descent:order_str,
      number:$scope.number,
      index:$scope.index
    });
  $scope.store_house_id = 0;
  	$http.get(baseUrl.getUrl() + "/api/2/inventory/list/interval"+query_url).success(function(data){
      if(data.code==200){
        $scope.dataList =  data.data;
        currentPageDataNum = $scope.dataList.length;
        $scope.bigTotalItems = data.pageinfo.total_number;
        $scope.total_page = data.pageinfo.total_page;
        if(currentPageDataNum == 0)
          $scope.emptyDataListShow = "emptyDataListShow";
        else{
          $scope.emptyDataListShow = "";
        }
         if($scope.dataList.length > 0){
            $scope.store_house_id = $scope.dataList[0].store_house;
            $scope.schedule_id = $scope.dataList[0].schedule_type.id;
          }
          console.log("testtest:"+$scope.store_house_id);
          $scope.wsFunc();
        // $scope.dataList =  [
        //   {id:1,state:0,date:"2016",updated_at:"2016"},
        //   {id:2,state:1,date:"2016",updated_at:"2016"},
        //   {id:3,state:2,date:"2016",updated_at:"2016"},
        //   {id:4,state:3,date:"2016",updated_at:"2016"}
        // ];
        // currentPageDataNum = 4;
        // $scope.bigTotalItems = 4;
        // $scope.total_page = 1;
      }
    }).error(function(data,state){
      if(state == 403){
        baseUrl.redirect()
      }
    });
  }

  $scope.submit_search(1,-1);

  $timeout(function(){
    $('.date-picker').datetimepicker({
      format:'yyyy-mm-dd hh:ii',
      language: 'zh',
      orientation: "left",
      todayHighlight: true,
      autoclose:true,
      templates:{
        leftArrow: '<i class="fa fa-angle-left"></i>',
        rightArrow: '<i class="fa fa-angle-right"></i>'
      }
    });
  },100);

  $scope.setIntervalTask = function(iFlag){
    if($scope.timeSetEnable){
      if(iFlag == 0){
       console.log("$scope.intervalTaskTime:"+$scope.intervalTaskTime);
      $http.put(baseUrl.getUrl() + "/api/2/inventory/list/interval/delete",{interval:$scope.intervalTaskTime}).success(function(data){
        if(data.code==200){
          //sel interval time
          if(iFlag == 0){
            ngDialog.open({
              template: '<p style=\"text-align: center\">修改定时盘点间隔时间任务成功</p>',
              plain: true
            });
          }
        }
      }).error(function(data,state){
        if(state == 403){
          baseUrl.redirect()
        }
      });
    }else{
      $http.post(baseUrl.getUrl() + "/api/2/inventory/list/interval",{interval:$scope.intervalTaskTime}).success(function(data){
        if(data.code==200){
          //sel interval time
          //if(iFlag == 0){
            ngDialog.open({
              template: '<p style=\"text-align: center\">新增定时盘点间隔时间任务成功</p>',
              plain: true
            });
          //}
        }
      }).error(function(data,state){
        if(state == 403){
          baseUrl.redirect()
        }
      });
    }
    }
  }

  $scope.cancelIntervalTask = function(){
      $http.delete(baseUrl.getUrl() + "/api/2/inventory/list/interval/delete").success(function(data){
        if(data.code==200){
          //sel interval time
          //if(iFlag == 0){
            ngDialog.open({
              template: '<p style=\"text-align: center\">删除盘点间隔时间任务成功</p>',
              plain: true
            });
          //}
        }
      }).error(function(data,state){
        if(state == 403){
          baseUrl.redirect()
        }
      });
  }

  $scope.setIntervalTask();


  $scope.wsFunc = function(){
    console.log($scope.store_house_id);
    // Create a client instance
    var token = $cookieStore.get("iotcloud-token").token;
    //var client = new Paho.MQTT.Client("211.152.46.42", Number(9011), "/api/2/inventory/list/interval?index=1&number=10&iotcloud_token="+token,"1");

    var client = new Paho.MQTT.Client("211.152.46.42", Number(9011), "/api/2/inventory/list/interval?index=1&number=10&","1");
    //var client = new Paho.MQTT.Client("iot.eclipse.org",  Number(80), "/ws", "1");
    var client = new Paho.MQTT.Client("211.152.46.42", Number(8083), "/exingcai/iot/clould/","web"+parseInt(Math.random()*100));

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect,userName:'iotweb',password:'123qwe!@#'});

    // called when the client connects
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      // client.subscribe("/World");
      // message = new Paho.MQTT.Message("Hello");
      // message.destinationName = "/World";
      // client.send(message);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
      }
    }

    // called when a message arrives
    function onMessageArrived(message) {
      console.log("onMessageArrived:"+message.payloadString);
      console.log(message);
    }
  }

  //$scope.wsFunc();


});