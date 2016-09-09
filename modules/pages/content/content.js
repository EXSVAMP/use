/**
 * Created by tangjianfeng on 16/5/18.
 */
module.exports = {
    url:"/content",
    template:__inline("./content.html"),
    controller:["$scope", "$injector", function($scope, $injector,baseUrl){
        require.async("/modules/pages/content/content.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};