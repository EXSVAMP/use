angular.module("RDash",['ui.bootstrap','ui.router','ngCookies','ngDialog','cgBusy','truncate','ui.select','ngSanitize','ngAnimate']);
require('router');
require('interceptor/captainlnterceptor');
require('common/service/listService');
require('common/service/popService');
require('common/service/utils');
require('common/service/params');
require('common/filters');




/**
 * Master Controller
 */
var app = angular.module('RDash');
app.filter("opis_writed",function(){
  return function(input){
    if(input == true)
      input = "是";
    else if(!input){
      input = "否";
    }
    return input;
  };
});
app.filter("user_active",function(){
  return function(input){
    if(input == true)
      input = "激活";
    else if(!input){
      input = "未激活";
    }
    return input;
  };
});
app.filter("poll_state",function(){
  return function(input){
    if(input == 0)
      input = "未执行";
    else if(input == 1){
      input = "正在执行";
    }else if(input == 2){
      input = "已执行";
    }else if(input == 3){
      input = "执行异常";
    }
    return input;
  };
});

app.config(function($httpProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

app.service("baseUrl",function(){
    var url="http://211.152.46.42:9011";
    return {
        getUrl:function(){
            return url;
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


app.controller("MasterCtrl",function($scope, $cookieStore, $http, baseUrl, ngDialog, $rootScope){
    var baseUrl = baseUrl.getUrl();

     $rootScope.alert_pop = function(alert_info){
        $rootScope.alert_info = alert_info;
        ngDialog.open({
            template:"alert.html",
            //className:'ngDialog-theme-default',
            preCloseCallback: function() {
               
            }
        })
    }

})

app.controller("headerCtrl",function($scope, $cookieStore, $http, $uibModal, baseUrl, ngDialog, $rootScope){
	var baseUrl = baseUrl.getUrl();
	$scope.header_username = $cookieStore.get("iotcloud-token").loginName;
	$scope.old_password_len = $cookieStore.get("passlen");

    $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalHeader',
            templateUrl: "myModalContentHeader.html",
            size: size,
            resolve: {
                items: function () {
                    if(method=="delete"){
                        return {
                            title:"退出IOT智能仓储系统",
                            method:"delete",
                            scope:$scope
                        }
                    }else{
                        return {
                            title:"修改密码",
                            method:"modify",
                            scope:$scope
                        }
                    }
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function(){});
    };
});

app.controller("ModalHeader", function($scope,$cookieStore, $uibModalInstance,$http,items,baseUrl,url_junction,ngDialog){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.isDel = false;
    if($scope.item.method == "delete")
        $scope.isDel = true;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    
    if(items.method=="modify"){
        //document.getElementById("repass_form").reset(); 
        $scope.repass_test=false;
        $scope.repass_new=false;
        $scope.repass_reconfirm=false;
        $scope.btn_ok_fail = "btn_ok_fail";
        $scope.repass_click = function(){
            $scope.repass_test=false;
            document.getElementById('repass_old_password').focus();
        }

        $scope.re_click = function(){
            $scope.repass_new=false;
            document.getElementById('repass_re_password').focus();
        }

        $scope.reconfirm_click = function(){
            $scope.repass_reconfirm=false;
            document.getElementById('repass_reconfirm_password').focus();
        }

        $scope.re_in_click = function(){
            $scope.repass_new=false;
            getRepassInputsVal();
        }

        $scope.reconfirm_in_click = function(){
            $scope.repass_reconfirm=false;
            getRepassInputsVal();
        }

        $scope.repass_in_click = function(){
            $scope.repass_test=false;
            getRepassInputsVal();
        }

        function getRepassInputsVal(){
            var old_pass = $scope.repass_old_password;
            var new_pass = $scope.repass_re_password;
            var confirm_pass = $scope.repass_reconfirm_password;
            if(old_pass && new_pass && confirm_pass == new_pass){
                $scope.btn_ok_fail = "";
            }else
                $scope.btn_ok_fail = "btn_ok_fail";
        }

        $scope.repass_in_blur = function(){
            $scope.repass_test=true;
            getRepassInputsVal();
        }

        $scope.re_in_blur = function(){
            $scope.repass_new=true;
            getRepassInputsVal();
        }

        $scope.reconfirm_in_blur = function(){
            $scope.repass_reconfirm=true;
            getRepassInputsVal();
        }

        $scope.ok = function(){
            if($scope.btn_ok_fail == ""){
                var data = {
                    username: $cookieStore.get("iotcloud-token").loginName,
                    old_password: $scope.repass_old_password,
                    password: $scope.repass_re_password,
                    re_password: $scope.repass_reconfirm_password
                };
                $http.post(baseUrl+"/api/1/user/repassword/", data)
                    .success(function(res){
                        if(res.code=='200'){
                            window.location.href = "/login.html"
                        }else
                            //$rootScope.alert_pop("密码修改出错:"+res.description);
                            ngDialog.open({
                                template: '<p style=\"text-align: center\">密码修改出错:'+res.description+'</p>',
                                plain: true
                            });
                })
            }
            $uibModalInstance.close();
        };
    
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.get(baseUrl+"/api/1/user/logout/").success(function(data){
                if(data.code=="200"){
                    window.location.href = "/login.html"
                }
            }).error(function(){
                 ngDialog.open({
                    template: '<p style=\"text-align: center\">退出出错:'+data.description+'</p>',
                    plain: true
                });
            });
            $uibModalInstance.close();
        };
    }

});

app.controller("sideBarCtrl",function($scope, $rootScope){

     $scope.open={
         open1:false,
         open2:false,
         open3:false,
         open4:false,
         
     }
    $scope.openSide=function(status){
        console.log("123");
        if(status==1){
            $scope.open.open1=!$scope.open.open1;
            $scope.open.open2=false;
            $scope.open.open3=false;
            $scope.open.open4=false;
        };
        if(status==2){
            $scope.open.open2=!$scope.open.open2;
            $scope.open.open1=false;
            $scope.open.open3=false;
            $scope.open.open4=false;
        };
        if(status==3){
            $scope.open.open3=!$scope.open.open3;
            $scope.open.open1=false;
            $scope.open.open2=false;
            $scope.open.open4=false;
        };
        if(status==4){
            $scope.open.open4=!$scope.open.open4;
            $scope.open.open1=false;
            $scope.open.open2=false;
            $scope.open.open3=false;
        }

    };

});

app.controller("AlertCtrl",function($scope, $rootScope){
	 $scope.alert_info = $rootScope.alert_info;
})


app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance,$http,ngDialog,items,baseUrl) {
    baseUrl = baseUrl.getUrl();
    console.log(items)
    $scope.item = items;
    $scope.status = items.data.status;
    $scope.choice={};
    $scope.status_disable = items.status_disable;
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
        //alert($scope.item.method);
        if($scope.item.method=="add"){
            //if($scope.serial_number!=undefined){
            if($scope.serial_number){
                $http.post(baseUrl + "/api/1/card/", {"serial_number":$scope.serial_number, "status":$scope.status}).success(function(data){
                    items.scope.submit_search();
                }).error(function(){
                    alert("有点故障！")
                })
                $uibModalInstance.close();
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">序列号不能为空</p>',
                    plain: true
                });
        }else if($scope.item.method=="delete"){
            $http.delete(baseUrl+"/api/1/card/"+ $scope.item.data.id+"/").success(function(data){
                items.scope.submit_search();
            }).error(function(){
                alert("有点故障！")
            })
            $uibModalInstance.close(); 
        }else if($scope.item.method=="modify"){
            if($scope.serial_number){
                $http.put(baseUrl+"/api/1/card/"+$scope.item.data.id+"/",{"serial_number":$scope.serial_number, "status":$scope.status}).success(function(data){
                    items.scope.submit_search();
                }).error(function(){
                    alert("有点故障！")
                })
                $uibModalInstance.close();
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">序列号不能为空</p>',
                    plain: true
                });
        }else if($scope.item.method=="replace"){
            if($scope.serial_number){
               $http.put(baseUrl+"/api/1/card/replace/"+$scope.item.data.id+"/",{"serial_number":$scope.serial_number}).success(function(data){
                    items.scope.submit_search();
               }).error(function(){
                 alert("有点故障!");
             })
                $uibModalInstance.close();
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">序列号不能为空</p>',
                    plain: true
                });
        }

    };
     $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
     };

});

