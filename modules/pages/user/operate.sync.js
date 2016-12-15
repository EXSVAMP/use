var app=angular.module("RDash");
app.register.controller("operateCtrl",function($scope, $http, $location,$timeout, $uibModal, $cookieStore, baseUrl, $rootScope,url_junction,listService,params, PageHandle){
    var urlBase = baseUrl.getUrl();
    $scope.params={};
    $scope.selections={};
    $scope.selections.op_person={"-1":'--------'};
    $scope.selections.op_model=[];
    $scope.selections.op_type=[];
    $scope.selections.op_res=[];
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.dataList={};
    $http.get(urlBase+"/api/1/common/choices/?key=oprecord").success(function (data) {
           if(data.code==200){
            angular.merge($scope.selections.op_person,data.data.op_person);
               var dataTemp1 = data.data.op_model;
               var dataTemp2 = data.data.op_type;
               var dataTemp3 = data.data.op_res;
               for(dataItem in dataTemp1){
                   $scope.selections.op_model.push({'id':dataItem,'status':dataTemp1[dataItem]})
               }
               for(dataItem in dataTemp2){
                   $scope.selections.op_type.push({'id':dataItem,'status':dataTemp2[dataItem]})
               }
               for(dataItem in dataTemp3){
                   $scope.selections.op_res.push({'id':dataItem,'status':dataTemp3[dataItem]})
               }
               $scope.selections.op_model.push({'id':'-1','status':'--------'});
               $scope.selections.op_type.push({'id':'-1','status':'--------'});
               $scope.selections.op_res.push({'id':'-1','status':'--------'})
           }

    }).error(function (data, state) {
        if (state == 403) {
            baseUrl.redirect()
        }
    });



    //排序
    $scope.order = {
        id: true,
        serial_number: false,
        op_person: false,
        op_model: false,
        op_type: false,
        op_date: false
    };

    $scope.switch_order = function (key) {
        $scope.order[key] = !$scope.order[key];
        for(var i in $scope.order){
            if(i!==key){
                $scope.order[i]=false;
            }
        }
        $scope.submit_search();
    };


    $scope.setShowNum = function (number) {
        $scope.number = number;
        $scope.submit_search();
    }

    $scope.changePage = function () {
        $scope.submit_search();
    }

    $scope.setPage = function (pageNo) {
        if (PageHandle.setPageInput($scope.index_sel, $scope.total_page)) {
            $scope.bigCurrentPage = $scope.index_sel;
            $scope.index_sel = "";
            $scope.submit_search();
        } else
            $scope.index_sel = "";
    };
    
    $scope.submit_search=function(){
        var order_str = "";
        for (var i in $scope.order) {
            if ($scope.order[i]) {
                if (order_str) {
                    order_str += ',' + i
                } else {
                    order_str += i;
                }
            }
        }

        $http.get(urlBase + "/api/2/operation/opera" + url_junction.getQuery({
                date_start: $scope.params.startDate,
                date_end: $scope.params.endDate,
                op_person: $scope.params.op_person,
                op_model: $scope.params.op_model,
                op_type:$scope.params.op_type,
                op_res:$scope.params.op_res,
                descent: order_str,
                index: $scope.bigCurrentPage,
                number: $scope.number

            })).success(function (data) {
            if (data.code == 200) {

                $scope.dataList=data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;
                $scope.total_page = data.pageinfo.total_page;
                $scope.currentPageTotal = $scope.dataList.length;
                if ($scope.currentPageTotal > 0) {
                    $scope.notFound = false;
                } else {
                    $scope.notFound = true;
                }

            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {
                baseUrl.redirect()
            }
        })
        
    }

    $scope.reset=function(){
        $scope.params.startDate="";
        $scope.params.endDate="";
        $scope.params.op_person="";
        $scope.params.op_model="";
        $scope.params.op_type="";
        $scope.params.op_res="";
        $scope.submit_search();
    }
    $scope.submit_search();

    $timeout(function(){
        $('.date-picker').datepicker({
            language: 'zh',
            orientation: "left",
            todayHighlight: true,
            autoclose:true,
            templates:{
                leftArrow: '<i class="fa fa-angle-left"></i>',
                rightArrow: '<i class="fa fa-angle-right"></i>'
            }
        });
    });
})
