<?php
	namespace user\model;
	use index\model\language as base_language;
	//语言类
	class language extends base_language{
		public $language=array();
		
		public function __construct() {
			parent::__construct();
			//注册 登录
			$this->language['zh']['current_menu']="user";//当前菜单名称
			$this->language['zh']['用户登录']="用户登录";//密码不合法
			$this->language['zh']['密码不合法']="密码不合法";//密码不合法
			$this->language['zh']['密码不一致']="密码不一致";//密码不一致
			$this->language['zh']['已注册']="已注册";//已经注册
			$this->language['zh']['注册成功']="注册成功!";//注册成功！
			$this->language['zh']['注册失败']="注册失败!";//注册失败！
			$this->language['zh']['用户已经注册']="用户已经注册";//用户已经存在！
			$this->language['zh']['用户不存在']="用户不存在!";//用户不存在！
			$this->language['zh']['密码错误']="密码错误!";//密码错误！
			$this->language['zh']['登录成功']="登录成功!";//注册成功！
			$this->language['zh']['登录失败']="登录失败!";//登录失败！
			$this->language['zh']['跳转时间']="跳转时间";//跳转时间！
			$this->language['zh']['退出成功']="退出成功";//退出成功！
			
			$this->language['zh']['登录']="登录";//登录
			$this->language['zh']['注册账号']="注册账号";//注册账号
			$this->language['zh']['邮箱']="邮箱";//邮箱
			$this->language['zh']['密码']="密码";//邮箱
			$this->language['zh']['重复密码']="重复密码";//重复密码
			
			$this->language['zh']['忘记密码']="忘记密码";//忘记密码
			$this->language['zh']['邮箱验证码']="邮箱验证码";//邮箱验证码
			
			$this->language['zh']['修改密码']="修改密码";//修改
			$this->language['zh']['修改成功']="修改成功";//修改成功
			$this->language['zh']['验证码错误']="验证码错误";//验证码错误
			$this->language['zh']['发送成功']="发送成功";//发送成功
			$this->language['zh']['发送失败']="发送失败";//发送失败
			$this->language['zh']['获取验证码成功']="获取验证码成功";//获取验证码成功
			$this->language['zh']['获取验证码失败']="获取验证码失败";//获取验证码失败
			$this->language['zh']['邮箱为空']="邮箱为空";//邮箱为空
			$this->language['zh']['信息错误无法发送']="信息错误无法发送";//信息错误无法发送
			
			
			
			
			
			
			
			//注册 登录
			$this->language['en']['current_menu']="user";//当前菜单名称
			$this->language['en']['用户登录']="User Login";//密码不合法
			$this->language['en']['密码不合法']="The password is invalid";//密码不合法
			$this->language['en']['密码不一致']="Inconsistent password";//密码不一致
			$this->language['en']['已注册']="registered";//已经注册
			$this->language['en']['注册成功']="registered successfully!";//注册成功！
			$this->language['en']['注册失败']="fail to register!";//注册失败！
			$this->language['en']['用户已经注册']="The user has registered";//用户已经存在！
			$this->language['en']['用户不存在']="The user does not exist.!";//用户不存在！
			$this->language['en']['密码错误']="wrong password!";//密码错误！
			$this->language['en']['登录成功']="login successfully!";//注册成功！
			$this->language['en']['登录失败']="login failure!";//登录失败！
			$this->language['en']['跳转时间']="Jump time";//跳转时间！
			$this->language['en']['退出成功']="Exit the success";//退出成功！
			
			$this->language['en']['登录']="Login";//登录
			$this->language['en']['注册账号']="Register an account";//退出成功！
			$this->language['en']['邮箱']="Email";//邮箱
			$this->language['en']['密码']="Password";//Password
			$this->language['en']['重复密码']="Repeat the Password";//重复密码
			
			$this->language['en']['忘记密码']="Change Password";//忘记密码
			$this->language['en']['邮箱验证码']="verification code";//邮箱验证码
			
			$this->language['en']['修改密码']="change password";//修改
			$this->language['en']['修改成功']="modify successfully";//修改成功
			$this->language['en']['验证码错误']="Verification code error";//验证码错误
			$this->language['en']['发送成功']="Send successfully";//发送成功
			$this->language['en']['发送失败']="Send failed";//发送失败
			$this->language['en']['获取验证码成功']="The captcha was obtained successfully";//获取验证码成功
			$this->language['en']['获取验证码失败']="Failed to get verification code";//获取验证码失败
			$this->language['en']['邮箱为空']="The mailbox is empty";//邮箱为空
			$this->language['en']['信息错误无法发送']="Message error cannot be sent";//信息错误无法发送
			
		}
		
		public function get($name){
			return $this->language[$name];
		}
	}
?>