app.controller("ModalCamera", function($scope,$uibModalInstance,$http,baseUrl,items,url_junction){
    baseUrl = baseUrl.getUrl();
    scope=items.scope;
    $scope.item=items;
    $scope.func_type_Items=scope.func_type_Items.slice(1);
    $scope.func_type=scope.func_type_Items.slice(1)[0].state;
    $scope.status_Items=scope.status_Items.slice(1);
    $scope.state=scope.status_Items.slice(1)[0].state;
    $scope.select_func_type=function(functype){
    $scope.func_type=functype;
    };
    $scope.select_status=function(state){
        $scope.state=state;
    };
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    if(items.method=="add"){
        $scope.modal_add_modify=true;
        $scope.modal_delete=false;
        $scope.rfid_reader_id = "-1";
        $scope.func_type = "100";
        $scope.status = "0";
        $scope.serial_number = "";
        $scope.description = "";
        $scope.storage_names = "";
        $scope.ip_address="";
        $scope.live_address="";
        $scope.ok=function(){
            var query_url = url_junction.getDict({
                func_type:$scope.func_type,
                status:$scope.state,
                serial_number:$scope.serial_number,
                description:$scope.description,
                storage_names:$scope.storage_names,
                ip_address:$scope.ip_address,
                live_address:$scope.live_address

            });
            if( $scope.serial_number!="") {
                $http.post(baseUrl + "/api/1/camera/", query_url).success(function (data) {
                    if (data.code == 200) {
                        items.scope.submit_search($scope.item.scope.status, 1);
                    }
                    ;
                });
                $uibModalInstance.close();
            }
        }

    }else if(items.method=="modify"){
        $scope.modal_add_modify=true;
        $scope.modal_delete=false;
        $scope.rfid_reader_id = "";
        $scope.func_type = items.data.func_type;
        $scope.state = items.data.status;
        $scope.serial_number = items.data.serial_number;
        $scope.description = items.data.description;
        $scope.storage_names = items.data.storage_names;
        $scope.ip_address=items.data.ip_address;
        $scope.live_address=items.data.live_address;
        $scope.ok = function(){
            $scope.pk = items.data.id;
            var query_url = {
                func_type:$scope.func_type,
                status:$scope.state,
                serial_number:$scope.serial_number,
                description:$scope.description,
                storage_names:$scope.storage_names,
                ip_address:$scope.ip_address,
                live_address:$scope.live_address
            };
            $http.put(baseUrl+"/api/1/camera/"+$scope.item.data.id+"/",query_url).success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search();
                }
            });
            $uibModalInstance.close();
        };

    }else if(items.method=="delete"){
        $scope.modal_add_modify=false;
        $scope.modal_delete=true;
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/1/camera/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search();
                }
            });
            $uibModalInstance.close();
        };

    }


});

