var app = angular.module('RDash');
app.register.controller("warnCtrl", function ($scope, $http,baseUrl, $timeout,$location,listService,params,global,$uibModal) {
    listService.init($scope,'/api/1/eventlog/');
    $scope.params.event_feedback_type="1";
    $scope.jumpToPage=0;
    $scope.refresh();
    $scope.selections={};
    $http.get(baseUrl.getUrl()+'/api/1/common/choices/?key=eventlog').success(function(data){
        if(data.code==200){
            angular.merge($scope.selections,data.data);
            console.log($scope.selections)
        }
    });
    $scope.selections.event_type={"/":"--请选择--"};
    $scope.selections.event_feedback_type={"-1":"--请选择--"};
    $scope.selections.handle_result={"-1":"--请选择--"};
    $scope.selections.numbers=global.pageNumSelections;
    $scope.jumpToDetail=function(item){
        $location.path('/warnDetail').search({id:item.id});
    };
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
});