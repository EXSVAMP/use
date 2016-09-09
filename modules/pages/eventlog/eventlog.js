/**
 * Created by tangjianfeng on 16/5/18.
 */
module.exports = {
    url:"/eventlog",
    template:__inline("./eventlog.html"),
    controller:["$scope", "$injector", function($scope, $injector,baseUrl){
        require.async("/modules/pages/eventlog/eventlog.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};