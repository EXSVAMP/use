var app = angular.module('RDash');
app.register.controller("warnCtrl", function ($scope, $http, $timeout,ListService,utils) {
    ListService.init($scope,'/api/1/eventlog/');
    $scope.params.event_feedback_type=1;
    $scope.refresh();
    $scope.selections={event_type:[{name:'入库',value:'0'},{name:'移动',value:'1'},{name:'消失',value:'2'},{name:'出库',value:'3'},{name:'非正常',value:'4'}]}
    $scope.onSelect=function(item,key){
        console.log(item.value);
        // utils.set($scope,key,item.value);
        // console.log($scope.params.event_type)
    }

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