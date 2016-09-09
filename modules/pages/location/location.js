// require("interceptor/miniMap");
var content="";
var type=localStorage.getItem("storeMap");
if(type=="2"){
    //模拟仓库
    content="/statics/modules/pages/location/locationModule.html";
}
 else if(type=="1"){
    //橙依云仓库
    content="/statics/modules/pages/location/location2.html";
}else if(type=="4"){
    //鹰潭仓库
    content="/statics/modules/pages/location/location3.html";
} 
else{
    //在建仓库
    content="/statics/modules/pages/location/locationEmpty.html";
}

module.exports = {
    url:'/location',

    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : ["$scope","$injector","$http",function($scope, $injector, $http,urlBase) {

        //支持异步加载controller
        // content="/statics/modules/pages/location/location.html";
         if(type!=""){
              require.async(['pages/location/location.async'], function(ctrl) {
                 $injector.invoke(ctrl, this, {"$scope": $scope});
              });

         }

    }],
    templateUrl: content,
};