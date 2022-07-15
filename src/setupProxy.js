const proxy = require('http-proxy-middleware')//引入http-proxy-middleware，react脚手架已经安装


const api_filter = function (pathname,req){
    //return pathname.match('api') && req.method === 'GET';
    return pathname.match('/.*api.*/');
};

module.exports = function(app){
	app.use(
		proxy.createProxyMiddleware(api_filter,{ //遇见api的请求，就会触发该代理配置
			target:'http://localhost:19730', //请求转发给谁
			changeOrigin:true,//控制服务器收到的请求头中Host的值
		}),
	)
}