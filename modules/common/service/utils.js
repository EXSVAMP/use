var app = angular.module('RDash');
app.factory('utils', function () {
    return {
        set:function(obj,key,value){
            var keys = key.split('\.');
            console.log(keys);
            var v = obj;
            var vo;
            var k='';
            for(k in keys){
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