var app = angular.module('RDash');
app.register.controller("cardCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope) {
	//console.log("Test app.register.controller");
  var urlBase = baseUrl.getUrl();
	// $scope.state = [
 //    	{ name: '未使用', flag: 0},
 //    	{ name: '正在使用', flag: 1},
 //    	{ name: '损坏', flag: 2},
 //    	{ name: '已删除停用', flag:3}
 //    ];
    $scope.state = [];

    $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalInstanceCtrl',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if(method=="delete"){
                        return {
                            //text:"删除RFID卡",
                            title:"删除RFID卡",
                            method:"delete",
                            data:$scope.dataList[index],
                            scope:$scope
                        }
                    }else if(method=="add"){
                        return {
                            title:"新增RFID卡",
                            method:"add",
                            status_disable:true,
                            choice:$scope.choice,
                            scope:$scope,
                            data:{'status':0}
                        }
                    }else if(method=="replace"){
                        return {
                            title:"替换RFID卡",
                            method:"replace",
                            status_disable:true,
                            data:$scope.dataList[index],
                            scope:$scope
                        }
                    }
                    else{
                        return {
                            title:"修改RFID卡",
                            method:"modify",
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
    $scope.numbers = [10,20,30,40,50,60,70,80,90,100];
  	
    $scope.order = {
        id: false,
        serial_number: false,
        status:false,
        updated_at:false,
        created_at:false
    };
    $scope.switch_order = function(key){
        $scope.order[key] = !$scope.order[key];
        $scope.submit_search()
    };

    $http.get(urlBase + "/api/1/common/choices/?key=rfidcard").success(function(data){
        if(data.code==200){
            $scope.choice = data;
            console.log(data.data);
            var dataTemp= $scope.choice.data.status;
            for(dataItem in dataTemp){
              $scope.state.push({name:dataTemp[dataItem],flag:dataItem});
            }
            $scope.state.push({name:"--请选择-",flag:-1});
        }else{
            alert(data.message)
        }
    }).error(function(data,state){
        if(state == 403){
            baseUrl.redirect()
        }
    });

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
        if(typeof $scope.state.name != "undefined")
          $scope.status = $scope.state.name.flag;
        else
          $scope.status = -1;
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
  		var pk = "";
  		var serial_number = $scope.serial_search;
  		var descent = "";
  		var params = "index="+$scope.index+"&number="+$scope.number;

  		if(pk)
  		  params += "&pk="+pk;

    	if($scope.status && $scope.status != -1)
        params += "&status="+$scope.status;

    	if(serial_number)
  			params += "&serial_number="+serial_number;

  		if(order_str)
  			params += "&descent="+order_str;

  		$http.get(baseUrl.getUrl() + "/api/1/card/?"+params).success(function(data){
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
        }
    	}).error(function(data,state){
        	if(state == 403){
            	baseUrl.redirect()
        	}
    	});
  	}

    $scope.submit_search(1,-1);

})