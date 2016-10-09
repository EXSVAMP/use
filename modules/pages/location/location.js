// require('service');
var content="";
var type=localStorage.getItem("storeMap");
if(type=="2"){
    //模拟仓库
    content="/statics/modules/pages/location/locationModule.html";
}
else if(type=="1"){
    //橙依云仓库
    content="/statics/modules/pages/location/location.html";
}else if(type=="4"){
    //鹰潭仓库
    content="/statics/modules/pages/location/location3.html";
}
else{
    //在建仓库
    content="/statics/modules/pages/location/locationEmpty.html";
}
module.exports = {
    url: '/location',


    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'locationCtrl',
    templateUrl: content,
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'location.sync'
            ], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    },

};