
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var appId = $.getUrlParam('appId');
var stream= 'stream';
var uid = '21884';
var playpwd = '';
var hlsPlayPwd = '';
var now = Date.parse(new Date())/ 1000;

var hlsSite='http://'+uid+'.hlsplay.aodianyun.com/'+appId;
hlsSite += '/' + stream + '.m3u8' + (hlsPlayPwd == '' ? '' : '?k=' + md5(appId + stream + hlsPlayPwd + now) + '&t=' + now);
var rtmpSite= 'rtmp://'+uid+'.lssplay.aodianyun.com/';
rtmpSite+= appId + '/' + stream + (playpwd == '' ? '' : '?k=' + md5(appId + stream + playpwd + now) + '&t=' + now);
var objectPlayer=new aodianPlayer({
    container:'play',//播放器容器ID，必要参数
    rtmpUrl:rtmpSite,
    hlsUrl:hlsSite,
    width: '500',//播放器宽度，可用数字、百分比等
    height: '400',//播放器高度，可用数字、百分比等
    autostart: true,//是否自动播放，默认为false
    bufferlength: '1',//视频缓冲时间，默认为3秒。hls不支持！手机端不支持
    maxbufferlength: '2',//最大视频缓冲时间，默认为2秒。hls不支持！手机端不支持
    stretching: '1',//设置全屏模式,1代表按比例撑满至全屏,2代表铺满全屏,3代表视频原始大小,默认值为1。hls初始设置不支持，手机端不支持
    controlbardisplay: 'enable',//是否显示控制栏，值为：disable、enable默认为disable。
});

