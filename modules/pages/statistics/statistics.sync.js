var app = angular.module('RDash');
app.register.controller("statisticsCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope) {
	//console.log("Test app.register.controller");
	var urlBase = baseUrl.getUrl();

	$scope.rfid_total = 0;
	$scope.rfid_broken = 0;
	$scope.rfid_unuse = 0;
	$scope.rfid_replaced = 0;
	$scope.rfid_deleted = 0;
	$scope.rfid_using = 0;
	$scope.rfid_using_ratio = "0%";
	$scope.rfid_broken_ratio = "0%";
	$scope.rfid_unuse_ratio = "0%";
	$scope.rfid_replaced_ratio = "0%";
	$scope.rfid_deleted_ratio = "0%";
	$scope.toDecimal = function(x,y) {              
		var f = parseFloat(x);              
		if (isNaN(f)) {   
            return false;              
		}   
		var f2 = parseFloat(y);             
		if (isNaN(f2)) {   
            return false;              
		}              
		var f = Math.round(x*100000)/(y*100000); 
		var s2 = "0%";
		var isHalf = false;
		if(f > 0){             
			var s = f.toString();              
			var rs = s.indexOf('.');              
			if (rs < 0) {   
				rs = s.length;                  
				s += '.';   
			}              
			while (s.length <= rs + 5) {   
        		s += '0';              
			} 
			//console.log(s);             
			var s2 = parseFloat(s).toFixed(5);
			s2 = s2.toString();
			//console.log(s2);
			if(s2.indexOf("0.") >= 0){
				var s3 = s2.substring(s2.indexOf("0.")+2,s2.indexOf("0.")+4);
				s3 = s3.replace(/(^0)/,"");
				s2 = s3+"."+s2.substring(s2.indexOf("0.")+4);
				s2 += "%";
				if(parseFloat(s3) >= 50)
					isHalf = true;
			}
			//console.log(s2);
			//console.log(parseFloat(s2)*100);
		}

		return {s2:s2,isHalf:isHalf};   
	}
  	$scope.getRFIDCount = function(){
  		$http.get(baseUrl.getUrl() + "/api/2/count/rfidcard").success(function(data){
      		if(data.code == 200){
      			var dataTemp = data.data;
      			$scope.rfid_total = dataTemp.total;
      			$scope.rfid_total_0 = $scope.rfid_total;
      			if($scope.rfid_total == 0){
  					$scope.rfid_total_0 = 1;
  				}
  				$scope.rfid_broken = dataTemp.broken;
  				$scope.rfid_unuse = dataTemp.unuse;
  				$scope.rfid_replaced = dataTemp.replaced;
  				$scope.rfid_deleted = dataTemp.deleted;
  				$scope.rfid_using = dataTemp.using;

  				var rfid_using_ratio_info = $scope.toDecimal(dataTemp.using,dataTemp.total);
  				$scope.rfid_using_ratio = rfid_using_ratio_info.s2;
  				$scope.using_half = rfid_using_ratio_info.isHalf;
  				// if(!rfid_using_ratio_info.isHalf){
  				// 	$scope.statistics_show_label_right_using = "statistics-show-label-right";
  				// }

  				var rfid_broken_ratio_info = $scope.toDecimal(dataTemp.broken,dataTemp.total);
  				$scope.rfid_broken_ratio = rfid_broken_ratio_info.s2;
  				$scope.broken_half = rfid_broken_ratio_info.isHalf;
  				// if(!rfid_broken_ratio_info.isHalf){
  				// 	$scope.statistics_show_label_right_broken = "statistics-show-label-right";
  				// }

				var rfid_unuse_ratio_info = $scope.toDecimal(dataTemp.unuse,dataTemp.total);
  				$scope.rfid_unuse_ratio = rfid_unuse_ratio_info.s2;
  				$scope.unuse_half = rfid_unuse_ratio_info.isHalf;
  				// if(!rfid_unuse_ratio_info.isHalf){
  				// 	$scope.statistics_show_label_right_unuse = "statistics-show-label-right";
  				// }
				
				var rfid_replaced_ratio_info = $scope.toDecimal(dataTemp.replaced,dataTemp.total);
  				$scope.rfid_replaced_ratio = rfid_replaced_ratio_info.s2;
  				$scope.replaced_half = rfid_replaced_ratio_info.isHalf;
  				// if(!rfid_replaced_ratio_info.isHalf){
  				// 	$scope.statistics_show_label_right_replaced = "statistics-show-label-right";
  				// }

				var rfid_deleted_ratio_info = $scope.toDecimal(dataTemp.deleted,dataTemp.total);
				$scope.rfid_deleted_ratio = rfid_deleted_ratio_info.s2;
				$scope.deleted_half = rfid_deleted_ratio_info.isHalf;
				//console.log(rfid_deleted_ratio_info.isHalf);
				// if(!rfid_deleted_ratio_info.isHalf){
  				//$scope.statistics_show_label_right_deleted = "statistics-show-label-right";
  		// 		}
      		}
    	}).error(function(data,state){
      	if(state == 403){
        	baseUrl.redirect()
      	}
    });
  }

  $scope.getRFIDCount();

  $scope.getRFIDContentCount = function(){
  		$http.get(baseUrl.getUrl() + "/api/2/count/rfidcontent").success(function(data){
      		if(data.code == 200){
      			var dataTemp = data.data;
      			$scope.rfidcont_total = dataTemp.total;
      			$scope.rfidcont_total_0 = $scope.rfidcont_total;
      			if($scope.rfidcont_total == 0){
  					$scope.rfidcont_total_0 = 1;
  				}
  				$scope.rfidcont_finish_out_repertory = dataTemp.finish_out_repertory;
  				$scope.rfidcont_out_repertory = dataTemp.out_repertory;
  				$scope.rfidcont_in_monitor = dataTemp.in_monitor;
  				$scope.rfidcont_deleted = dataTemp.deleted;
  				$scope.rfidcont_to_be_repertory = dataTemp.to_be_repertory;
  				$scope.rfidcont_to_be_out_repertory = dataTemp.to_be_out_repertory;
  				
      		}
    	}).error(function(data,state){
      	if(state == 403){
        	baseUrl.redirect()
      	}
    });
  }

  $scope.getRFIDContentCount();

  $scope.getRFIDAlarm = function(){
  		$http.get(baseUrl.getUrl() + "/api/2/count/rfidalarm").success(function(data){
      		if(data.code == 200){
      			var dataTemp = data.data;
      			$scope.rfidalarm_total = dataTemp.total;
      			$scope.rfidalarm_total_0 = $scope.rfidalarm_total;
      			if($scope.rfidalarm_total == 0){
  					$scope.rfidalarm_total_0 = 1;
  				}
  				$scope.rfidalarm_yesterday = dataTemp.yesterday;
  				$scope.rfidalarm_last_week = dataTemp.last_week;
  				$scope.rfidalarm_last_month = dataTemp.last_month; 				
      		}
    	}).error(function(data,state){
      	if(state == 403){
        	baseUrl.redirect()
      	}
    });
  }

  $scope.getRFIDAlarm();

  $scope.getRFIDCamera = function(){
  		$http.get(baseUrl.getUrl() + "/api/2/count/rfidcamera").success(function(data){
      		if(data.code == 200){
      			var dataTemp = data.data;
      			$scope.rfidcamera_total = dataTemp.total;

      			var outin_storage = dataTemp.outin_storage;
      			$scope.outin_storage_total = outin_storage.total;
      			$scope.outin_storage_total_0 = $scope.outin_storage_total;
      			if($scope.outin_storage_total == 0){
  					$scope.outin_storage_total_0 = 1;
  				}

      			$scope.outin_storage_deleted = outin_storage.deleted;
      			var outin_storage_deleted_info = $scope.toDecimal(outin_storage.deleted,outin_storage.total);
  				$scope.outin_storage_deleted_ratio = outin_storage_deleted_info.s2;
  				$scope.outin_storage_deleted_half = outin_storage_deleted_info.isHalf;

  				$scope.outin_storage_using = outin_storage.using;
  				var outin_storage_using_info = $scope.toDecimal(outin_storage.using,outin_storage.total);
  				$scope.outin_storage_using_ratio = outin_storage_using_info.s2;
  				$scope.outin_storage_using_half = outin_storage_using_info.isHalf;

  				$scope.outin_storage_unuse = outin_storage.unuse;
  				var outin_storage_unuse_info = $scope.toDecimal(outin_storage.unuse,outin_storage.total);
  				$scope.outin_storage_unuse_ratio = outin_storage_unuse_info.s2;
  				$scope.outin_storage_unuse_half = outin_storage_unuse_info.isHalf;	

  				var monitor = dataTemp.monitor;
      			$scope.monitor_total = monitor.total;
      			$scope.monitor_total_0 = $scope.monitor_total;
      			if($scope.monitor_total == 0){
  					$scope.monitor_total_0 = 1;
  				}

      			$scope.monitor_deleted = monitor.deleted;
      			var monitor_deleted_info = $scope.toDecimal(monitor.deleted,monitor.total);
  				$scope.monitor_deleted_ratio = monitor_deleted_info.s2;
  				$scope.monitor_deleted_half = monitor_deleted_info.isHalf;

  				$scope.monitor_using = monitor.using;
  				var monitor_using_info = $scope.toDecimal(monitor.using,monitor.total);
  				$scope.monitor_using_ratio = monitor_using_info.s2;
  				$scope.monitor_using_half = monitor_using_info.isHalf;

  				$scope.monitor_unuse = monitor.unuse;
  				var monitor_unuse_info = $scope.toDecimal(monitor.unuse,monitor.total);
  				$scope.monitor_unuse_ratio = monitor_unuse_info.s2;
  				$scope.monitor_unuse_half = monitor_unuse_info.isHalf;		

  				var zoom = dataTemp.zoom;
      			$scope.zoom_total = zoom.total;
      			$scope.zoom_total_0 = $scope.zoom_total;
      			if($scope.zoom_total == 0){
  					$scope.zoom_total_0 = 1;
  				}

      			$scope.zoom_deleted = zoom.deleted;
      			var zoom_deleted_info = $scope.toDecimal(zoom.deleted,zoom.total);
  				$scope.zoom_deleted_ratio = zoom_deleted_info.s2;
  				$scope.zoom_deleted_half = zoom_deleted_info.isHalf;

  				$scope.zoom_using = zoom.using;
  				var zoom_using_info = $scope.toDecimal(zoom.using,zoom.total);
  				$scope.zoom_using_ratio = zoom_using_info.s2;
  				$scope.zoom_using_half = zoom_using_info.isHalf;

  				$scope.zoom_unuse = zoom.unuse;
  				var zoom_unuse_info = $scope.toDecimal(zoom.unuse,zoom.total);
  				$scope.zoom_unuse_ratio = zoom_unuse_info.s2;
  				$scope.zoom_unuse_half = zoom_unuse_info.isHalf;
  				
      		}
    	}).error(function(data,state){
      	if(state == 403){
        	baseUrl.redirect()
      	}
    });
  }

  $scope.getRFIDCamera();

  $scope.getRFIDReader = function(){
  		$http.get(baseUrl.getUrl() + "/api/2/count/rfidreader").success(function(data){
      		if(data.code == 200){
      			var dataTemp = data.data;
      			$scope.rfidreader_total = dataTemp.total;

      			var r_outin_storage = dataTemp.outin_storage;
      			$scope.r_outin_storage_total = r_outin_storage.total;
      			$scope.r_outin_storage_total_0 = $scope.r_outin_storage_total;
      			if($scope.r_outin_storage_total == 0){
  					$scope.r_outin_storage_total_0 = 1;
  				}

      			$scope.r_outin_storage_deleted = r_outin_storage.deleted;
      			var r_outin_storage_deleted_info = $scope.toDecimal(r_outin_storage.deleted,r_outin_storage.total);
  				$scope.r_outin_storage_deleted_ratio = r_outin_storage_deleted_info.s2;
  				$scope.r_outin_storage_deleted_half = r_outin_storage_deleted_info.isHalf;

  				$scope.r_outin_storage_using = r_outin_storage.using;
  				var r_outin_storage_using_info = $scope.toDecimal(r_outin_storage.using,r_outin_storage.total);
  				$scope.r_outin_storage_using_ratio = r_outin_storage_using_info.s2;
  				$scope.r_outin_storage_using_half = r_outin_storage_using_info.isHalf;

  				$scope.r_outin_storage_unuse = r_outin_storage.unuse;
  				var r_outin_storage_unuse_info = $scope.toDecimal(r_outin_storage.unuse,r_outin_storage.total);
  				$scope.r_outin_storage_unuse_ratio = r_outin_storage_unuse_info.s2;
  				$scope.r_outin_storage_unuse_half = r_outin_storage_unuse_info.isHalf;	

  				var r_monitor = dataTemp.monitor;
      			$scope.r_monitor_total = r_monitor.total;
      			$scope.r_monitor_total_0 = $scope.r_monitor_total;
      			if($scope.r_monitor_total == 0){
  					$scope.r_monitor_total_0 = 1;
  				}

      			$scope.r_monitor_deleted = r_monitor.deleted;
      			var r_monitor_deleted_info = $scope.toDecimal(r_monitor.deleted,r_monitor.total);
  				$scope.r_monitor_deleted_ratio = r_monitor_deleted_info.s2;
  				$scope.r_monitor_deleted_half = r_monitor_deleted_info.isHalf;

  				$scope.r_monitor_using = r_monitor.using;
  				var r_monitor_using_info = $scope.toDecimal(r_monitor.using,r_monitor.total);
  				$scope.r_monitor_using_ratio = r_monitor_using_info.s2;
  				$scope.r_monitor_using_half = r_monitor_using_info.isHalf;

  				$scope.r_monitor_unuse = r_monitor.unuse;
  				var r_monitor_unuse_info = $scope.toDecimal(r_monitor.unuse,r_monitor.total);
  				$scope.r_monitor_unuse_ratio = r_monitor_unuse_info.s2;
  				$scope.r_monitor_unuse_half = r_monitor_unuse_info.isHalf;		

  				var r_handheld_scan = dataTemp.handheld_scan;
      			$scope.r_handheld_scan_total = r_handheld_scan.total;
      			$scope.r_handheld_scan_total_0 = $scope.r_handheld_scan_total;
      			if($scope.r_handheld_scan_total == 0){
  					$scope.r_handheld_scan_total_0 = 1;
  				}

      			$scope.r_handheld_scan_deleted = r_handheld_scan.deleted;
      			var r_handheld_scan_deleted_info = $scope.toDecimal(r_handheld_scan.deleted,r_handheld_scan.total);
  				$scope.r_handheld_scan_deleted_ratio = r_handheld_scan_deleted_info.s2;
  				$scope.r_handheld_scan_deleted_half = r_handheld_scan_deleted_info.isHalf;

  				$scope.r_handheld_scan_using = r_handheld_scan.using;
  				var r_handheld_scan_using_info = $scope.toDecimal(r_handheld_scan.using,r_handheld_scan.total);
  				$scope.r_handheld_scan_using_ratio = r_handheld_scan_using_info.s2;
  				$scope.r_handheld_scan_using_half = r_handheld_scan_using_info.isHalf;

  				$scope.r_handheld_scan_unuse = r_handheld_scan.unuse;
  				var r_handheld_scan_unuse_info = $scope.toDecimal(r_handheld_scan.unuse,r_handheld_scan.total);
  				$scope.r_handheld_scan_unuse_ratio = r_handheld_scan_unuse_info.s2;
  				$scope.r_handheld_scan_unuse_half = r_handheld_scan_unuse_info.isHalf;
  				
      		}
    	}).error(function(data,state){
      	if(state == 403){
        	baseUrl.redirect()
      	}
    });
  }

  $scope.getRFIDReader();

})