angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngCookies','ngDialog','cgBusy','truncate']);
require('router');
require('interceptor/captainlnterceptor');

/**
 * Master Controller
 */
var app = angular.module('RDash');
app.config(function($httpProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});
app.service("baseUrl", function () {
    var url="http://211.152.46.42:9011";
    // var url="http://139.196.148.70:9002";
    //var url="http://127.0.0.1:9002";
    //url = "http://192.168.20.45:8000";

    return {
        getUrl:function(){
            return url
        },
        redirect:function(){
            //window.location.href = "/login.html"
        }
    }
}).service("url_junction", function(){
    return {
        getQuery:function(dic){
            var query_url = '';
            for(var i in dic){
                if(dic[i] && dic[i]!='-1'){
                    if(query_url==""){
                        query_url+="?"+i+"="+dic[i]
                    }else{
                        query_url+="&"+i+"="+dic[i]
                    }
                }
            }
            return query_url
        },
        getDict:function(dic){
            var ret_dic = {};
            for(var i in dic){
                if(dic[i] && dic[i]!='-1'){
                    ret_dic[i] = dic[i];
                }
            }
            return ret_dic;
        }
    }
});

app.factory('HttpInterceptor', ['$q','$injector',HttpInterceptor]);
function HttpInterceptor($q, $injector) {
    return {
        request: function(config){
            return config;
        },
        requestError: function(err){
            return $q.reject(err);
        },
        response: function(res){
            var ngDialog;
            if(!ngDialog){
                ngDialog = $injector.get("ngDialog")
            }
            if(res.data.code){
                if(res.data.code!='200'){
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">错误信息：' + res.data.message + '</p>',
                        plain: true
                    });
                };

            }
            return res;
        },
        responseError: function(err){
            var ngDialog;
            if(!ngDialog){
                ngDialog = $injector.get("ngDialog")
            }
            if(-1 === err.status) {
                // 远程服务器无响应
                // ngDialog.open({
                //     template:'<p style=\"text-align: center\">远程服务器无响应</p>',
                //     plain:true
                // });
            } else if(500 === err.status) {
                // 处理各类自定义错误
                ngDialog.open({
                    template:'<p style=\"text-align: center\">内部服务器错误</p>',
                    plain:true
                });
            } else if(501 === err.status) {
                // ...
            } else if(403 === err.status) {
                // window.location.href = "/login.html"
            }
            return $q.reject(err);
        }
    };
}

// 添加对应的 Interceptors
app.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push(HttpInterceptor);
}]);

app.directive("tibAccordion", function(){
    return {
        restrict: 'E',
        template: "<div ng-class=\"{true:\'wraper-close\'}[close]\">" +
            "<li class=\"sidebar-list\">" +
            "<a ng-click=\"total_sidebar_toggle();close=!close\" style=\"cursor: pointer\">我的仓库 <span class=\"menu-icon fa fa-chevron-down\"></span></a>" +
            "</li>\n<ul class=\"sidebar-list-wraper\" ng-transclude>" +
            "</ul>\n</div>",
        replace: true,
        transclude: true,
        controller: function($scope){
            $scope.total_sidebar_toggle = function(){
                $scope.$emit("sidebar_toggle")
            };
        },
        scope:{
            open:"@"
        },
        link: function(scope,element,attrs){
            scope.close = false;
            var li_number = element[0].children[1].children.length;
            var dom = element[0].children[1];
            dom.style.height = li_number*40 + "px";
        }
    }
});

app.directive("ware",function(){
    return{

    }
});

