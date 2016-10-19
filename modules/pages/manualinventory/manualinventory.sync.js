var app = angular.module('RDash');
app.register.controller("manualinventoryCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, url_junction, $timeout,ngDialog) {
	//console.log("Test app.register.controller");
  var urlBase = baseUrl.getUrl();
  $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalManualinventory',
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
                    }else if(method=="add"){
                        return {
                            title:"新增检测",
                            method:"add",
                            scope:$scope
                        }
                    }else if(method=="modify"){
                        return {
                            title:"修改检测",
                            method:"modify",
                            data:$scope.dataList[index],
                            scope:$scope
                        }
                    }else if(method=="inventory"){
                        return {
                            title:"预约检测",
                            method:"inventory",
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
    $scope.choice = {};

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
      // if(from)
      //   from += ':00';
      // if(to)
      //   to += ':00';
      var query_url = url_junction.getQuery({
      from:from,
      to:to,
      state:$scope.status,
      descent:order_str,
      number:$scope.number,
      index:$scope.index
    });
  
  		$http.get(baseUrl.getUrl() + "/api/2/inventory/list/date"+query_url).success(function(data){
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

          // $scope.dataList =  [
          // {id:1,state:0,date:"2016",updated_at:"2016"},
          // {id:2,state:1,date:"2016",updated_at:"2016"},
          // {id:3,state:2,date:"2016",updated_at:"2016"},
          // {id:4,state:3,date:"2016",updated_at:"2016"}
          // ];
          //  currentPageDataNum = 4;
          //  $scope.bigTotalItems = 4;
          //  $scope.total_page = 1;
        }
    	}).error(function(data,state){
        	if(state == 403){
            	baseUrl.redirect()
        	}
    	});
  	}

    $scope.submit_search(1,-1);

    // $timeout(function(){
    //   $('.date-picker').datetimepicker({
    //     format:'yyyy-mm-dd hh:ii',
    //     language: 'zh',
    //     orientation: "left",
    //     todayHighlight: true,
    //     autoclose:true,
    //     templates:{
    //       leftArrow: '<i class="fa fa-angle-left"></i>',
    //       rightArrow: '<i class="fa fa-angle-right"></i>'
    //     }
    //   });
    // },100);

    $('.date-picker').daterangepicker({ 
      locale: {
        format: 'YYYY-MM-DD HH:mm:ss' ,
        applyLabel: '确定',
        cancelLabel: '取消',
        clearLabel: '清空',
        fromLabel: '从',
        toLabel: '至',
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      singleDatePicker: true,
      showDropdowns: true,
      timePicker: true,
      timePicker24Hour: true,
      timePickerSeconds: true
    });

    $scope.hasExcutingOne = function(){
      $http.get(baseUrl.getUrl() + "/api/2/inventory/list/date").success(function(data){
        if(data.code==200){
          $scope.dataList =  data.data;
          var hasExcutingOne = false;
          var excutingOneId = 0;
          for(var i=0; i<$scope.dataList.length; i++){
            if($scope.dataList[i].state == 1){
              hasExcutingOne = true;
              excutingOneId = $scope.dataList[i].id;
              break;
            }
          }//end for
          console.log("hasExcutingOne:"+hasExcutingOne);
          //hasExcutingOne = true;
          if(hasExcutingOne){
            $scope.open('md-inventory-manual','inventory',excutingOneId);
          }else
            $scope.open('md-add-manual','add',0);
        }
      }).error(function(data,state){
          if(state == 403){
              baseUrl.redirect()
          }
      });
    }

    $scope.inventoryImmediately = function(){
      $http.get(baseUrl.getUrl() + "/api/2/inventory/list/date").success(function(data){
        if(data.code==200){
          $scope.dataList =  data.data;
          var hasExcutingOne = false;
          var excutingOneId = 0;
          for(var i=0; i<$scope.dataList.length; i++){
            if($scope.dataList[i].state == 1){
              hasExcutingOne = true;
              excutingOneId = $scope.dataList[i].id;
              break;
            }
          }//end for
          console.log("hasExcutingOne:"+hasExcutingOne);
          //hasExcutingOne = true;
          if(hasExcutingOne){
            $scope.open('md-inventory-manual','inventory',excutingOneId);
          }else
            $scope.open('md-add-manual','add',0);
        }
      }).error(function(data,state){
          if(state == 403){
              baseUrl.redirect()
          }
      });
    }

    Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
    }

    $scope.inventoryImmediately_2 = function(){
      $http.get(baseUrl.getUrl() + "/api/2/inventory/list/date").success(function(data){
        if(data.code==200){
          $scope.dataList =  data.data;
          var hasExcutingOne = false;
          var excutingOneId = 0;
          for(var i=0; i<$scope.dataList.length; i++){
            if($scope.dataList[i].state == 1){
              hasExcutingOne = true;
              excutingOneId = $scope.dataList[i].id;
              break;
            }
          }//end for
          console.log("hasExcutingOne:"+hasExcutingOne);
          //hasExcutingOne = true;
          if(hasExcutingOne){
            ngDialog.open({
              template: '<p style=\"text-align: center\">错误信息：不能添加,30s内有其他任务</p>',
              plain: true
            });
          }else{
            var startDate = new Date();
            startDate.setSeconds(startDate.getSeconds()+5);
            startDate = startDate.Format("yyyy-MM-dd hh:mm:ss");
            $http.post(baseUrl.getUrl() + "/api/2/inventory/list/date", {"date":startDate}).success(function(data){
              if(data.code=="200"){
                $scope.submit_search();
                ngDialog.open({
                  template: '<p style=\"text-align: center\">立即检测成功</p>',
                  plain: true
                });
              }
            }).error(function(){
                    alert("有点故障！")
            })
          }
        }
      }).error(function(data,state){
          if(state == 403){
              baseUrl.redirect()
          }
      });
    }

    $scope.inventoryOnce = function(store_house_id,schedule_id){
      //console.log(store_house_id+" "+schedule_id);
      //console.log(1);
      if(!store_house_id)
        store_house_id = $scope.store_house_id;
      if(!schedule_id)
        schedule_id = $scope.schedule_id;
      $http.post(baseUrl.getUrl() + "/api/2/inventory/",{store_house_id:store_house_id,schedule_id:schedule_id}).success(function(data){
        if(data.code==200){
          ngDialog.open({
              template: '<p style=\"text-align: center\">检测成功</p>',
              plain: true
          });
        }
      }).error(function(data,state){
          if(state == 403){
              baseUrl.redirect()
          }
      });
    }

});
