var is_openfull = 0;
var app = angular.module('RDash');
app.register.controller("locationCtrl", function ($scope, $http, $timeout, $interval, $uibModal,baseUrl,$sce,$templateCache,$location) {
    var BaseUrl = baseUrl.getUrl();
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;

    $scope.fullscreenObj = false;
    $scope.f12_press = false;

    $scope.openfull_body=function(){
        elem=document.getElementById("body_ele");
        if(elem.webkitRequestFullScreen){
            elem.webkitRequestFullScreen();
        }else if(elem.mozRequestFullScreen){
            elem.mozRequestFullScreen();
        }else if(elem.requestFullScreen){
            elem.requestFullscreen();
        }else{
            //浏览器不支持全屏API或已被禁用
        }
        // elem.style.background = "#ffffff";
        // elem.style.overflow = "auto";
    }

    $scope.closeFull = function(){
        $scope.fullscreenObj = false;
        $(".sideBar").show();
        $(".header_com").show();
        $("#page-wrapper").css("padding-left","200px");
        $("html").attr("style","");
        //$("#body_ele").fullScreen();
    }

     // $(window).on( 'fullscreenchange',function(){
     //   console.log($scope.fullscreenObj);
     //   if(!$scope.fullscreenObj){
     //    $scope.closeFull();
     //   }
     //    //$scope.closeFull();
     // } );
     // $(window).on( 'mozfullscreenchange',function(){
     //   console.log($scope.fullscreenObj);
     //     if(!$scope.fullscreenObj){
     //    $scope.closeFull();
     //   }
     // } );
     // $(window).on( 'webkitfullscreenchange',function(){
     //   console.log($scope.fullscreenObj);
     //     if(!$scope.fullscreenObj){
     //    $scope.closeFull();
     //   }
     // } );

     document.addEventListener("fullscreenchange", function () {  

    console.log((document.fullscreen)? "" : "not ";)}, false);  

document.addEventListener("mozfullscreenchange", function () {  

    fullscreenState.innerHTML = (document.mozFullScreen)? "" : "not ";}, false);  

document.addEventListener("webkitfullscreenchange", function () {  

    fullscreenState.innerHTML = (document.webkitIsFullScreen)? "" : "not ";}, false);

document.addEventListener("msfullscreenchange", function () {

    fullscreenState.innerHTML = (document.msFullscreenElement)? "" : "not ";}, false);

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

                //$(window).mgMiniMap({elements: '.board_1',liveScroll: true, draggable: true,debug:true,resizable:true});
                $(window).mgMiniMap({elements: '.board_1',liveScroll: true, draggable: true,debug:true,resizable:true});
                $(".mgNavigator").append("<div class='minimap-fullscreen' style='position: absolute;top: -60px;right: 0px;width:35px;height:35px;background:#000;text-align:center;cursor:pointer;'><span class='icon-icon_compress' style='font-size: 32px;color: #fff;'></span></div>");
               
                $(".minimap-fullscreen").click(function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    if($scope.fullscreenObj){
                        is_openfull = 0;
                        $scope.fullscreenObj = false;
                        $(".sideBar").show();
                        $(".header_com").show();
                        $("#page-wrapper").css("padding-left","200px");
                        $("html").attr("style","");
                        $("#body_ele").fullScreen();
                    }else{
                        is_openfull = 1;
                        $scope.fullscreenObj = true;
                        $(".sideBar").hide();
                        $(".header_com").hide();
                        $("#page-wrapper").css("padding-left","0");
                        $scope.openfull_body();
                        //$("#body_ele").css("overflow","auto");
                        //$("#body_ele").css("background","#fff");
                        $("html").css("background","#f3f3f3");
                        $(window).mgMiniMap("update");
                        //console.log("testtest");
                        //console.log($("#body_ele").fullScreen);
                        
                    }
                }); 

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
    //
    // $scope.openfull=function(){
    //     elem=document.getElementById("location");
    //     if(elem.webkitRequestFullScreen){
    //         elem.webkitRequestFullScreen();
    //     }else if(elem.mozRequestFullScreen){
    //         elem.mozRequestFullScreen();
    //     }else if(elem.requestFullScreen){
    //         elem.requestFullscreen();
    //     }else{
    //         //浏览器不支持全屏API或已被禁用
    //     }
    // }


})