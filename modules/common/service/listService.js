var app = angular.module('RDash');
app.factory('ListService', function ($http,baseUrl) {
    return {
        init:function($scope,url){
            $scope.dataList=[];
            $scope.total=0;
            $scope.totalPage=0;
            if(!$scope.order)$scope.order = {id:false};
            $scope.params = {index:1,number:10,descent:''};
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
                $http.get(baseUrl.getUrl() + url,{params:$scope.params}).success(function(data){
                    if(data.code==200){
                        $scope.dataList=data.data;
                        $scope.total=data.pageinfo.total_number;
                        $scope.total_page=data.pageinfo.total_page;
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