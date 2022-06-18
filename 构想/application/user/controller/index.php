<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:用户管理
	*/
	
	namespace croe\controller;
	use user\model\language;
	
	class index extends controller{
		public function __construct(){
			parent::__construct();
			//获取主库配置信息
			$master=$this->config->get_db_master();
			//连接主库
			$this->mdb=$this->db->link($master);
			//引入语言模型
			$language=new language();
			
			//设置页面基本信息
			set_page_config($this,$language);
		}
		
		public function index(){
			$mdb=$this->mdb;
			$user_id=empty($_SESSION["user_id"])?"":$_SESSION["user_id"];//当前登录的用户的id
			//错误信息组
			$error_array=array();
			$user_data=array();
			if(empty($user_id)){
				$error_array["user_id"]=$this->current_language['未登录'];
			}
			if(empty($error_array)){
				$user_rows=$mdb->table('ts_user')->where(array('id'=>$user_id))->find();
				if(!empty($user_rows)){
					unset($user_rows['password']);//删除密码 信息
					$user_data['email']=$user_rows;//用户信息
				}else{
					$error_array["email"]=$this->current_language['用户不存在'];
				}
			}
			$this->assign("user_data",$user_rows);//提示错误信息
		}
		//用户登录
		public function login(){
			$mdb=$this->mdb;
			$email=$this->request->param('email');//邮箱
			
			if(!empty($email)){
				//用户是post请求
				//错误信息组
				$error_array=array();
				$password=$this->request->param('password');//密码
				
				if(strlen($password)<6){
					$error_array['error_password']=$this->language["密码不合法"];
				}
				
				//查询账号是否存在
				$user_rows=$mdb->table('ts_user')->where(array('email'=>$email))->find();
				if(empty($user_rows)){
					$error_array[]=$this->language["用户不存在"];
				}else{
					$user_rows=$mdb->table('ts_user')->where(array('email'=>$email,'password'=>hash("sha256",$password.'root')))->find();
				}
				//判断密码是否错误
				if(empty($user_rows)){
					$error_array[]=$this->language["密码错误"];
				}
				
				if(empty($error_array)){
					//登录成功 修改会话信息
					unset($user_rows['password']);//删除密码 信息
					$_SESSION["user_id"]=$user_rows['id'];
					$_SESSION["email"]=$email;
					$_SESSION["user_data"]=$user_rows;
					
					//用户注册成功
					$message_info=array(
						"status"=>200,
						"time"=>3,//页面自动跳转时间
						"title"=>$this->language["登录成功"],
						"message"=>$this->language["登录成功"],
						"confirm"=>"/user/index/index",//登录成功到首页
						"cancel"=>"/user/index/login",//登录失败返回登录
					);
				}else{
					$message_info=array(
						"status"=>100,
						"time"=>3,//页面自动跳转时间
						"title"=>$this->language["登录失败"],
						"message"=>implode("|",$error_array),
						"confirm"=>"/index/index/index",//到首页不继续登录
						"cancel"=>"/user/index/login",//继续登录
					);
				}
				$this->assign("message_info",$message_info);//提示错误信息
				$this->display("user/index/message.html");
				exit;
				
			}
			
			
		}
		//用户注册
		public function register(){
			$mdb=$this->mdb;
			$email=$this->request->param('email');//邮箱
			
			if(!empty($email)){
				//用户是post请求
				//错误信息组
				$error_array=array();
				$password=$this->request->param('password');//密码
				$repeat_password=$this->request->param('repeat_password');//重复密码
				
				if(strlen($password)<6){
					$error_array['error_password']=$this->language["密码不合法"];
				}
				if($password!=$repeat_password){
					$error_array['error_repeat_password']=$this->language["密码不一致"];
				}
				
				//查询账号是否存在
				$user_rows=$mdb->table('ts_user')->where(array('email'=>$email))->find();
				if(empty($user_rows)){
					//如果用户不存在 则可以注册
					$insert_data=array();
					$insert_data['email']=$email;
					$insert_data['user_name']=$email;
					$insert_data['password']=hash("sha256",$password.'root');
					$insert_data['add_time']=gmdate("Y-m-d h:i:s",time());
					$insert_data['update_time']=gmdate("Y-m-d h:i:s",time());
					$user_id=$mdb->insert('ts_user',$insert_data);
				}else{
					//用户已经存在  不可以注册
					$error_array['error_registered']=$this->language["用户已经注册"];
				}
				
				if(empty($error_array)){
					//用户注册成功
					$message_info=array(
						"status"=>200,
						"time"=>3,//页面自动跳转时间
						"title"=>$this->language["注册成功"],
						"message"=>$this->language["注册成功"],
						"confirm"=>"/user/index/index",//登录页面
						"cancel"=>"/index/index/index",//到首页
					);
				}else{
					$message_info=array(
						"status"=>100,
						"time"=>3,//页面自动跳转时间
						"title"=>$this->language["注册失败"],
						"message"=>implode("|",$error_array),
						"confirm"=>"/index/index/index",//到首页
						"cancel"=>"/index/index/index",//到首页
					);
				}
				$this->assign("message_info",$message_info);//提示错误信息
				$this->display("user/index/message.html");
				exit;
				
			}
			
		}
		//用户信息
		public function my_account(){
			$mdb=$this->mdb;
			echo '用户信息 测试!';
			exit;
		}
		
		
		//退出登录
		public function logout(){
			$mdb=$this->mdb;
			$_SESSION=array();//清空用户的会话信息 退出登录
			$message_info=array(
				"status"=>200,
				"time"=>3,//页面自动跳转时间
				"title"=>$this->language["退出成功"],
				"message"=>$this->language["退出成功"],
				"confirm"=>"/index/index/index",//到首页不继续登录
				"cancel"=>"/user/index/login",//继续登录
			);
			
			$this->assign("message_info",$message_info);//提示错误信息
			$this->display("user/index/message.html");
		}
		
		//修改密码
		public function change_password(){
			$mdb=$this->mdb;
			$post_data=$this->request->param('_POST');//邮箱
			
			
			//如果是post提交信息则是修改密码
			if(!empty($post_data['email'])){
				
				$email=$post_data['email'];//邮箱
				$code=$post_data['code'];//邮箱
				$password=$post_data['password'];//密码
				
				//查询code 是否存在
				
				//设置查询条件
				$where=array(
					'mail'=>$email,
					'code'=>$code,
					'end_time'=>array('>=',gmdate('Y-m-d H:i:s',time()))
				);
				
				
				$user_code_rows=$mdb->table('ts_user_code')->where($where)->find();
				
				//如果验证码存在 可以修改密码
				if(!empty($user_code_rows)){
					$user_code_rows=$mdb->table('ts_user_code')->update($where);
					$user_data=array();
					$user_data['password']=hash("sha256",$password.'root');
					$user_data['update_time']=gmdate('Y-m-d H:i:s',time());//更新时间
					$mdb->update('ts_user',$user_data,array('email'=>$email));
					$message_info=array(
						"status"=>200,
						"time"=>3,//页面自动跳转时间
						"title"=>$this->language["修改成功"],
						"message"=>$this->language["修改成功"],
						"confirm"=>"/index/index/index",//到首页不继续登录
						"cancel"=>"/user/index/login",//继续登录
					);
				}else{
					//验证码错误
					$message_info=array(
						"status"=>200,
						"time"=>3,//页面自动跳转时间
						"title"=>$this->language["验证码错误"],
						"message"=>$this->language["验证码错误"],
						"confirm"=>"/index/index/index",//到首页不继续登录
						"cancel"=>"/user/index/login",//继续登录
					);
				}
				
				$this->assign("message_info",$message_info);//提示错误信息
				$this->display("user/index/message.html");
				exit;
			}
			
		}
		
		//发送验证码
		public function send_mail_code($email=''){
			require_once(root_dir.'/libs/PHPMailer_5.2.2/class.phpmailer.php');
			require_once(root_dir.'/libs/PHPMailer_5.2.2/class.smtp.php');
			$mdb=$this->mdb;//数据库
			
			//如果邮箱不为空
			if(!empty($email)){
				
				$arr=array_merge(range('A','Z'),range('0','9'));
				$arr=array_flip($arr);
				$arr=array_rand($arr,6);
				$code='';
				foreach ($arr as $v){
					$code.=$v;
				}
				//记录验证码
				//ts_user_code
				$user_code_data=array();
				$user_code_data['mail']=$email;
				$user_code_data['code']=$code;
				$user_code_data['end_time']=gmdate("Y-m-d H:i:s",time()+60*20);//过期时间 为GMT 时间+20分钟
				$mdb->insert('ts_user_code',$user_code_data);//不需要获取 product_pledge_id
				
				$mail = new \PHPMailer();//实例化PHPMailer核心类
				$mail->SMTPDebug = 1;//是否启用smtp的debug进行调试 开发环境建议开启 生产环境注释掉即可 默认关闭debug调试模式
				$mail->isSMTP();//使用smtp鉴权方式发送邮件
				$mail->SMTPAuth=true;//smtp需要鉴权 这个必须是true
				$mail->Host = 'smtp.qq.com';//链接qq域名邮箱的服务器地址
				$mail->SMTPSecure = 'ssl';//设置使用ssl加密方式登录鉴权
				$mail->Port = 465;//设置ssl连接smtp服务器的远程服务器端口号，以前的默认是25，但是现在新的好像已经不可用了 可选465或587
				$mail->CharSet = 'UTF-8';//设置发送的邮件的编码 可选GB2312 我喜欢utf-8 据说utf8在某些客户端收信下会乱码
				$mail->FromName = 'biqu';//设置发件人姓名（昵称） 任意内容，显示在收件人邮件的发件人邮箱地址前的发件人姓名
				
				$mail->Username ='214564605@qq.com';//smtp登录的账号 这里填入字符串格式的qq号即可
				$mail->Password = 'lhvhksdajfunbiag';//smtp登录的密码 使用生成的授权码（就刚才叫你保存的最新的授权码）【非常重要：在网页上登陆邮箱后在设置中去获取此授权码】
				$mail->From = '214564605@qq.com';//设置发件人邮箱地址 这里填入上述提到的“发件人邮箱”
				
				$mail->isHTML(true);//邮件正文是否为html编码 注意此处是一个方法 不再是属性 true或false
				$mail->addAddress($email);//设置收件人邮箱地址
				$mail->Subject = 'Your verification code (您的验证码!)';//添加该邮件的主题
				
				//添加邮件正文 上方将isHTML设置成了true，则可以是完整的html字符串 如：使用file_get_contents函数读取本地的html文件
				$mail->Body ='
					<table width="800" border="0" align="left" cellpadding="0" cellspacing="0" style=" border:1px solid #edecec;padding: 20px;font-size:14px;color:#333333;">
					<tbody>
						<tr>
							<td width="120" height="56" border="0" align="left" colspan="1" style=" font-size:16px;">
								<span style="color:#00a2ca;">biqu(必趣科技)</span>
							</td>
							<td height="56" border="0" align="left" colspan="2" style=" font-size:16px;">
								您好您的 验证码是&nbsp;&nbsp;<span style="color:#F00">'.$code.'</span>
							</td>
							
						</tr>
					<tr>
					</tbody>
				</table>';
				
				//发送邮件
				if($mail->send()){
					$this->language["验证码错误"];
					return array('status'=>200,'msg'=>$this->language['获取验证码成功'],'title'=>$this->language['发送成功']);
				}else{
					return array('status'=>100,'msg'=>$this->language['获取验证码失败'],'title'=>$this->language['发送失败']);
				}
			}else{
				return array('status'=>100,'msg'=>$this->language['邮箱为空'],'title'=>$this->language['发送失败']);
			}
		}
		
		//发送验证码
		public function send_code(){
			$email=$this->request->param('email');//邮箱
			$return_array=array('status'=>100,'msg'=>$this->language['信息错误无法发送']);//初始化信息
			if(!empty($email)){
				$return_array=$this->send_mail_code($email);
			}
			echo json_encode($return_array,true);
		}
		
		
	}
?>