var app = angular.module('RDash');
app.register.controller("eventlogCtrl", function ($scope, $http, $timeout,$location,baseUrl,listService,global,utils,popService) {
    $scope.selections={};
    $scope.camera=[];
    $scope.reader=[];
    $scope.selections.event_type={"-1":'--------'};
    $scope.selections.event_feedback_type={"-1":'--------'};
    $scope.selections.handle_result={"-1":'--------'};
    $scope.selections.numbers=global.pageNumSelections;
    utils.init($scope);
    listService.init($scope,'/api/1/eventlog/');
    $scope.listCallback=function(data){
        if(data.data.length>0)$scope.showDetail(data.data[0].id);
    };
    $scope.refresh();

    $scope.tabSwitch = 0;
    $scope.detail={};

    $http.get(baseUrl.getUrl()+'/api/1/common/choices/?key=eventlog').success(function(data){
        if(data.code==200){
            angular.merge($scope.selections,data.data);
        }
    });
    $http.get(baseUrl.getUrl()+"/api/1/camera/").success(function(data){
        if(data.code==200){
          $scope.camera=data.data;
            $scope.camera.push({id: '-1', serial_number: '-------------'});

        }
    });
    $http.get(baseUrl.getUrl()+"/api/1/reader/").success(function(data){
        if(data.code==200){
            $scope.reader=data.data;
            $scope.reader.push({id: '-1', serial_number: '-------------'});

        }
    });
    $scope.showDetail=function(id){
        $scope.detail.id=id;
        $http.get(baseUrl.getUrl()+'/api/1/eventlog/'+id+"/").success(function(data){
            if(data.code==200){
                $scope.detail = data.data;
                // $scope.detail.img2='http://img0.imgtn.bdimg.com/it/u=3761389663,2619900045&fm=11&gp=0.jpg';
                var rfid_list_display = '';
                angular.forEach($scope.detail.rfid_list,function(item){
                    if(rfid_list_display!=''){
                        rfid_list_display+=',';
                    }
                    rfid_list_display+=item.rfid_id;
                });
                $scope.detail.rfid_list_display=rfid_list_display;
            }
        });
    }
    $scope.handleEvent = popService.handleEvent;
});