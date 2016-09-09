/**
 * Created by tangjianfeng on 16/5/18.
 */
module.exports = {
    url:"/camera",
    template:__inline("./camera.html"),
    controller:["$scope", "$injector", function($scope, $injector,baseUrl){
        require.async("/modules/pages/camera/camera.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};