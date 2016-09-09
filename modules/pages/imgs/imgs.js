/**
 * Created by tangjianfeng on 16/5/18.
 */
require("common/ddd");
module.exports = {
    url:"/imgs",
    template:__inline("./imgs.html"),
    controller:["$scope", "$injector", function($scope, $injector,baseUrl){
        require.async("/modules/pages/imgs/imgs.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};