angular.module("RDash",['ui.bootstrap','ui.router','ngCookies','ngDialog','cgBusy','truncate','ui.select','ngSanitize','ngAnimate']);
require('router');
require('interceptor/captainlnterceptor');
require('common/service/listService');
require('common/service/utils');
require('common/service/params');




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
	$scope.header_com_mask = false;
	$scope.header_com_logout_pop = false;
	$scope.header_com_repass_pop = false;
    $scope.header_com_mask_show = "";
    $scope.header_com_logout_pop_show = "";
    $scope.header_com_repass_pop_show = "";
	$scope.repass_test=false;
    $scope.repass_new=false;
    $scope.repass_reconfirm=false;
	$scope.btn_ok_fail = "btn_ok_fail";
	$scope.header_username = $cookieStore.get("iotcloud-token").loginName;
	$scope.old_password_len = $cookieStore.get("passlen");
	//user logout
	$scope.logout = function(){
		$scope.header_com_mask = true;
		$scope.header_com_logout_pop = true;
        $scope.header_com_mask_show = "header-com-mask-show";
        $scope.header_com_logout_pop_show = "header-com-logout-pop-show";
	};

	$scope.logout_ok = function(){
        $http.get(baseUrl.getUrl()+"/api/1/user/logout/").success(function(data){
            if(data.code=="200"){
                window.location.href = "/login.html"
            }else
            	$rootScope.alert_pop("退出出错:"+data.description);
        });
    };

    $scope.logout_cancel = function(){
		$scope.header_com_mask = false;
		$scope.header_com_logout_pop = false;
        $scope.header_com_mask_show = "";
        $scope.header_com_logout_pop_show = "";
	};

	$scope.repassword = function(){
        //ngDialog.open({ template: 'repassword.html',//模式对话框内容为repassword.html  
            //scope:$scope //将scope传给repassword.html,以便显示地址详细信息  
        //}); 
        document.getElementById("repass_form").reset(); 
        $scope.repass_test=false;
        $scope.repass_new=false;
        $scope.repass_reconfirm=false;
		$scope.btn_ok_fail = "btn_ok_fail";
        $scope.header_com_mask = true;
		$scope.header_com_repass_pop = true;
        $scope.header_com_mask_show = "header-com-mask-show";
        $scope.header_com_repass_pop_show = "header-com-repass-pop-show";
    };

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
   
    $scope.repass_ok = function(){
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
                	$rootScope.alert_pop("密码修改出错:"+res.description);
            })
    	}
       
    };

    $scope.repass_cancel = function(){
		$scope.header_com_mask = false;
		$scope.header_com_repass_pop = false;
        $scope.header_com_mask_show = "";
        $scope.header_com_repass_pop_show = "";
	};
  
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


app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance,$http,items,baseUrl) {
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
                    items.scope.submit_search();
                }
            }).error(function(){
                alert("error")
            });
            $uibModalInstance.close();
        };
    }
});

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

