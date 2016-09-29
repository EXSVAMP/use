var app = angular.module('RDash');
app.factory('utils', function ($http,$uibModal) {
    var showImg=function(imgs){
        var modalInstance = $uibModal.open({
            controller: 'imgCarouselPopCtrl',
            templateUrl: "statics/modules/pages/common/imgCarouselPop.html",
            size: 'img-carousel',
            resolve: {
                imgs:function() {
                    return imgs
                }
            }
        });
        return modalInstance;
    }
    return {
        set:function(obj,key,value){
            var keys = key.split('\.');
            var v = obj;
            for(var k in keys){
                if(angular.isObject(v)){
                    v=v[keys[k]];
                }else{
                    return false;
                }
            }
            v = value;
            return true;
        },
        init:function($scope){
            $scope.showImg=showImg;
        },
        showImg:showImg
    }
});
app.controller('imgCarouselPopCtrl',function($scope,imgs,$timeout){
    if(angular.isString(imgs)){
        $scope.imgs = [];
        $scope.imgs.push(imgs);
    }else if(angular.isArray(imgs)){
        $scope.imgs = imgs;
    }
    $scope.current=0;
    $scope.nextImg=function(index){
        console.log(index)
        var imgs = $scope.imgs;
        if(angular.isUndefined(index)){
            index=$scope.current+1;
            if(index==imgs.length)index=0;
            if(index<0)index=imgs.length-1;
        }
        if(index==$scope.current||index>=imgs.length||index<0)return;
        // $interval.cancel($scope.imgInterval);
        // $scope.imgInterval = $interval(function(){
        //     $scope.nextImgFn();
        // },2000);
        if(index>$scope.current){
            $scope.imgCarouselAnimateClass='img-carousel-next';
        }else{
            $scope.imgCarouselAnimateClass='img-carousel-previous';
        }
        $timeout(function(){
            $scope.current=index;
        },100);
    }
});