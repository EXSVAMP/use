var app = angular.module('RDash');
app.register.controller("contentCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, url_junction, $rootScope, PageHandle) {
  
  $scope.queryParam={
    rfid_type_Id: undefined

  };

  $scope.query_url_now = "";

  var urlBase=baseUrl.getUrl();
  $scope.open = function (size, method,index){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      controller: 'ModalContent',
      templateUrl: "myModalContent.html",
      size: size,
      resolve: {
        items: function () {
          if(method=="delete"){
            return {
              title:"删除RFID卡内容",
              method:"delete",
              data:$scope.query_result[$scope.currentSelTab][index],
              scope:$scope
            }
          }else if(method=="add"){
            return {
              title:"新增RFID卡内容",
              method:"add",
              status_disable:true,
              choice:$scope.choice,  //
              scope:$scope
            }
          }else{
            return {
              title:"修改RFID卡内容",
              method:"modify",
              status_disable:false,
              data:$scope.query_result[$scope.currentSelTab][index],  //
              choice:$scope.choice, //
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
  $scope.statusInfo= {"200": "入库监视", 
                      "600": "已删除作废", 
                      "400": "已出库", 
                      "300": "待出库", 
                      "100": "待入库", 
                      "500": "完成出库"
                    };
  $scope.statusIcon= {"200": "icon-icon_warehouse_eyes", 
                      "600": "icon-icon_warehouse_delete", 
                      "400": "icon-icon_warehouse_complete", 
                      "300": "icon-icon_warehouse_out", 
                      "100": "icon-icon_warehouse_into", 
                      "500": "icon-icon_warehouse_outcomplete"
                    };
  $scope.choice={};
  $scope.rfid_type="-1";
  $scope.rfid_typeTemp = "-1";
  $scope.rfid_card_id = "";
  $scope.rfid_card_idTemp = "";
  $scope.rfid_id = "";
  $scope.rfid_idTemp = "";
  $scope.is_writed = "-1";
  $scope.is_writedTemp = "-1";
  $scope.card_serial_numberTemp = "";
  $scope.card_serial_number = "";
  $scope.goods_location_nameTemp = "";
  $scope.goods_location_name = "";
  $scope.currentSelTab = "";
  $scope.query_result = {};
  $scope.bigTotalItems = 0;
  $scope.index = 1;
  $scope.index_sel = "";
  $scope.indexselect="10";
  // $scope.bigTotalItems = {

  // };
  $scope.bigTotalItems_detail = {

  };
  $scope.number = {

  };
  $scope.searchTotal={

  };
  $scope.tabActive={

  };
  $scope.order={

  };
  $scope.bigCurrentPage = {

  };
  $scope.numbers = [10,20,30,40,50];
  $scope.first_search = 1;

  $http.get(urlBase + "/api/1/common/choices/?key=rfidcontent").success(function(data){
    $scope.rfid_type_Items = [];
    $scope.is_writed_Items = [];
    if(data.code==200){
      $scope.choice = data;
      var dataTemp= $scope.choice.data.rfid_type;
      for(dataItem in dataTemp){
        $scope.rfid_type_Items.push({id:dataItem,name:dataTemp[dataItem]});
      }
      $scope.rfid_type_Items.push({id:-1,name:"-------------"});
      dataTemp= $scope.choice.data.is_writed;
      for(dataItem in dataTemp){
        $scope.is_writed_Items.push({id:dataItem,name:dataTemp[dataItem]});
      }
      $scope.is_writed_Items.push({id:-1,name:"-------------"});

    }else{
      alert(data.message)
    }
  }).error(function(data,state){
       console.log("有点错误");
  });

  $scope.changeType=function(data){
    $scope.rfid_typeTemp = data.id;
  }

  $scope.changeWrite=function(data){
    $scope.is_writedTemp = data.id;
  }

  $scope.typeSelTabClick=function(data){
    $scope.tabActive[$scope.currentSelTab] = false;
    $scope.tabActive[data] = true;
    $scope.currentSelTab = data;
    $scope.submit_search($scope.currentSelTab,1);
  }

  $scope.refresh_stat = function (bDataCountChange) {
    $http.get(urlBase+'/api/1/content/stat/').success(function (data) {
      if(data.code==200){
      if(!bDataCountChange){
        for(var status in data.data.rfid_content){
          //$scope.bigTotalItems[status] = data.data.rfid_content[status].total;
          $scope.tabActive[status] = false;
          if(!$scope.currentSelTab){
            $scope.currentSelTab = status;
            $scope.tabActive[status] = true;
          }
          $scope.order[status] = {id:true,
                                  rfid_id:false,
                                  status:false,
                                  rfid_type:false,
                                  is_writed:false,
                                  // 'card_serial_number': false,
                                  // 'goods_location_name': false,
                                  'rfid_card_id': false,
                                  'goods_location_id': false,
                                  updated_at: false,
                                  created_at: false
                                };
          $scope.number[status] = 10;
          index:$scope.bigCurrentPage[status] = 1;
        }
        $scope.submit_search(0,0); 
      }        
        
        $scope.bigTotalItems_detail = data.data.rfid_content;

      }else{
        alert(data.message)
      }
    }).error(function(data,state){
      if(state == 403){
        baseUrl.redirect()
      }
    })
  }
  $scope.refresh_stat();

  $scope.switch_order = function(key){
    $scope.order[$scope.currentSelTab][key] = !$scope.order[$scope.currentSelTab][key];

    //单个排序
    for(var i in $scope.order[$scope.currentSelTab]){
      if(i!==key){
        $scope.order[$scope.currentSelTab][i]=false;
      }
    }

    $scope.submit_search($scope.currentSelTab,1);
  };
  $scope.setPage = function() {
    if(PageHandle.setPageInput($scope.index_sel,$scope.total_page)){
      $scope.index = $scope.index_sel;
      $scope.index_sel = "";
      $scope.bigCurrentPage[$scope.currentSelTab] = $scope.index;
      $scope.submit_search($scope.currentSelTab,1);
    }else
      $scope.index_sel = "";

  };
  $scope.changePage = function(){
    $scope.bigCurrentPage[$scope.currentSelTab] = $scope.index;
    $scope.submit_search($scope.currentSelTab,1);
  };
  $scope.setShowNum = function(data){
    $scope.indexselect=data;
      $scope.number[$scope.currentSelTab] = data;
      $scope.index = 1;
      $scope.bigCurrentPage[$scope.currentSelTab] = $scope.index;
      $scope.submit_search($scope.currentSelTab,1);
    }

  $scope.emptyDataListShow = "";
  $scope.currentPageDataNum = 0;
  //$scope.index = 1;
  //$scope.number = 10;
  $scope.maxSize = 5;

  $scope.refresh_stat_search = function (query_url_info){
    for(var key in $scope.statusInfo){
      //console.log("refresh_stat_search key:"+key);
      if(key != $scope.currentSelTab){
        $scope.submit_search_getTotal(key,query_url_info);
      }
    }
  }

  $scope.refresh_stat_search_all = function (){
    for(var key in $scope.statusInfo){
     
        $scope.submit_search_getTotal(key,$scope.query_url_now);
      
    }
  }

  $scope.submit_search = function(status,type,method){  //search type 0:搜索1:更新
    //$scope.table_hide = false;
    //console.log($scope.bigCurrentPage[$scope.currentSelTab]+",type:"+type);

    if(type==0){
      rfid_card_id = $scope.rfid_card_idTemp;
      rfid_id = $scope.rfid_idTemp;
      rfid_type = $scope.rfid_type;
      is_writed = $scope.is_writed;
      card_serial_number = $scope.card_serial_numberTemp;
      goods_location_name = $scope.goods_location_nameTemp;
      $scope.index = 1;

    }else{
      //console.log("status:"+status);
      if(status){
        $scope.currentSelTab=status;
        //$scope.bigCurrentPage[$scope.currentSelTab] = 1;
      }
      $scope.index = $scope.bigCurrentPage[$scope.currentSelTab];
    }
    var order_str = "";
    for(var i in $scope.order[$scope.currentSelTab]){
      if($scope.order[$scope.currentSelTab][i]){
        // if(i == "goods_location_name]")
        //   i = "goods_location.name";
        // if(i == "card_serial_number]")
        //   i = "rfid_card.serial_number";
        if(order_str){
          order_str += ','+i
        }else{
          order_str += i;
        }
      }
    };
    var query_url = url_junction.getQuery({
      status:$scope.currentSelTab,
      rfid_card_id:rfid_card_id,
      rfid_id:rfid_id,
      rfid_type:rfid_type,
      is_writed:is_writed,
      "rfid_card.serial_number": card_serial_number,
      "goods_location.name": goods_location_name,
      descent:order_str,
      number:$scope.indexselect,
      index:$scope.bigCurrentPage[$scope.currentSelTab]
    });

    $scope.query_url_now = query_url;

    $http.get(urlBase+"/api/1/content/"+ query_url).success(function(data){
      if(data.code==200){
        $scope.query_result[$scope.currentSelTab] = data.data;
        $scope.currentPageDataNum = data.data.length;
        $scope.searchTotal[$scope.currentSelTab] = data.pageinfo.total_number;

        $scope.bigTotalItems = data.pageinfo.total_number;
        $scope.total_page = data.pageinfo.total_page;
       //bigTotalItems console.log("total_page:"+ $scope.total_page);
        if($scope.first_search == 0 && type == 0)
          $scope.bigTotalItems_detail[$scope.currentSelTab].total =  data.pageinfo.total_number;
        //alert($scope.currentPageDataNum);
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

    if($scope.first_search == 0 && type == 0){
      //console.log("query_url:"+JSON.stringify(query_url.substring(1)));
      $scope.refresh_stat_search(query_url);
    }

    $scope.first_search = 0;

  };

  $scope.submit_search_getTotal = function(status,query_url_info){
    //query_url:"?status=100&rfid_type=1&number=10&index=1"
    query_url_info = query_url_info.replace(/status=\d*&/,'status='+status+"&");
    //console.log("query_url_info.status:"+JSON.stringify(query_url_info));
    $http.get(urlBase+"/api/1/content/"+ query_url_info).success(function(data){
      if(data.code==200){
        $scope.bigTotalItems_detail[status].total =  data.pageinfo.total_number;
      }else{
        alert(data.message)
      }
    }).error(function(data,state){
      if(state == 403){
        baseUrl.redirect()
      }
    })

  };
  //$scope.submit_search(0,0);

});
