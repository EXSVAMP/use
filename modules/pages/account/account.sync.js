var app = angular.module('RDash');
app.register.controller("accountCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope,listService,params) {
	var urlBase = baseUrl.getUrl();
	$scope.choice = {func_type:{},status:{}};
	$scope.func_type = '-1';
    $scope.status = "-1";
    $scope.description = "";
    $scope.serial_number = "";
	$scope.dataList = {};
	$scope.index = 1;
	$scope.number = 10;
    $scope.maxSize = 5;
    //$scope.bigCurrentPage = 1;
    $scope.numbers = [10,20,30,40,50];
    $scope.listLoadFlag = 1;

    $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalReader',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if(method=="delete"){
                        return {
                            title:"删除读写器信息",
                            method:"delete",
                            data:$scope.dataList[index],
                            scope:$scope
                        }
                    }else if(method=="add"){
                        return {
                            title:"新增读写器",
                            method:"add",
                            //status_disable:true,
                            choice:$scope.choice,
                            scope:$scope
                        }
                    }else{
                        return {
                            title:"修改读写器信息",
                            method:"modify",
                           	//status_disable:false,
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

    $http.get(urlBase + "/api/1/common/choices/?key=rfidreader").success(function(data){
        if(data.code==200){
            $scope.choice["func_type"] = data.data.func_type;
            $scope.choice["status"] = data.data.status;
            //console.log($scope.choice["func_type"][300]);
        }else{
            alert(data);
        }
    }).error(function(data,state){
        if(state == 403){
            baseUrl.redirect()
        }
    });

    $scope.order={
        id:false,
        serial_number:false,
        status:false,
        func_type:false,
        updated_at:false,
        created_at:false
    };
    $scope.func_typeSelFunc = function(data){
    	$scope.func_type = data.key;
    }
    $scope.statusSelFunc = function(data){
    	$scope.status = data.key;
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
    $scope.submit_search = function(){
    	listService.init($scope,'/api/1/user/');
    	if($scope.func_type && $scope.func_type != -1)
    		$scope.params.func_type = $scope.func_type;
    	if($scope.status && $scope.status != -1)
    		$scope.params.status = $scope.status;
    	if($scope.description)
    		$scope.params.description = $scope.description;
    	if($scope.serial_number)
    		$scope.params.serial_number = $scope.serial_number;
    	$scope.params.index = $scope.index;
    	$scope.params.number = $scope.number;
    	$scope.refresh();
    }

    //$scope.submit_search();	

})