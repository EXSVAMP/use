/**
 * Created by tangjianfeng on 16/5/18.
 */
module.exports = {
    url:"/card",
    template:__inline("./card.html"),
    controller:["$scope", "$injector", function($scope, $injector,baseUrl){
        require.async("/modules/pages/card/card.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};