app.controller('MasterCtrl', function ($scope,$http,$cookieStore,$timeout,$location,baseUrl,ngDialog,$rootScope) {

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;
    $scope.getWidth = function () {
        return window.innerWidth;
    };
    //ngDialog.open({
    //    template:'<p>I\'m $templateCa</p>',
    //    plain:true
    //});
    $scope.$watch($scope.getWidth, function (newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = !$cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }
    });
    $scope.toggleSidebar = function () {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };
    var bread_address = {
        card:"RFID卡",
        content:"RFID内容",
        camera:"摄像头",
        reader:"读写器",
        eventlog:"事件日志",
        location:"我的仓库/仓库监视图",
        // set:"我的仓库/货位二"
    };
    $scope.current_addr = bread_address[$location.$$path.split("/")[1]];
    $scope.$on("addr_change",function(e,d){
        $scope.current_addr = bread_address[d];
    });
    $scope.logout = function(){
        $http.get(baseUrl.getUrl()+"/api/1/user/logout/").success(function(data){
            if(data.code=="200"){
                // alert("登出成功");

                window.location.href = "/login.html"
            }
        });
    };
    $scope.repassword = function(){
        ngDialog.open({
            template:"repassword.html",
            controller:"repassword",
            //className:'ngDialog-theme-default',
            preCloseCallback: function(value) {
                var nestedConfirmDialog = ngDialog.openConfirm({
                    template:"test.html"
                });

                // NOTE: return the promise from openConfirm
                return nestedConfirmDialog;
            }
        })
    };
    window.onresize = function () {
        $scope.$apply();
    };
    $scope.$on("sidebar_toggle",function(){

    });
    $scope.toggleE = function($event){
        if($event.target.offsetParent){
            if($event.target.offsetParent.className.indexOf("open")==-1){
                $scope.headers_drop1 = false;
                $scope.headers_drop2 = false;
            }
        }
    }
});
app.controller("repassword",function($scope, $http){
    $scope.username = '';
    $scope.old_password = '';
    $scope.password = '';
    $scope.re_password = '';
    $scope.submit = function(){
        var data = {
            username: $scope.username,
            old_password: $scope.old_password,
            password: $scope.password,
            re_password: $scope.re_password
        };
        $http.post("/api/1/user/repassword/", data)
            .success(function(res){
                if(res.code=='200'){
                    window.location.href = "/login.html"
                }
            })
    }
});
app.controller("siderbar", function($scope,$location){
    if($location.$$path.split('/')[1]){
        $scope.active_item = $location.$$path.split('/')[1];
    }else{
        $scope.active_item = "card"
    }
    $scope.active = function(item){
        $scope.active_item = item;
        $scope.$emit("addr_change",item);
    }
});
app.filter("revrs", function(){
    return function(input){
        if(input){
            var arr = [];
            input_length = input.length
            for(var i=0;i<input_length;i++){
                arr[input_length-i-1] = input[i];
            }
            return arr
        }
    }
});
 
app.controller("ModalReader", function($scope,$uibModalInstance,$http,items,baseUrl,url_junction){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    if(items.method=="add"){
        $scope.func_type = "100";
        $scope.status = "0";
        $scope.description = "";
        $scope.serial_number = "";
        $scope.ip_address="";
        $scope.ok = function(){
          if($scope.serial_number!=""){
            var query_url = url_junction.getDict({
                func_type:$scope.func_type,
                status:$scope.status,
                serial_number:$scope.serial_number,
                description:$scope.description,
                storage_names:$scope.storage_names,
                ip_address:$scope.ip_address
            });
            if($scope.func_type=="100"){
                query_url["rfid_reader_id"] = $scope.rfid_reader_id;
            };

            $http.post(baseUrl+"/api/1/reader/",query_url).success(function(data){
                if(data.code==200){
                    items.scope.submit_search($scope.item.scope.status, 1);
                };
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
         }

        };
    }else if(items.method=="modify"){
        $scope.func_type = items.data.func_type;
        $scope.status = items.data.status;
        $scope.serial_number = items.data.serial_number;
        $scope.description = items.data.description;
        $scope.ip_address=items.data.ip_address;
        $scope.ok = function(){
            $scope.pk = items.data.id;
            var query_url = url_junction.getDict({
                func_type: $scope.func_type,
                status: $scope.status,
                serial_number: $scope.serial_number,
                description: $scope.description,
                ip_address:$scope.ip_address
            });
            $http.put(baseUrl+"/api/1/reader/"+$scope.item.data.id+"/",query_url).success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search($scope.item.scope.status, 1);
                }else{
                    alert(data.description)
                }
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
        };
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/1/reader/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search($scope.item.scope.status, 1);
                }
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
        };
    }
});

