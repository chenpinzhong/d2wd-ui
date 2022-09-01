const proxy = require('http-proxy-middleware')//引入http-proxy-middleware，react脚手架已经安装

//api请求过滤
const filter_rules = function (pathname,req){

    //所有post请求转发
    if(req.method === 'POST')return true;
    //get请求转发
    if(req.method === 'GET' && pathname.match(/.*get.*/))return true;
    //ajax请求转发
    if(req.method === 'GET' && pathname.match(/.*ajax.*/))return true;
    //api请求转发
    if(req.method === 'GET' && pathname.match(/.*api.*/))return true;
    //页面测试上传的图片 /upload 或者//upload 开头的 进行转发
    if(req.method === 'GET' && pathname.match(/^\/upload|^\/\/upload/))return true;

    return false;
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
