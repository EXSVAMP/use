/**
 * Created by tangjianfeng on 16/5/18.
 */
module.exports = {
    url:"/login",
    template:__inline("./login.html"),
    controller:["$scope", "$injector", function($scope, $injector){
        require.async("/modules/login_page/login/login.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};