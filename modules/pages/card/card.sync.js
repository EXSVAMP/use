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
  	var currentPageDataNum = 0;

  	$scope.index = 1;
  	$scope.number = 10;
  	var status = "-1";
  	//$scope.descent = "";

  	getRFIDList();
  	function getRFIDList(){
  		//console.log("getRFIDList()");
  		//var pk = $scope.serial_search;
  		var pk = "";
  		var serial_number = $scope.serial_search;
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
            	currentPageDataNum = $scope.dataList.length;
            	//$scope.dataList = [{"id":1,"serial_number":22,"status_display":"Test","updated_at":"2016.9.12","created_at":"2016.9.16"}];
            	//console.log("$scope.dataList:"+$scope.dataList.length);
            	if(currentPageDataNum == 0)
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

  	//搜索card列表
  	$scope.queryRFIDList = function(){
  	//alert($scope.state.name.flag);
  	}

  	//增加card信息
  	$scope.addRFID = function(){
  		//console.log(data.id);
  		var custom_com_pop_m_content = '<form role="form" class="add_form">'+
										'<div class="form-group">'+
    									'<label for="add_serial">序列号:</label>'+
    									'<input type="text" class="form-control" id="add_serial" placeholder="请填写序列号" ng-model="model" />'+
  										'</div>'+
  										'</form>';
  		$rootScope.custom_pop({w:400,h:217},"新增RFID卡","/statics/lib/img/icon_RFIDcard_16_16_03.png",custom_com_pop_m_content,function(){
  			//var serial_number = $rootScope.model;
  			//alert(serial_number);
  			//var serial_number2 = $scope.model;
  			//alert(serial_number2);
  			//alert($rootScope.$scope2.model);
  			var serial_number = $rootScope.$scope2.model;
  			if(serial_number){
  				var params = {serial_number:serial_number};
  				$http.post(baseUrl.getUrl() + "/api/1/card/",params).success(function(data){
        			if(data.code==200){
  						//$scope.dataList = data.data;
            			//currentPageDataNum = $scope.dataList.length;
            			if(currentPageDataNum < $scope.number){
            				$scope.emptyDataListShow = "";
            				currentPageDataNum++;
            				var dataTemp = data.data;
            				$scope.dataList.push({"id":dataTemp.id,"serial_number":dataTemp.serial_number,"status_display":dataTemp.status_display,"updated_at":dataTemp.updated_at,"created_at":dataTemp.created_at});
            			}
            			$rootScope.alert_pop("新增成功");
            			
        			}else{
            			//alert(data.message)
            			$rootScope.alert_pop("新增出错:"+data.description);
        			}
    			}).error(function(data,state){
        			if(state == 403){
            			baseUrl.redirect()
        			}
    			});
  			}else
  				$rootScope.alert_pop("序列号不能为空!");
  		});
  	}

  	//删除card信息
  	$scope.delete = function(data){
  		$rootScope.deleteCardId = data.id;
  		var custom_com_pop_m_content = '<div class="deleteCardInfo"><p><span></span>确定要删除这个RFID卡吗？<br/>注意：删除以后不可以恢复！</p></div>';
  		$rootScope.custom_pop({w:400,h:227},"删除RFID卡","/statics/lib/img/icon_RFIDcard_16_16_03.png",custom_com_pop_m_content,function(){
  			$http.delete(baseUrl.getUrl() + "/api/1/card/"+$rootScope.deleteCardId+"/").success(function(data){
        	if(data.status_display == "已删除停用"){
        		currentPageDataNum--;
        		if(currentPageDataNum == 0)
            		$scope.emptyDataListShow = "emptyDataListShow";
            	else{
            		$scope.emptyDataListShow = "";
            	}
            	for(var i = 0; i < $scope.dataList.length; i++){
            		if($scope.dataList[i].id == $rootScope.deleteCardId){
            			//$scope.dataList[i].splice(i,1);
            			$scope.dataList[i].status = 3;
            			$scope.dataList[i].status_display = "已删除停用";
            			break;
            		}
            	}
        		$rootScope.alert_pop("删除成功");
        		$rootScope.custom_com_pop_show = "";
            	$rootScope.ngDialog.close();
        	}else{
            	//alert(data.message)
            	$rootScope.alert_pop("删除出错");
        	}
    	}).error(function(data,state){
        	if(state == 403){
            	baseUrl.redirect()
        	}
    	});
  		});
  	}

  	//编辑card信息
  	$scope.edit = function(data){
  		//alert($rootScope.$scope2);
  		$rootScope.editCardId = data.id;
  		$http.get(baseUrl.getUrl() + "/api/1/card/"+data.id+"/").success(function(data){
        	if(data.code==200){
            	var dataTemp = data.data;
            	$rootScope.defaultSelVal = dataTemp.status;
            	$rootScope.defaultSerialVal = dataTemp.serial_number;
            	var custom_com_pop_m_content = '<form role="form" class="edit_form">'+
  					'<div class="form-group form-group-selin">'+
    				'<label for="edit_status">状态:</label>'+
    				'<ui-select ng-model="stateEdit.flag" theme="bootstrap">'+
            		'<ui-select-match placeholder="--请选择-">{{$select.selected.name}}</ui-select-match>'+
            		//'<ui-select-choices repeat="item in [{ name: 未使用, flag: 0},{ name: 正在使用, flag: 1},{ name: 损坏, flag: 2},{ name: 已删除停用, flag:3}]">'+
              		//'<ui-select-choices ng-repeat="item in stateEdit">'+
              		'<ui-select-choices repeat="item in stateEdit">'+
              		'<div ng-bind-html="item.name"></div>'+
            		'</ui-select-choices>'+
          			'</ui-select>'+
  					'</div>'+
					'<div class="form-group">'+
    				'<label for="edit_serial">序列号:</label>'+
    				'<input type="text" class="form-control" id="edit_serial" placeholder="请填写序列号" ng-model="edit_serial" />'+
  					'</div>'+
  					'</form>';
  				$rootScope.custom_pop({w:400,h:293},"修改RFID卡","/statics/lib/img/icon_RFIDcard_16_16_03.png",custom_com_pop_m_content,function(){
  					var editFlag = $rootScope.$scope2.stateEdit.flag.flag;
  					var editSerial_number = $rootScope.$scope2.edit_serial;
  					//$http.put(baseUrl.getUrl() + "/api/1/card/"+$rootScope.editCardId+"/?"+"status="+editFlag+"&serial_number="+editSerial_number).success(function(data){
  					$http.put(baseUrl.getUrl() + "/api/1/card/"+$rootScope.editCardId+"/",{status:editFlag,serial_number:editSerial_number}).success(function(data){	
  						$rootScope.alert_pop("更新成功");
  					}).error(function(data,state){
        			if(state == 403){
            			baseUrl.redirect()
        			}
    				});
  				});

        	}else{
            	//alert(data.message)
            	$rootScope.alert_pop("获取信息出错:"+data.description);
        	}
    	}).error(function(data,state){
        	if(state == 403){
            	baseUrl.redirect()
        	}
    	});
  		
  		
  	}

})