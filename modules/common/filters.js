var app = angular.module('RDash');
app.filter("img",function(){
    return function(url){
        if(!url) return "http://imgsrc.baidu.com/forum/pic/item/199db2da81cb39db2dedc43ed3160924ab183007.jpg";
        else return url;
    }
});