app.controller("ModalCamera", function($scope,$uibModalInstance,$http,items,baseUrl,url_junction){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;

    //获取所有读写器,增加一条记录,读写器ID**********************
    var readerAll=[];
    $http.get(baseUrl+"/api/1/reader/").success(function(data){
        var res=data.data;
        angular.forEach(res,function(value,key){
            var o={};
            if(value.status=="1"&&value.func_type=="100"){
                o["id"]=value.id;
                o["serial_number"]=value.serial_number;
                o["func_type"]=value.func_type;
                o["func_type_display"]=value.func_type_display;
              readerAll.push(o);
            }
        })
     }
    );
     //*********************************************


    $scope.readerItems=readerAll;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    if(items.method=="add"){
        $scope.rfid_reader_id = "-1";
        $scope.func_type = "100";
        $scope.status = "0";
        $scope.serial_number = "";
        $scope.description = "";
        $scope.storage_names = "";
        $scope.ip_address="";
        $scope.live_address="";

            $scope.ok = function(){
                var query_url = url_junction.getDict({
                    func_type:$scope.func_type,
                    status:$scope.status,
                    serial_number:$scope.serial_number,
                    description:$scope.description,
                    storage_names:$scope.storage_names,
                    ip_address:$scope.ip_address,
                    live_address:$scope.live_address

                });
                if($scope.func_type=="100"&&$scope.rfid_reader_id!="-1"){
                    query_url["rfid_reader_id"] = $scope.rfid_reader_id;
                };
                if( $scope.serial_number!="") {
                    $http.post(baseUrl + "/api/1/camera/", query_url).success(function (data) {
                        if (data.code == 200) {
                            items.scope.submit_search($scope.item.scope.status, 1);
                        }
                        ;
                    });
                    $uibModalInstance.close();
                }

            };


    }else if(items.method=="modify"){
        $scope.rfid_reader_id = "";
        $scope.func_type = items.data.func_type;
        $scope.status = items.data.status;
        $scope.serial_number = items.data.serial_number;
        $scope.description = items.data.description;
        $scope.storage_names = items.data.storage_names;
        $scope.ip_address=items.data.ip_address;
        $scope.live_address=items.data.live_address;
        $scope.ok = function(){
            $scope.pk = items.data.id;
            var query_url = url_junction.getDict({
                rfid_reader_id:$scope.rfid_reader_id,
                func_type:$scope.func_type,
                status:$scope.status,
                serial_number:$scope.serial_number,
                description:$scope.description,
                storage_names:$scope.storage_names,
                ip_address:$scope.ip_address,
                live_address:$scope.live_address
            });
            $http.put(baseUrl+"/api/1/camera/"+$scope.item.data.id+"/",query_url).success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search($scope.item.scope.status, 1);
                }else{
                    // alert(data.description)
                }
            });
            $uibModalInstance.close();
        };
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/1/camera/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search($scope.item.scope.status, 1);
                }
            });
            $uibModalInstance.close();
        };
    }
});

app.controller("ModalContent",function($scope,$uibModalInstance,$http,items,baseUrl){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    if(items.method=="add"){
        $scope.rfid_card = "-1";
        $scope.rfid_type = "0";
        $scope.status = items.scope.status;
        $http.get(baseUrl+"/api/1/card/?status=0").success(function(data){
            $scope.rfid_cards = data;
        }).error(function(){
            console.log("有错误！")
        });
        $scope.ok = function(){
            $http.post(baseUrl+"/api/1/content/",{"rfid_card_id":$scope.rfid_card,"rfid_type":$scope.rfid_type,"status":$scope.status}).success(function(data){
                if(data.code==200){
                    items.scope.submit_search($scope.item.scope.status, 1);
                    items.scope.refresh_stat();
                }
            });
            $uibModalInstance.close();
        };
    }else if(items.method=="modify"){
        $scope.rfid_card = items.data.rfid_card.id+"";
        $scope.rfid_type = items.data.rfid_type;
        $scope.status = items.data.status;
        $http.get(baseUrl+"/api/1/card/?status=0").success(function(data){
            $scope.rfid_cards = data;
            var exist = false;
            for(var item in data.data){
                if(data.data[item].id==items.data.rfid_card.id){
                    exist = true;
                }
            }
            if(!exist){
                $scope.rfid_cards.data.push(items.data.rfid_card)
            }
        }).error(function(){
            console.log("有错误！")
        });
        $scope.ok = function(){
            $http.put(baseUrl+"/api/1/content/"+$scope.item.data.id+"/",{"rfid_card_id":$scope.rfid_card,"rfid_type":$scope.rfid_type,"status":$scope.status}).success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search($scope.item.scope.status, 1);
                    items.scope.refresh_stat();
                }
            });
            $uibModalInstance.close();
        };
    }else if(items.method=="delete"){
        //$scope.
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/1/content/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search($scope.item.scope.status, 1);
                    items.scope.refresh_stat();
                }
            });
            $uibModalInstance.close();
        };
    }
});