app.controller("ModalStore",function($scope,$uibModalInstance,$http,items,baseUrl,url_junction){
    baseUrl = baseUrl.getUrl();
    $scope.params={};
    $scope.params.name="";
    $scope.params.address="";
    $scope.params.connect_username="";
    $scope.params.connect_info="";
    scope=items.scope;
    $scope.item=items;
    $scope.params.name=scope.params.name;
    $scope.params.address=scope.params.address;
    $scope.params.connect_username=scope.params.connect_username;
    $scope.params.connect_info=scope.params.connect_info;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    if(items.method=="edit"){
        $scope.ok=function(){
            var query_url = url_junction.getDict({
                name:$scope.params.name,
                address:$scope.params.address,
                connect_username:$scope.params.connect_username,
                connect_info:$scope.params.connect_info

            });
            if($scope.params.name!=undefined&&$scope.params.address!=undefined&&$scope.params.connect_username!=undefined&&$scope.params.connect_info!=undefined){
              $http.put(baseUrl+"/api/1/storehouse/self/",query_url).success(function (data) {
                  if(data.code=="200"){
                      scope.searchStore();
                      $uibModalInstance.close();
                  }
              })

            }
      }
    }

})

app.controller("ModalContent",function($scope,$uibModalInstance,$http,items,baseUrl){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.changeType = function(data){
        $scope.rfid_card = data.id;
        console.log("rfid_card:"+$scope.crfid_card);
    }
    $scope.changeStatus = function(data){
        $scope.currentSelTab = data.key;
        console.log("currentSelTab:"+$scope.currentSelTab);
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
        $scope.rfid_type_Items = items.scope.rfid_type_Items;
        $scope.rfid_type_Items = $scope.rfid_type_Items.slice(0,$scope.rfid_type_Items.length-1);
        $scope.statusInfo = items.scope.statusInfo;
        $scope.rfid_card = items.data.rfid_card.id+"";
        $scope.rfid_type = items.data.rfid_type;
        $scope.currentSelTab = items.data.status;
        for(var i=0; i< $scope.rfid_type_Items.length; i++){
            if(items.scope.rfid_type_Items[i].id == $scope.rfid_type){
                $scope.type = items.scope.rfid_type_Items[i];
                break;
            }
        }
        for(statusItem in items.scope.statusInfo){
            if(statusItem == $scope.currentSelTab){
                //alert(statusItem+","+items.scope.statusInfo[statusItem]);
                $scope.status = {key:statusItem,value:items.scope.statusInfo[statusItem]};
                //$scope.status = {key:"200",value: "入库监视"};
                break;
            }
        }

        //$scope.type = $scope.rfid_type;
        //$scope.status = $scope.currentSelTab;
        //console.log("status:"+$scope.statusInfo["100"]+",rfid_card:"+$scope.rfid_card+",rfid_type:"+$scope.rfid_type);
        // $http.get(baseUrl+"/api/1/card/?status=0").success(function(data){
        //     $scope.rfid_cards = data;
        //     var exist = false;
        //     for(var item in data.data){
        //         if(data.data[item].id==items.data.rfid_card.id){
        //             exist = true;
        //         }
        //     }
        //     if(!exist){
        //         $scope.rfid_cards.data.push(items.data.rfid_card)
        //     }
        // }).error(function(){
        //     console.log("有错误！")
        // });
        $scope.ok = function(){
            $http.put(baseUrl+"/api/1/content/"+$scope.item.data.id+"/",{"rfid_card_id":$scope.rfid_card,"rfid_type":$scope.rfid_type,"status":$scope.currentSelTab}).success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search($scope.item.scope.currentSelTab, 1);
                    items.scope.refresh_stat(true);
                }
            });
            $uibModalInstance.close();
        };
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/1/content/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    $scope.item.scope.submit_search($scope.item.scope.currentSelTab, 1);
                    $scope.item.scope.refresh_stat(true);
                }
            });
            $uibModalInstance.close();
        };
    }
});

