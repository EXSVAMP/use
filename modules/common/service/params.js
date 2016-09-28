var app = angular.module('RDash');
// app.factory('params', function () {
//     var params = {};
//     return {
//         set:function(data){
//             params = data;
//         },
//         get:function(){
//             return params;
//         }
//     }
// });
app.constant('global',{
    pageNumSelections:[10,20,30,40,50]
});
app.value('params',{});