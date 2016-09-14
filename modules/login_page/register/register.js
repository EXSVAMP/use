module.exports = {
    url:"/register",
    template:__inline("./register.html"),
    controller:["$scope", "$injector", function($scope, $injector){
        require.async("/modules/login_page/register/register.sync.js", function (ctrl) {
            $injector.invoke(ctrl, this, {"$scope": $scope});
        })
    }]
};