app.controller("ModalReader", function($scope,$uibModalInstance,$http,items,baseUrl,url_junction,ngDialog){
    baseUrl = baseUrl.getUrl();
    $scope.choice = {func_type:{},status:{}};
    $scope.item = items;
    $scope.func_type = "100";
    $scope.status = "0";
    $scope.description = "";
    $scope.serial_number = "";
    $scope.storage_names = "";
    $scope.ip_address="";
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    $scope.func_typeSelFunc = function(data){
        $scope.func_type = data.key;
    }
    $scope.statusSelFunc = function(data){
        $scope.status = data.key;
    }
    if(items.method=="add"){
        var choiceStr = JSON.stringify(items.choice);
        var choiceArr = JSON.parse(choiceStr);
        $scope.choice = choiceArr;
        for(var temp in choiceArr.func_type){
            if(temp == -1){
                delete choiceArr.func_type[temp];
                break;
            }
        } 
       for(var temp in choiceArr.status){
            if(temp == -1){
                delete choiceArr.status[temp];
                break;
            }
        } 
        //console.log(JSON.stringify($scope.choice));
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
                    items.scope.submit_search();
                };
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
         }else
            ngDialog.open({
                template: '<p style=\"text-align: center\">序列号不能为空</p>',
                plain: true
            });

        };
    }else if(items.method=="modify"){
        //$scope.choice = items.choice;
        var choiceStr = JSON.stringify(items.choice);
        var choiceArr = JSON.parse(choiceStr);
        $scope.choice = choiceArr;
        for(var temp in choiceArr.func_type){
            if(temp == -1){
                delete choiceArr.func_type[temp];
                break;
            }
        } 
       for(var temp in choiceArr.status){
            if(temp == -1){
                delete choiceArr.status[temp];
                break;
            }
        }
        $scope.func_type = items.data.func_type;
        $scope.status = items.data.status;
        $scope.serial_number = items.data.serial_number;
        $scope.description = items.data.description;
        $scope.ip_address=items.data.ip_address;
        $scope.func_typeSel = {key:items.data.func_type,value:items.data.func_type_display};
        $scope.statusSel = {key:items.data.status,value:items.data.status_display};
        $scope.ok = function(){
            if($scope.serial_number){
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
                        items.scope.submit_search();
                    }else{
                        alert(data.description)
                    }
                }).error(function(){
                    alert("error")
                });
                $uibModalInstance.close();
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">序列号不能为空</p>',
                    plain: true
                });
        };
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/1/reader/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search();
                }
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
        };
    }
});

