var app = angular.module('RDash');
app.factory('listService', function ($http,baseUrl) {
    return {
        init:function($scope,url){
            $scope.dataList=[];                                 //数据
            $scope.total=0;                                     //总条数
            $scope.totalPage=0;                                 //总页数
            $scope.listLoadFlag = 0;                            //列表加载标记0:未加载;1:加载中;2已加载
            if(!$scope.order)$scope.order = {id:false};         //排序字段,true时带入descent
            $scope.params = {index:1,number:10,descent:''};     //查询条件,页码,每页条数,排序字段
            $scope.refresh=function(page,callback){
                if(page){
                    $scope.params.index=page
                }
                var descent = '';
                var order = $scope.order;
                for(var key in order){
                    if(order[key]){
                        if(descent!=''){
                            descent+=',';
                        }
                        descent+=key;
                    }
                }
                $scope.params.descent=descent;
                $scope.listLoadFlag = 1;
                $http.get(baseUrl.getUrl() + url,{params:$scope.params}).success(function(data){
                    $scope.listLoadFlag=2;
                    if(data.code==200){
                        $scope.dataList=data.data;
                        $scope.total=data.pageinfo.total_number;
                        $scope.totalPage=data.pageinfo.total_page;
                        if(callback&&angular.isFunction(callback))callback(data);
                        if($scope.listCallback&&angular.isFunction($scope.listCallback))$scope.listCallback(data);
                    }else{
                        alert(data.message)
                    }
                });
            }
        }
    }
});