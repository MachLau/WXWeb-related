require('/common/js/zepto/zepto.cookie.js');
var callApp = require('./callApp'),
DB = {
    getAuth: {
        url: '/activity/common/getAuth.htm',
        method: 'get'
    }
};

function WxAuth(activityId,redirectUri,authType){
    if(this instanceof WxAuth){
        this.activityId = activityId||'';
        this.redirectUri =window.location.origin+redirectUri||'';
        this.authType = authType||'snsapi_userinfo';
    }else{
        console.log('WxAuth is a constructor and should be called with the `new` keyword');
    }
}
WxAuth.prototype.doAuth=function(callback){
    this.getCode()?this.getUserWXInfo(callback):
                        $.cookie('lc-wxauth-info')?callback && callback(data):
                            location.href=this.getAuthUrl(this.redirectUri,this.authType);
}
WxAuth.prototype.getCode=function(){//获取code值
    var code = $.bom.query('code');
    return code;
}
WxAuth.prototype.getUserWXInfo=function(callback){//获取用户授权后的信息，如昵称、头像和openID
    var code=this.getCode();
    $.Ajax.send({
        url: DB.getAuth.url,
        method: DB.getAuth.method,
        data: {
            aid: this.activityId,
            code: code
            // channel: channel//选填
        },
        dataType: 'json',
        cache: false,
        success: function(data) {
            var lcWxauthInfo =JSON.stringify(data);
            $.cookie('lc-wxauth-info', lcWxauthInfo, {
                expires: 7
            });
            callback && callback(data);
        },
        dataErr: function(msg, code) {
            console.log(msg+"----"+code);
        },
        error: function(res) {
            console.log(res);
        }
    });
}
WxAuth.prototype.getAuthUrl=function(uri,authType,state){
    var uri = uri||this.redirectUri,
    authT = authType||this.authType,
    state = state||this.state;
    return 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e1ff84ed8bb5a1c&redirect_uri='+
    encodeURIComponent(uri)+'&response_type=code&scope='+authT+'&state=STATE#wechat_redirect'
}
return WxAuth;