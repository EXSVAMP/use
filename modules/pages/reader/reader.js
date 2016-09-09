/**
 * Created by tangjianfeng on 16/5/18.
 */
module.exports = {
    url:"/reader",
    template:__inline("./reader.html"),
    controller:["$scope", "$injector", function($scope, $injector,baseUrl){
        require.async("/modules/pages/reader/reader.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};