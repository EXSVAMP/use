var app = angular.module('RDash');
app.factory('utils', function ($http) {
    return {
        set:function(obj,key,value){
            var keys = key.split('\.');
            var v = obj;
            for(var k in keys){
                if(angular.isObject(v)){
                    v=v[keys[k]];
                }else{
                    return false;
                }
            }
            v = value;
            return true;
        }
    }
});