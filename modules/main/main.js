angular.module("RDash",['ui.bootstrap','ui.router','ngCookies','ngDialog','cgBusy','truncate']);
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
            	alert_pop("退出出错:"+data.description);
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
                	alert_pop("密码修改出错:"+res.description);
            })
    	}
       
    };

    $scope.repass_cancel = function(){
		$scope.header_com_mask = false;
		$scope.header_com_repass_pop = false;
        $scope.header_com_mask_show = "";
        $scope.header_com_repass_pop_show = "";
	};
  
    function alert_pop(alert_info){
        $rootScope.alert_info = alert_info;
    	ngDialog.open({
            template:"alert.html",
            //className:'ngDialog-theme-default',
            preCloseCallback: function() {
               
            }
        })
    }
})

app.controller("AlertCtrl",function($scope, $rootScope){
	 $scope.alert_info = $rootScope.alert_info;
})