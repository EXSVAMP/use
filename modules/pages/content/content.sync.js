/**
 * Created by tangjianfeng on 16/5/18.
 */
"use strict"
var scope = ["$scope","$http",'$uibModal',"baseUrl",'url_junction', function($scope, $http, $uibModal,baseUrl,url_junction) {
    var urlBase = baseUrl.getUrl();
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
                            text:"确认删除这条记录？",
                            method:"delete",
                            data:$scope.query_result['a'+$scope.status][index],
                            scope:$scope
                        }
                    }else if(method=="add"){
                        return {
                            title:"增加一条记录",
                            method:"add",
                            status_disable:true,
                            choice:$scope.choice,  //
                            scope:$scope
                        }
                    }else{
                        return {
                            title:"修改记录",
                            method:"modify",
                            status_disable:false,
                            data:$scope.query_result['a'+$scope.status][index],  //
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
    $scope.status='100'; //
    $scope.rfid_id=''; //
    $scope.rfid_type = '-1'; //
    $scope.is_writed = '-1'; //
    $scope.numPages = 10;
    $scope.rfid_card_id = ""; //
    $scope.rfid_card = Object();
    $scope.rfid_card.serial_number = "";
    $scope.goods_location = Object();
    $scope.goods_location.name="";
    $scope.choice = {};
    $scope.query_result = {
        a100:{},
        a200:{},
        a300:{},
        a400:{},
        a500:{},
        a600:{}
    };
    $scope.order={
        a100:{
            id:false,
            rfid_id:false,
            status:false,
            rfid_type:false,
            is_writed:false,
            'rfid_card.serial_number': false,
            'goods_location.name': false,
            updated_at: false,
            created_at: false
        },
        a200:{
            id:false,
            rfid_id:false,
            status:false,
            rfid_type:false,
            is_writed:false,
            'rfid_card.serial_number': false,
            'goods_location.name': false,
            updated_at: false,
            created_at: false
        },
        a300:{
            id:false,
            rfid_id:false,
            status:false,
            rfid_type:false,
            is_writed:false,
            'rfid_card.serial_number': false,
            'goods_location.name': false,
            updated_at: false,
            created_at: false
        },
        a400:{
            id:false,
            rfid_id:false,
            status:false,
            rfid_type:false,
            is_writed:false,
            'rfid_card.serial_number': false,
            'goods_location.name': false,
            updated_at: false,
            created_at: false
        },
        a500:{
            id:false,
            rfid_id:false,
            status:false,
            rfid_type:false,
            is_writed:false,
            'rfid_card.serial_number': false,
            'goods_location.name': false,
            updated_at: false,
            created_at: false
        },
        a600:{
            id:false,
            rfid_id:false,
            status:false,
            rfid_type:false,
            is_writed:false,
            'rfid_card.serial_number': false,
            'goods_location.name': false,
            updated_at: false,
            created_at: false
        }
    };
    $scope.search_show=false;
    $scope.switch_order = function(key){
        $scope.order['a'+$scope.status][key] = !$scope.order['a'+$scope.status][key];
        $scope.submit_search($scope.status,1)
    };
    //
    $scope.bigTotalItems = {
        a100:0,
        a200:0,
        a300:0,
        a400:0,
        a500:0,
        a600:0
    };
    $scope.number = {
        a100:'10',
        a200:'10',
        a300:'10',
        a400:'10',
        a500:'10',
        a600:'10'
    };
    $scope.searchTotal={
        a100:0,
        a200:0,
        a300:0,
        a400:0,
        a500:0,
        a600:0
    }
    $scope.setPage = function() {
        $scope.submit_search($scope.status,1);
    };
    $scope.changePage = function(){
        $scope.submit_search($scope.status,1)
    };
    $scope.maxSize = 5;
    $scope.bigCurrentPage = {
        a100:1,
        a200:1,
        a300:1,
        a400:1,
        a500:1,
        a600:1
    };
    //
    var rfid_type=-1,
        is_writed=-1,
        rfid_id="",
        rfid_card_id='',
        goods_location_name='',
        card_serial_number='';
    $http.get(urlBase + "/api/1/common/choices/?key=rfidcontent").success(function(data){
        if(data.code==200){
            $scope.choice = data;
        }else{
            alert(data.message)
        }
    }).error(function(data,state){
        if(state == 403){
            baseUrl.redirect()
        }
    });
    $scope.submit_search = function(status,type,method){  //search type 0:搜索1:更新
        $scope.table_hide = false;
        if(type==0){
            rfid_card_id = $scope.rfid_card_id;
            rfid_id = $scope.rfid_id;
            rfid_type = $scope.rfid_type;
            is_writed = $scope.is_writed;
            card_serial_number = $scope.rfid_card.serial_number;
            goods_location_name = $scope.goods_location.name;

        }else{
            if(status){
                $scope.status=status;
            }
        }
        var order_str = "";
        for(var i in $scope.order['a'+$scope.status]){
            if($scope.order['a'+$scope.status][i]){
                if(order_str){
                    order_str += ','+i
                }else{
                    order_str += i;
                }
            }
        };
        var query_url = url_junction.getQuery({
            status:$scope.status,
            rfid_card_id:rfid_card_id,
            rfid_id:rfid_id,
            rfid_type:rfid_type,
            is_writed:is_writed,
            "rfid_card.serial_number": card_serial_number,
            "goods_location.name": goods_location_name,
            descent:order_str,
            number:$scope.number['a'+$scope.status],
            index:$scope.bigCurrentPage['a'+$scope.status]
        });
        $http.get(urlBase+"/api/1/content/"+ query_url).success(function(data){
            if(data.code==200){
                $scope.query_result['a'+$scope.status] = data.data;

                  $scope.searchTotal['a'+$scope.status] = data.pageinfo.total_number;


            }else{
                alert(data.message)
            }
        }).error(function(data,state){
            if(state == 403){
                baseUrl.redirect()
            }
        })

    };
    $scope.submit_search(0,0)

    $scope.refresh_stat = function () {
        $http.get(urlBase+'/api/1/content/stat/').success(function (data) {
            if(data.code==200){         
                for(var status in data.data.rfid_content){
                    $scope.bigTotalItems['a'+status] = data.data.rfid_content[status].total;
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
   $scope.refresh_stat()
}]

return scope