app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance,$http,items,baseUrl) {
    baseUrl = baseUrl.getUrl();
    console.log(items)
    $scope.item = items;
    $scope.status = items.data.status;
    $scope.choice={};
    function QueryUrl(input){
        var output = ''
        if(input.serial_number){
            if(output){
                output += "&serial_number="+input.serial_number
            }else{
                output += "?serial_number="+input.serial_number
            }
        }
        if(input.status!=-1 && input.status){
            if(output){
                output += "&status="+input.status
            }else{
                output += "?status="+input.status
            }
        }
        return output
    }
    if(items.method!="delete"&&items.method!="replace"){
        for(var item in items.choice.data.status){
            $scope.choice[item] = items.choice.data.status[item];
        }
    }
    if(items.method=="modify"){
        $scope.serial_number = items.data.serial_number;
    }
    $scope.ok = function(){
        if($scope.item.method=="add"){
            if($scope.serial_number!=undefined){
            $http.post(baseUrl + "/api/1/card/", {"serial_number":$scope.serial_number, "status":$scope.status}).success(function(data){
                items.scope.submit_search();
            }).error(function(){
                alert("有点故障！")
            })
            $uibModalInstance.close();
            }
        }else if($scope.item.method=="delete"){
            $http.delete(baseUrl+"/api/1/card/"+ $scope.item.data.id+"/").success(function(data){
                items.scope.submit_search();
            }).error(function(){
                alert("有点故障！")
            })
            $uibModalInstance.close();
        }else if($scope.item.method=="modify"){
            $http.put(baseUrl+"/api/1/card/"+$scope.item.data.id+"/",{"serial_number":$scope.serial_number, "status":$scope.status}).success(function(data){
                items.scope.submit_search();
            }).error(function(){
                alert("有点故障！")
            })
            $uibModalInstance.close();
        }else if($scope.item.method=="replace"){
            if($scope.serial_number!=undefined){
               $http.put(baseUrl+"/api/1/card/replace/"+$scope.item.data.id+"/",{"serial_number":$scope.serial_number}).success(function(data){
                   items.scope.submit_search();
               }).error(function(){
                 alert("有点故障!");
             })
                $uibModalInstance.close();
            }
        }

    };
     $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
     };
});

app.controller("ModalEventlog",function($scope,$uibModalInstance,$http,items,baseUrl){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.id=$scope.item.data.id;
    $scope.selectValue=$scope.item.data.handle_result;

    // 状态
     $http.get(baseUrl+"/api/1/common/choices/").success(function(data){
        var res=data.data.eventlog.handle_result;
         $scope.modalSelect=res;
    }).error(function(){
        alert("有点故障！")
    })
    $scope.ok=function(){
        // console.log("<==textarea===>"+$scope.modaldesc);
        // console.log("<====select===>"+$scope.selectValue);

        $http.post(baseUrl+"/api/1/eventhandlelog/",{"event_log_id":$scope.id,"handle_result":$scope.selectValue, "description":$scope.modaldesc}).success(function(data){
           items.data.handle_result=$scope.selectValue;
            items.data.handle_result_display=data.data.handle_result_display;
            items.data.handle_description=data.data.description;
        }).error(function(){
            alert("有点故障！")
        })
        $uibModalInstance.close();
    }
     $scope.cancel=function(){
         console.log("<==quxiao yunxing===>");
         $uibModalInstance.dismiss();
     }
})