app.controller("ModalUser", function($scope,$uibModalInstance,$http,items,baseUrl,url_junction,ngDialog){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.role = 4;
    $scope.status = 0;
    $scope.username = "";
    $scope.roleList = items.scope.roleList;
    $scope.statusList = items.scope.statusList;
    $scope.roleList = $scope.roleList.slice(0,$scope.roleList.length-1);
    $scope.statusList = items.scope.statusList.slice(0,$scope.statusList.length-1);
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    $scope.roleSel = function(data){
        $scope.role = data.key;
    }
    $scope.statusSel = function(data){
        //$scope.status = data.key;
        if(data.key){
            $scope.status = "1";
        }
        else{
            $scope.status = "0";
        }
    }
    if(items.method=="add"){
        $scope.disAlter = false;
        $scope.role2 = {key:4,value:"其它"};
        $scope.status2 = {key:false,value:"未激活"};
        $scope.ok = function(){
          if($scope.username){
            if($scope.password){
                if($scope.password == $scope.re_password){
                    var query_url = url_junction.getDict({
                        user_role_type:$scope.role,
                        username:$scope.username,
                        password:$scope.password,
                        re_password:$scope.re_password,
                        is_active:$scope.status
                    });
                    $http.post(baseUrl+"/api/1/user/",query_url).success(function(data){
                        if(data.code==200){
                            items.scope.submit_search();
                        };
                    }).error(function(){
                        alert("error")
                    });
                    $uibModalInstance.close();
                }else
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">确认密码与密码不一致</p>',
                        plain: true
                    });
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">密码不能为空</p>',
                    plain: true
                });
         }else
            ngDialog.open({
                template: '<p style=\"text-align: center\">用户名不能为空</p>',
                plain: true
            });

        };
    }else if(items.method=="modify"){
        $scope.disAlter = true;
        $scope.role2 = {key:items.data.user_role_type,value:items.data.get_user_role_type_display};
        $scope.role = items.data.user_role_type;
        var statusInfo = {};
        statusInfo.key = items.data.is_active;
        if(statusInfo.key){
            statusInfo.value = "激活";
            $scope.status = "1";
        }
        else{
            statusInfo.value = "未激活"; 
            $scope.status = "0";      
        }
        $scope.status2 = statusInfo;
        $scope.username = items.data.username;
        $scope.ok = function(){
            if($scope.username){ 
                $scope.pk = items.data.id;
                var query_url = url_junction.getDict({
                    user_role_type:$scope.role,
                    //username:$scope.username,
                    is_active:$scope.status
                });
                $http.put(baseUrl+"/api/1/user/"+$scope.item.data.id+"/",query_url).success(function(data){
                    if(data.code=="200"){
                        items.scope.submit_search();
                    }else{
                        alert(data.description)
                    }
                }).error(function(){
                    alert("error")
                });
                $uibModalInstance.close();
                    
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">用户名不能为空</p>',
                    plain: true
                });
        };
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/1/user/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search();
                }
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
        };
    }
});

