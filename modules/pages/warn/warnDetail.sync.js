var app = angular.module('RDash');
app.register.controller("warnDetailCtrl", function ($scope, $http, params,$location,baseUrl) {
    var data = $location.search();
    $http.get(baseUrl.getUrl()+'/api/1/eventlog/'+data.id+"/").success(function(data){
        if(data.code==200){
            $scope.detail = data.data;
            console.log($scope.detail);
            $scope.detail.img1='http://img0.imgtn.bdimg.com/it/u=3761389663,2619900045&fm=11&gp=0.jpg';
            $scope.detail.img2='http://imgsrc.baidu.com/forum/pic/item/199db2da81cb39db2dedc43ed3160924ab183007.jpg';
        }
    });
    $scope.tabSwitch = 0;

});