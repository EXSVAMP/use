var app = angular.module('RDash');
app.factory('listService', function ($http,baseUrl,url_junction) {
    return {
        init:function($scope,url,options){                      //options:{isAdd:刷新时旧数据是否清空,autoRefresh:列表到底自动刷新,listElement:列表元素选择器}
            $scope.options = options?options:{};                //查询设置
            $scope.listEl = null;                               //列表元素
            $scope.dataList=[];                                 //数据
            $scope.total=0;                                     //总条数
            $scope.totalPage=0;                                 //总页数
            $scope.page=0;
            $scope.listLoadFlag = 0;                            //列表加载标记0:未加载;1:加载中;2已加载
            if(!$scope.order)$scope.order = {id:false};         //排序字段,true时带入descent
            $scope.params = {index:1,number:10,descent:''};     //查询条件,页码,每页条数,排序字段
            $scope.refresh=function(page,callback){
               
                if(angular.isNumber(page)&&page>$scope.totalPage)return;
                if(angular.isNumber(page)){
                    $scope.params.index=page
                }else if(!angular.isUndefined(page)&&page!=null&&page!==''){
                    return;
                }
                if($scope.totalPage&&$scope.params.index>$scope.totalPage)return;
                if(!$scope.params.index)return;
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
                $http.get(baseUrl.getUrl() + url+ url_junction.getQuery($scope.params)).success(function(data){
                    $scope.listLoadFlag=2;
                    if(data.code==200){
                        if($scope.options.isAdd){
                            $scope.dataList=$scope.dataList.concat(data.data);
                        }else{
                            $scope.dataList=data.data;
                        }
                        $scope.total=data.pageinfo.total_number;
                        $scope.totalPage=data.pageinfo.total_page;
                        if(callback&&angular.isFunction(callback))callback(data);
                        if($scope.listCallback&&angular.isFunction($scope.listCallback))$scope.listCallback(data);
                    }else{
                        alert(data.message)
                    }
                });
            }
            //自动刷新的列表添加滚动监听
            if($scope.options.autoRefresh&&$scope.options.listElement){
                $scope.listEl = angular.element($scope.options.listElement);
                if($scope.listEl){
                    $scope.listEl.on('scroll',function(event){
                        var list = event.target;
                        if(list.scrollTop + list.clientHeight == list.scrollHeight){
                            $scope.refresh();
                        }
                    })
                }
            }
        }
    }
});