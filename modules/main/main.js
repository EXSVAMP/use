angular.module("RDash",['ui.bootstrap','ui.router','ngCookies','ngDialog','cgBusy','truncate','ui.select','ngSanitize','ngAnimate']);
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

app.service("baseUrl",function(){
    var url="http://211.152.46.42:9011";
    return {
        getUrl:function(){
            return url;
        }
    }
})
app.controller("MasterCtrl",function($scope, $cookieStore, $http, baseUrl, ngDialog, $rootScope){
   // $rootScope.stateEdit = [
   //      { name: '未使用', flag: 0},
   //      { name: '正在使用', flag: 1},
   //      { name: '损坏', flag: 2},
   //      { name: '已删除停用', flag:3}
   //  ];
	var baseUrl = baseUrl.getUrl();
    $rootScope.$scopeMasterCtrl = $scope;
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

    $rootScope.custom_pop = function(custom_com_pop_size,custom_com_pop_title,custom_com_pop_title_icon,custom_com_pop_m_content,custom_com_pop_ok_func){
        //$rootScope.ngDialog = ngDialog;
        $rootScope.custom_com_pop_title = custom_com_pop_title;
        if(custom_com_pop_size){
            var w = custom_com_pop_size.w;
            var h = custom_com_pop_size.h;
            $rootScope.custom_com_pop_size = "width:"+w+"px;height:"+h+"px;margin-top:-"+(h/2)+"px;margin-left:-"+(w/2)+"px";
            $rootScope.custom_com_pop_frame = "width:"+w+"px;height:"+h+"px;";
        }
        //$rootScope.custom_com_mask_show = "custom-com-mask-show";
        $rootScope.custom_com_pop_show = "custom-com-pop-show";
        if(custom_com_pop_title_icon){
            $rootScope.custom_com_pop_title_icon = "background:url("+custom_com_pop_title_icon+");";

        }else
            $rootScope.custom_com_pop_title_icon = "background:none;";

        $rootScope.custom_com_pop_m_content = custom_com_pop_m_content;

        $rootScope.custom_com_pop_cancel = function(){
            //$rootScope.custom_com_mask_show = "";
            $rootScope.custom_com_pop_show = "";
            ngDialog.close();
        }

        $rootScope.custom_com_pop_ok = function(){
            custom_com_pop_ok_func();
        }

        ngDialog.open({
            template:"commonCustomPop.html",
            //className:'ngDialog-theme-default',
            closeByEscape: false,
            closeByDocument:false,
            preCloseCallback: function() {
                //$rootScope.custom_com_mask_show = "";
                $rootScope.custom_com_pop_show = "";
            }
        })

        //if(defaultSelVal){ 
           //$rootScope.$scope2.stateEdit.flag = $rootScope.$scope2.stateEdit[2];
           //$rootScope.defaultSelVal = defaultSelVal;
        //}
    }

})
app.controller("sideBarCtrl",function($scope, $rootScope){

     $scope.open={
         open1:false,
         open2:false,
         open3:false
         
     }
    $scope.openSide=function(status){
        console.log("123");
        if(status==1){
            $scope.open.open1=!$scope.open.open1;
            $scope.open.open2=false;
            $scope.open.open3=false;
        };
        if(status==2){
            $scope.open.open2=!$scope.open.open2;
            $scope.open.open1=false;
            $scope.open.open3=false;
        };
        if(status==3){
            $scope.open.open3=!$scope.open.open3;
            $scope.open.open1=false;
            $scope.open.open2=false;
        }

    };

});

app.controller("AlertCtrl",function($scope, $rootScope){
	 $scope.alert_info = $rootScope.alert_info;
})

app.controller("CustomPopCtrl",function($scope, $rootScope){
    //alert("12345");
     $scope.custom_com_pop_title = $rootScope.custom_com_pop_title;
     $scope.custom_com_pop_m_content = $rootScope.custom_com_pop_m_content;
     $scope.custom_com_pop_size = $rootScope.custom_com_pop_size;
     $scope.custom_com_pop_frame = $rootScope.custom_com_pop_frame;
     $scope.custom_com_pop_show = $rootScope.custom_com_pop_show;
     $scope.custom_com_pop_title_icon = $rootScope.custom_com_pop_title_icon;
     $rootScope.$scope2 = $scope;
     $scope.stateEdit = [
        { name: '未使用', flag: 0},
        { name: '正在使用', flag: 1},
        { name: '损坏', flag: 2},
        { name: '已删除停用', flag:3}
    ];
    $rootScope.$scope2.stateEdit.flag = $rootScope.$scope2.stateEdit[$rootScope.defaultSelVal];
    $rootScope.$scope2.edit_serial = $rootScope.defaultSerialVal;

    
})

app.directive('myDirective', function ($rootScope) {

    alert($rootScope.custom_com_pop_m_content);
    return { 
        restrict: 'ECMA',
        template: $rootScope.custom_com_pop_m_content, 
  
 　　replace: false, 
  
 　　transclude: false,
    scope:false
    };
})