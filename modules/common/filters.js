var app = angular.module('RDash');
app.filter("img",function(){
    return function(url, isVedio ){
        if(!url&&!isVedio) return "/statics/lib/img/photo_no.jpg";
            else if(!url&&isVedio)return "/statics/lib/img/video_no.jpg"
        else return url;
    }
});