app.controller("ModalPollinventory", function($scope,$uibModalInstance,$http,items,baseUrl,url_junction,ngDialog){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    if($scope.item.method == "info")
        $scope.item.title = "编号"+$scope.item.data.id+"检测结果";

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };

    if(items.method=="info"){
        $scope.emptyDataListShow = "";
        $scope.currentPageDataNum = 0;
        $scope.index = 1;
        $scope.number = 10;
        $scope.maxSize = 5;
        $scope.numbers = [10,20,30,40,50];
        $scope.order = {
            id: false,
            rfid_card:false,
            rfid_content:false,
            store_house:false
        };

        $scope.switch_order = function(key){
            $scope.order[key] = !$scope.order[key];
            $scope.submit_search()
        };

        $scope.setShowNum = function(data){
            $scope.number = data;
            $scope.index = 1;
            $scope.submit_search();
        }

        $scope.setPage = function (pageNo) {
            $scope.submit_search();
        };

        $scope.changePage = function(a){
            $scope.submit_search()
        };

        $scope.submit_search = function(){
            var order_str = "";
            for(var i in $scope.order){
                if($scope.order[i]){
                    if(order_str){
                        order_str += ','+i
                    }else{
                        order_str += i;
                    }
                }
            };
        
            var query_url = url_junction.getQuery({
                schedule_id:$scope.item.data.id,
                descent:order_str,
                number:$scope.number,
                index:$scope.index
            });
  
            $http.get(baseUrl + "/api/2/inventory/result"+query_url).success(function(data){
                if(data.code==200){
                    // $scope.dataList =  data.data;
                    // currentPageDataNum = $scope.dataList.length;
                    // $scope.bigTotalItems = data.pageinfo.total_number;
                    // $scope.total_page = data.pageinfo.total_page;
                    // if(currentPageDataNum == 0)
                    //   $scope.emptyDataListShow = "emptyDataListShow";
                    // else{
                    //   $scope.emptyDataListShow = "";
                    // }

                    $scope.dataList =  [
                        {id:001,store_house:"2301A",rfid_card:"e0331c",rfid_content:"31275f46f",event_log:"消失",schedule:"123"},
                        {id:002,store_house:"2301C",rfid_card:"e0331d",rfid_content:"31275f46e",event_log:"多余",schedule:"123"},
                        {id:003,store_house:"2301C",rfid_card:"e0331e",rfid_content:"31275f46r",event_log:"消失",schedule:"123"},
                        {id:004,store_house:"2301A",rfid_card:"e0331f",rfid_content:"31275f46t",event_log:"多余",schedule:"123"}
                    ];
                    currentPageDataNum = $scope.dataList.length;
                    $scope.bigTotalItems = 4;
                    $scope.total_page = 1;

                    // if(currentPageDataNum == 0)
                    //   $scope.emptyDataListShow = "emptyDataListShow";
                    // else{
                    //   $scope.emptyDataListShow = "";
                    // }
                }
            }).error(function(data,state){
                if(state == 403){
                    baseUrl.redirect()
                }
            });
        }

        $scope.submit_search();
       
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/2/inventory/list/date/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search();
                }
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
        };
    }
});

