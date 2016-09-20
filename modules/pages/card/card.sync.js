var app = angular.module('RDash');
app.register.controller("cardCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope) {
	// $scope.person = {};
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

  $scope.index = 1;
  $scope.number = 10;
  //$scope.descent = "";

  getRFIDList();
  function getRFIDList(){
  	var pk = $scope.serial_search;
  	var state = "-1";
  	var serial_number = "";
  	var descent = "";
  	if(typeof pk == "undefined")
  		pk = "";
  	//var params = "pk="+pk+"&serial_number="+serial_number+"&descent="+descent+"&index="+$scope.index+"&number="+$scope.number;
    
  	var params = "index="+$scope.index+"&number="+$scope.number;

    if(typeof state != "undefined" && state != -1)
    	params += "&state="+state;
  	$http.get(baseUrl.getUrl() + "/api/1/card/?"+params).success(function(data){
        if(data.code==200){
            $scope.dataList = data.data;
        }else{
            alert(data.message)
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
})