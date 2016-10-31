define('pages/pollinventory/pollinventory.sync', function(require, exports, module) {

  var app = angular.module('RDash');
  app.register.controller("pollinventoryCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, url_junction, $timeout, ngDialog, PageHandle) {
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
    $scope.index_sel = "";
    $scope.number = 10;
    $scope.maxSize = 5;
    $scope.status = "-1";
    //user sel status but not click search
    $scope.statusTemp = "-1";
    $scope.numbers = [10,20,30,40,50];
    $scope.numbers2 = [2,3,4,5];
    $scope.order = {
      id: false,
      status:false,
      updated_at:false,
      date:false
    };

    $scope.state = [{flag:0,name:'未执行'},{flag:1,name:'正在执行'},{flag:2,name:'已执行'},{flag:3,name:'执行异常'},{flag:-1,name:'-------------'}];

    $scope.startDate = "";
    $scope.startDateTemp = "";
    $scope.endDate = "";
    $scope.endDateTemp = "";

    $scope.intervalTaskTime = 2;
    $scope.timeSetEnable = true;
    $scope.firstIn = true;
    $scope.number3 = 2;

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
      //单个排序
       // for(var i in $scope.order){
       //   if(i!==key){
       //     $scope.order[i]=false;
       //   }
       // }
      $scope.submit_search()
    };

    $scope.setShowNum = function(data){
      $scope.number = data;
      $scope.index = 1;
      $scope.submit_search();
    }

    $scope.setPage = function (pageNo) {
      if(PageHandle.setPageInput($scope.index_sel,$scope.total_page)){
        $scope.index = $scope.index_sel;
        $scope.index_sel = "";
        $scope.submit_search();
      }else
        $scope.index_sel = "";
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
        status:$scope.status,
        descent:order_str,
        number:$scope.number,
        index:$scope.index
      });
      if($scope.status==0&&query_url.indexOf('status')<0){
        query_url += "&status=0";
      }
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
          // if($scope.dataList.length > 0){
          //    $scope.store_house_id = $scope.dataList[0].store_house;
          //    $scope.schedule_id = $scope.dataList[0].schedule_type.id;
          //  }

          //console.log("testtest:"+$scope.store_house_id);
          //$scope.wsFunc();
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
        cancelLabel: '清空',
        // clearLabel: '清空',
        fromLabel: '从',
        toLabel: '至',
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

      },
      // autoUpdateInput:false,
      startDate:false,
      endDate: false,
      singleDatePicker: true,
      showDropdowns: true,
      timePicker: true,
      timePicker24Hour: true,
      timePickerSeconds: true
    });
    // $('.date-picker1').on('outsideClick.daterangepicker',function(ev, picker){
    //
    //   picker.hide();
    // $scope.startDate="";
    //
    // });
    // $('.date-picker2').on('outsideClick.daterangepicker',function(ev, picker){
    //   picker.hide();
    //
    // });
    $('.date-picker1').on('cancel.daterangepicker',function(ev, picker){

      $scope.startDate="";
      // $scope.endDate = "";
    })
    $('.date-picker2').on('cancel.daterangepicker',function(ev, picker){

      // $scope.startDate="";
      $scope.endDate = "";
    })
    $scope.addIntervalTask = function(){
      $scope.loadFlag=0;//未调用
      $http.post(baseUrl.getUrl() + "/api/2/inventory/list/interval",{interval:$scope.intervalTaskTime}).success(function(data){
        if(data.code==200){
          //sel interval time
          //if(iFlag == 0){
          ngDialog.open({
            template: '<p style=\"text-align: center\">新增定时盘点间隔时间任务成功</p>',
            plain: true
          });
          //}
          $scope.loadFlag=1;//调用结束
        }
      }).error(function(data,state){
        if(state == 403){
          baseUrl.redirect()
        }
      });
    }

    $scope.setIntervalTask = function(iFlag){
      //console.log($scope.timeSetEnable);
      if($scope.timeSetEnable){
        if(iFlag == 0){
          $scope.loadFlag=0;//未调用
          // console.log("$scope.intervalTaskTime:"+$scope.intervalTaskTime);
          $http.put(baseUrl.getUrl() + "/api/2/inventory/list/interval/delete",{interval:$scope.intervalTaskTime}).success(function(data){
            if(data.code==200){
              //sel interval time
              if(iFlag == 0){
                ngDialog.open({
                  template: '<p style=\"text-align: center\">修改定时盘点间隔时间任务成功</p>',
                  plain: true
                });
              }
              $scope.loadFlag=1;//调用
            }
          }).error(function(data,state){
            if(state == 403){
              baseUrl.redirect()
            }
          });
        }else{
          if($scope.firstIn){
            $scope.firstIn = false;
            $http.get(baseUrl.getUrl() + "/api/2/inventory/list/interval/isexist").success(function(data){
              if(data.code==200){
                if(data.data.is_exist == 0){
                  $scope.timeSetEnable = false;
                }else{
                  if(data.data.schedule.interval)
                    $scope.number3 = data.data.schedule.interval;
                }

              }
            }).error(function(data,state){
              if(state == 403){
                baseUrl.redirect()
              }
            });
          }else{
            $scope.addIntervalTask();
          }
        }//end else
      }
    }

    $scope.cancelIntervalTask = function(){
      $scope.loadFlag=0;//未调用
      $http.delete(baseUrl.getUrl() + "/api/2/inventory/list/interval/delete").success(function(data){
        if(data.code==200){
          //sel interval time
          //if(iFlag == 0){
          ngDialog.open({
            template: '<p style=\"text-align: center\">删除盘点间隔时间任务成功</p>',
            plain: true
          });
          $scope.loadFlag=1;//调用结束
          //}
        }
      }).error(function(data,state){
        if(state == 403){
          baseUrl.redirect()
        }
      });
    }

    $scope.setIntervalTask();

    $scope.wsFunc3 = function(){
      // var url="139.196.148.70";
      client = new Paho.MQTT.Client("211.152.46.42", 8083,"myclientid_" + parseInt(Math.random() * 100, 10));
      // set callback handlers
      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;
      //client.onSubscribeSuccess = onSubscribeSuccess;
      //client.onSubscribeFailure = onSubscribeFailure;

      // connect the client
      client.connect({onSuccess:onConnect, userName: "iotweb", password: "123qwe!@#", mqttVersion: 3});

      // called when the client connects
      function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");

        var store_house_id = localStorage.getItem("storeHouseId");
        console.log("store_house_id:"+store_house_id);

        client.subscribe("exingcai/iot/clould/"+store_house_id+"/eventlog/warning", {onSuccess:onSubscribeSuccess,onFailure:onSubscribeFailure});

        // message = new Paho.MQTT.Message("Hello");
        // message.destinationName = "/World";
        // client.send(message);
      }

      // called when the client loses its connection
      function onConnectionLost(responseObject) {
        console.log("responseObject.errorCode:"+responseObject.errorCode);
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:"+responseObject.errorMessage);
        }
      }

      // called when a message arrives
      function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
        console.log(message);
        var data=JSON.parse(message.payloadString)
        console.log(data);
      }

      function onSubscribeSuccess() {
        subscribed = true;
        console.log("subscribed",subscribed);
      };

      function onSubscribeFailure(err) {
        subscribed = false;
        console.log("subscribe fail. ErrorCode: %s, ErrorMsg: %s",err.errCode,err.errorMessage);
      };

    }
    // $scope.wsFunc3();


  });

});
