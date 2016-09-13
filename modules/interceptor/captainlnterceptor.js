var RDash_web = angular.module('RDash');
function RDashInterceptor() {

    this.config = {
        iotcloudtoken: 'iotcloud-token',
       
    };

    this.$get = ['$log', '$cookieStore', '$q', '$location','$rootScope', function($log, $cookieStore, $q, $location,$rootScope) {
        var self = this;

        return {
            request: function(request) {
                var security = $cookieStore.get(self.config.iotcloudtoken);
                request.headers["iotcloud-token"] =security.token;
                $rootScope.loading = true;
                return request;
            },
            requestError: function(error) {
                return $q.reject(error);
            },
            response: function(response) {
                if (response.headers) {
                    var location=$location.path();
                    var storeMap=localStorage.getItem("storeMap");
                    if(location.indexOf("location")==-1||storeMap==""){
                        var obj=$(".mgNavigator");
                        if($(".mgNavigator").length>0){
                            $(".mgNavigator").remove();
                        }

                    }
                    var headers = response.headers();
                    var security = $cookieStore.get(self.config.iotcloudtoken);
                    if (security) {
                        security = headers[self.config.securityToken];
                    }
                }
                return response;
            },
            responseError: function(response) {
                console.log("后台出错!")
                window.location.href="/login.html"

                return $q.reject(response);
            }
        };
    }];

};
//loading
RDash_web.factory('timestampMarker', ["$rootScope", function ($rootScope) {
    var timestampMarker = {
        request: function (config) {
            $rootScope.loading = true;
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function (response) {
            // $rootScope.loading = false;
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return timestampMarker;
}]);


RDash_web.provider('RDashInterceptor', RDashInterceptor);


RDash_web.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('RDashInterceptor');
    $httpProvider.interceptors.push('timestampMarker');
}]);
