var app = angular.module('RDash');
app.register.controller("readerCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope,url_junction,listService,params) {
	var urlBase = baseUrl.getUrl();
	$scope.choice = {func_type:{},status:{}};
    //$scope.choice2 = {func_type:{},status:{}};
	$scope.func_type = '-1';
    $scope.status = "-1";
    $scope.func_typeTemp = '-1';
    $scope.statusTemp = "-1";
    $scope.description = "";
    $scope.serial_number = "";
    $scope.descriptionTemp = "";
    $scope.serial_numberTemp = "";
	$scope.dataList = {};
	$scope.index = 1;
	$scope.number = 10;
    $scope.maxSize = 5;
    //$scope.bigCurrentPage = 1;
    $scope.numbers = [10,20,30,40,50];
    $scope.listLoadFlag = 1;
    $scope.params = {};

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
            //var func_type_t = data.data.func_type;
            //var func_type_t2 = data.data.func_type;
            $scope.choice["func_type"] = data.data.func_type;
            $scope.choice["status"] = data.data.status;
            //$scope.choice2["func_type"] = func_type_t2;
            //$scope.choice2["status"] = data.data.status;
            //console.log("--555:"+JSON.stringify($scope.choice2));
            //console.log("--555:"+JSON.stringify($scope.choice));
            $scope.choice["func_type"][-1] = "--请选择-";
            $scope.choice["status"][-1] = "--请选择-";
            //console.log("--:"+JSON.stringify($scope.choice2));
            //console.log("--:"+JSON.stringify($scope.choice));
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
        //console.log("$scope.index3:"+$scope.index);
        $scope.submit_search();
        //console.log("$scope.index4:"+$scope.index);
    };
    $scope.submit_search = function(){
         $scope.listLoadFlag = 1;
       
    	// listService.init($scope,'/api/1/reader/');
    	// if($scope.func_type && $scope.func_type != -1)
    	// 	$scope.params.func_type = $scope.func_type;
    	// if($scope.status && $scope.status != -1)
    	// 	$scope.params.status = $scope.status;
    	// if($scope.description)
    	// 	$scope.params.description = $scope.description;
    	// if($scope.serial_number)
    	// 	$scope.params.serial_number = $scope.serial_number;
    	// $scope.params.index = $scope.index;
    	// $scope.params.number = $scope.number;
       
    	// $scope.refresh($scope.index);
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

      var query_url = url_junction.getQuery({
      status:$scope.status,
      func_type:$scope.func_type,
      description:$scope.descriptionTemp,
      serial_number:$scope.serial_numberTemp,
      number:$scope.number,
      index:$scope.index
    });
    $http.get(urlBase+"/api/1/reader/"+ query_url).success(function(data){
      if(data.code==200){
        $scope.listLoadFlag = 2;
        $scope.dataList=data.data;
        $scope.total=data.pageinfo.total_number;
        $scope.totalPage=data.pageinfo.total_page;
        $scope.currentPageDataNum = data.data.length;
        if($scope.currentPageDataNum == 0)
          $scope.emptyDataListShow = "emptyDataListShow";
        else{
          $scope.emptyDataListShow = "";
        }
      }else{
        alert(data.message)
      }
    }).error(function(data,state){
      if(state == 403){
        baseUrl.redirect()
      }
    })

    }

    $scope.submit_search();	

})