var app = angular.module('RDash');
app.register.controller("pollinventoryCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, url_junction) {
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
                            //text:"删除RFID卡",
                            title:"删除检测",
                            method:"delete",
                            data:$scope.dataList[index],
                            scope:$scope
                        }
                    }else if(method=="info"){
                        return {
                            title:"检测结果",
                            method:"info",
                            status_disable:false,
                            data:$scope.dataList[index],
                            choice:$scope.choice,
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
    $scope.choice = {};

  	$scope.index = 1;
  	$scope.number = 10;
    $scope.maxSize = 5;
  	$scope.status = "-1";
    //user sel status but not click search
    $scope.statusTemp = "-1";
    $scope.serial_search = "";
    $scope.serial_searchTemp = "";
    $scope.numbers = [10,20,30,40,50];
  	$scope.numbers2 = [5,6,7,8,9,10];
    $scope.order = {
        id: false,
        status:false,
        updated_at:false,
        date:false
    };

    $scope.state = [{flag:0,name:'未执行'},{flag:1,name:'正在执行'},{flag:2,name:'已执行'},{flag:3,name:'执行异常'},{flag:-1,name:'--请选择-'}];

    $scope.statusSelFunc = function(data){
      $scope.statusTemp = data.flag;
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
  		
      var from = "";
      var to = "";
      var query_url = url_junction.getQuery({
      from:from,
      to:to,
      state:$scope.status,
      descent:order_str,
      number:$scope.number,
      index:$scope.index
    });
  
  		$http.get(baseUrl.getUrl() + "/api/2/inventory/list/interval"+query_url).success(function(data){
        if(data.code==200){
          // $scope.dataList =  data.data;
          // currentPageDataNum = $scope.dataList.length;
          // $scope.bigTotalItems = data.pageinfo.total_number;
          // $scope.total_page = data.pageinfo.total_page;
          // if(currentPageDataNum == 0)
          //   $scope.emptyDataListShow = "emptyDataListShow";
          // else{
          //   $scope.emptyDataListShow = "";
          // }

          $scope.dataList =  [
          {id:1,state:0,date:"2016",updated_at:"2016"},
          {id:2,state:1,date:"2016",updated_at:"2016"},
          {id:3,state:2,date:"2016",updated_at:"2016"},
          {id:4,state:3,date:"2016",updated_at:"2016"}
          ];
           currentPageDataNum = 4;
           $scope.bigTotalItems = 4;
           $scope.total_page = 1;
        }
    	}).error(function(data,state){
        	if(state == 403){
            	baseUrl.redirect()
        	}
    	});
  	}

    $scope.submit_search(1,-1);

    // Create a client instance
 client = new Paho.MQTT.Client("211.152.46.42", Number(9011), "/api/2/inventory/list/interval?index=1&number=10","clientId");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  //client.subscribe("/World");
  //message = new Paho.MQTT.Message("Hello");
  //message.destinationName = "/World";
  //client.send(message);
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
}

})