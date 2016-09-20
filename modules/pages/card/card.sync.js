var app = angular.module('RDash');
app.register.controller("cardCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope) {
	console.log("Test app.register.controller");
	$scope.state = [
    	{ name: '未使用', flag: 0},
    	{ name: '正在使用', flag: 1},
    	{ name: '损坏', flag: 2},
    	{ name: '已删除停用', flag:3}
    ];

  	$scope.sort_arrow_id_img = "/statics/lib/img/icon_sort_down_16_16_01.png";
  	$scope.sort_arrow_serial_img = "/statics/lib/img/icon_sort_down_16_16_01.png";
  	$scope.sort_arrow_state_img = "/statics/lib/img/icon_sort_down_16_16_01.png";
  	$scope.sort_arrow_updatetime_img = "/statics/lib/img/icon_sort_down_16_16_01.png";
  	$scope.sort_arrow_createtime_img = "/statics/lib/img/icon_sort_down_16_16_01.png";

  	$scope.emptyDataListShow = "";

  	$scope.index = 1;
  	$scope.number = 10;
  	var status = "-1";
  	//$scope.descent = "";

  	getRFIDList();
  	function getRFIDList(){
  		//console.log("getRFIDList()");
  		var pk = $scope.serial_search;
  		var serial_number = "";
  		var descent = "";

  		var params = "index="+$scope.index+"&number="+$scope.number;

  		if(typeof pk != "undefined" && pk)
  			params += "&pk="+pk;

    	if(typeof status != "undefined" && status != -1)
    		params += "&status="+status;

    	if(typeof serial_number != "serial_number" && serial_number)
  			params += "&serial_number="+serial_number;

  		if(typeof descent != "undefined" && descent)
  			params += "&descent="+descent;

  		$http.get(baseUrl.getUrl() + "/api/1/card/?"+params).success(function(data){
        	if(data.code==200){
            	$scope.dataList = data.data;
            	//$scope.dataList = [{"id":1,"serial_number":22,"status_display":"Test","updated_at":"2016.9.12","created_at":"2016.9.16"}];
            	//console.log("$scope.dataList:"+$scope.dataList.length);
            	if($scope.dataList.length == 0)
            		$scope.emptyDataListShow = "emptyDataListShow";
            	else{
            		$scope.emptyDataListShow = "";
            	}
        	}else{
            	//alert(data.message)
            	$rootScope.alert_pop("获取列表出错:"+data.description);
        	}
    	}).error(function(data,state){
        	if(state == 403){
            	baseUrl.redirect()
        	}
    	});
  	}

  	$scope.queryRFIDList = function(){
  	//alert($scope.state.name.flag);
  	}

  	$scope.edit = function(data){
  		//console.log(data.id);
  	}
})