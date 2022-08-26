const proxy = require('http-proxy-middleware')//引入http-proxy-middleware，react脚手架已经安装

//api请求过滤
const filter_rules = function (pathname,req){
    //return pathname.match('api') && req.method === 'GET';
    if(req.method === 'POST'){
        console.log('准备准发post请求')
        return true;
    }
    return pathname.match('/.*api.*/');
};

let server_addr='http://localhost:19730';

module.exports = function(app){
	app.use(
		proxy.createProxyMiddleware(filter_rules,{ //遇见api的请求，就会触发该代理配置
			target:server_addr, //请求转发给谁
			changeOrigin:true,//控制服务器收到的请求头中Host的值
		})
	)
}
