var app = angular.module('RDash');
app.register.controller("locationCtrl", function ($scope, $http, $timeout, $interval, $uibModal,baseUrl,$sce,$templateCache,$location) {
    var BaseUrl = baseUrl.getUrl();
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;


    var getData=function(){
        $scope.myPromise=$http.get(BaseUrl + "/api/1/location/init/").success(function(data){
            if($(".mgNavigator").length>0){
                $(".mgNavigator").remove();
            }

            if(data.code==200){
                $scope.dataList = data.data;
                $scope.firstDataArray=[];
                $scope.secondDataArray=[];

                // console.log($scope.dataList);

                // 判断警告框
                $scope.warn=function(list){
                    var flag;
                    angular.forEach(list,function(value,key){
                        // console.log("<=====>"+value.status);
                        if(value.status==2){
                            flag=true;
                            return flag;
                        }
                    })
                    return flag;
                }

                $scope.info=function(list){
                    var  res="";
                    for(var i=0;i<list.length;i++){
                        var status=list[i].status;
                        var name;
                        if(status==2){
                            name=list[i].name;
                            var des="";
                            var eventsList=list[i].events;

                            for(var j=0;j<eventsList.length;j++){
                                des+="[编号:"+eventsList[j].id+"]"+"&nbsp;&nbsp;"+eventsList[j].event_datetime+"&nbsp;<br/>"+eventsList[j].description+"<br/><br/>";
                            }
                            res+=name+":"+"<br/>"+des;

                        }

                    }

                    return $sce.trustAsHtml(res);

                }

                $(window).mgMiniMap({elements: '.board_1',liveScroll: true, draggable: true,debug:true,resizable:true});
            }else{
                alert(data.message)
            }
        }).error(function(data,state){
            if(state == 403){
                baseUrl.redirect()
            }
        });

    };
    getData();


    // window.setInterval(function(){
    //     getData();
    // },30000);

    $scope.warnShow=function(obj){
        obj.warnflag=true;
    }
    $scope.warnhide=function(obj){
        obj.warnflag=false;
    }




})