app.controller("ModalManualinventory", function($scope,$uibModalInstance,$http, $timeout,items,baseUrl,url_junction,ngDialog){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    if($scope.item.method == "info")
        $scope.item.title = "编号"+$scope.item.data.id+"检测报告";

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };

    if(items.method=="add"){

        $timeout(function(){
            $('.date-picker-add').datepicker({
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

        $scope.ok = function(){
            if($scope.startDate){
                $http.post(baseUrl + "/api/2/inventory/list/date", {"date":$scope.startDate}).success(function(data){
                    items.scope.submit_search();
                }).error(function(){
                    alert("有点故障！")
                })
                $uibModalInstance.close();
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">请选择检测时间</p>',
                    plain: true
                });
        }
    }else if(items.method=="modify"){

        $timeout(function(){
            $('.date-picker-add').datepicker({
                language: 'zh',
                orientation: "left",
                todayHighlight: true,
                autoclose:true,
                templates:{
                    leftArrow: '<i class="fa fa-angle-left"></i>',
                    rightArrow: '<i class="fa fa-angle-right"></i>'
                }
            });

            $scope.startDate = items.data.date;
        });

        $scope.ok = function(){
            if($scope.startDate){
                $http.put(baseUrl + "/api/2/inventory/list/date/"+items.data.id, {"date":$scope.startDate}).success(function(data){
                    items.scope.submit_search();
                }).error(function(){
                    alert("有点故障！")
                })
                $uibModalInstance.close();
            }else
                ngDialog.open({
                    template: '<p style=\"text-align: center\">请选择检测时间</p>',
                    plain: true
                });
        }
    }else if(items.method=="info"){
        $scope.emptyDataListShow = "";
        $scope.currentPageDataNum = 0;
        $scope.index = 1;
        $scope.number = 10;
        $scope.maxSize = 5;
        $scope.numbers = [10,20,30,40,50];
        $scope.order = {
            id: false,
            rfid_card:false,
            rfid_content:false,
            store_house:false
        };

        $scope.switch_order = function(key){
            $scope.order[key] = !$scope.order[key];
            $scope.submit_search()
        };

        $scope.setShowNum = function(data){
            $scope.number = data;
            $scope.index = 1;
            $scope.submit_search();
        }

        $scope.setPage = function (pageNo) {
            $scope.submit_search();
        };

        $scope.changePage = function(a){
            $scope.submit_search()
        };

        $scope.submit_search = function(){
            var order_str = "";
            for(var i in $scope.order){
                if($scope.order[i]){
                    if(order_str){
                        order_str += ','+i
                    }else{
                        order_str += i;
                    }
                }
            };
        
            var query_url = url_junction.getQuery({
                schedule_id:$scope.item.data.id,
                descent:order_str,
                number:$scope.number,
                index:$scope.index
            });
  
            $http.get(baseUrl + "/api/2/inventory/result"+query_url).success(function(data){
                if(data.code==200){
                    // $scope.dataList =  data.data;
                    // currentPageDataNum = $scope.dataList.length;
                    // $scope.bigTotalItems = data.pageinfo.total_number;
                    // $scope.total_page = data.pageinfo.total_page;
                    // if(currentPageDataNum == 0)
                    //   $scope.emptyDataListShow = "emptyDataListShow";
                    // else{
                    //   $scope.emptyDataListShow = "";
                    // }

                    $scope.dataList =  [
                        {id:001,store_house:"2301A",rfid_card:"e0331c",rfid_content:"31275f46f",event_log:"消失",schedule:"123"},
                        {id:002,store_house:"2301C",rfid_card:"e0331d",rfid_content:"31275f46e",event_log:"多余",schedule:"123"},
                        {id:003,store_house:"2301C",rfid_card:"e0331e",rfid_content:"31275f46r",event_log:"消失",schedule:"123"},
                        {id:004,store_house:"2301A",rfid_card:"e0331f",rfid_content:"31275f46t",event_log:"多余",schedule:"123"}
                    ];
                    currentPageDataNum = $scope.dataList.length;
                    $scope.bigTotalItems = 4;
                    $scope.total_page = 1;

                    // if(currentPageDataNum == 0)
                    //   $scope.emptyDataListShow = "emptyDataListShow";
                    // else{
                    //   $scope.emptyDataListShow = "";
                    // }
                }
            }).error(function(data,state){
                if(state == 403){
                    baseUrl.redirect()
                }
            });
        }

        $scope.submit_search();
       
    }else if(items.method=="delete"){
        $scope.ok = function(){
            $http.delete(baseUrl+"/api/2/inventory/list/date/"+$scope.item.data.id+"/").success(function(data){
                if(data.code=="200"){
                    items.scope.submit_search();
                }
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
        };
    }
});

// app.directive('datetimez', function() {
//     return {
//         require: '?ngModel',
//         restrict : 'A',
//         scope:{
//             ngModel: '='
//         },
//         link : function(scope, element, attr,ngModel) {
//             console.log("188888:"+ngModel.$viewValue);
//             // Specify how UI should be updated
//             ngModel.$render = function() {
//                 element.val(ngModel.$viewValue || '');
//             };
//             // Listen for change events to enable binding
//             //element.on('blur keyup change', function() {
//             element.on('blur keyup change mouseout click', function() {
//                 //console.log("1:"+ngModel.$viewValue);
//                 //console.log(element.val());
//                 //console.log(element.html());
//                 //console.log(element.attr("type"));
//                 scope.$apply(read);
//                 $("#search-btn").on('mouseenter', function() {
//                     scope.$apply(read);
//                 });
//             });
//             read(); // initialize
//             // Write data to the model
//             function read() {
//                 if(element.val()){
//                      //console.log($(".minute.active").html());
//                 var minuteSel = $(".minute.active").html();
//                 minuteSel = element.val().split(" ")[0]+" "+minuteSel;
//                 console.log("minuteSel:"+minuteSel);
//                 element.val(minuteSel);
//                 }
//                 var val = element.val();
//                 console.log("minuteSel222:"+val);
//                 ngModel.$setViewValue(val);
//                 //console.log("2:"+val);
//             }
            
//         }
//     }

// });

$.fn.datepicker.dates['zh'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
    meridiem: ["上午", "下午"],
    //suffix:      ["st", "nd", "rd", "th"],
    today: "今天"
};

$.fn.datetimepicker.dates['zh'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
    meridiem: ["上午", "下午"],
    //suffix:      ["st", "nd", "rd", "th"],
    today: "今天"
};