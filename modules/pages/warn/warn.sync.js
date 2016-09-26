var app = angular.module('RDash');
app.register.controller("warnCtrl", function ($scope, $http, $timeout,ListService,utils) {
    ListService.init($scope,'/api/1/eventlog/');
    $scope.params.event_feedback_type=1;
    $scope.refresh();
    $scope.selections={};
    $scope.selections.event_type=[{name:'入库',value:'0'},{name:'移动',value:'1'},{name:'消失',value:'2'},{name:'出库',value:'3'},{name:'非正常',value:'4'}];
    $scope.selections.event_feedback=[{name:'通过',value:'0'},{name:'报警',value:'1'},{name:'通知',value:'2'}];
    $scope.selections.handle_result=[{name:'未处理',value:'0'},{name:'保持',value:'1'},{name:'解除',value:'2'}];
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