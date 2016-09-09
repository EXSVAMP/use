module.exports = {
    url: '/template',
    template: __inline('./template.html'),
    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : ["$scope","$injector","$http",function($scope, $injector, $http,urlBase) {
        //支持异步加载controller
        require.async('./template.async.js', function(ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        });
    }],
};