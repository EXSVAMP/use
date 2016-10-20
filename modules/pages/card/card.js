// require('service');
function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}

if(!getCookie("iotcloud-token"))
     window.location.href = "/login.html";
 
module.exports = {
    url: '/card',
    template: __inline('./card.html'),


    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'cardCtrl',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'card.sync'
            ], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};