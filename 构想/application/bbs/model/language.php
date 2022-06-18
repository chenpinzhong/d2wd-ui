<?php
	namespace bbs\model;
	use index\model\language as base_language;
	//语言类
	class language extends base_language{
		public $language=array();
		
		public function __construct() {
			parent::__construct();
			//中文
			$this->language['zh']['current_menu']="bbs";//当前菜单名称
			$this->language['zh']['release_post']="发布帖子";//发布帖子
			$this->language['zh']['您未登录,请登录后评论']="您未登录,请登录后评论";//您未登录,请登录后评论
			$this->language['zh']['帖子不存在!']="帖子不存在!";//帖子不存在!
			$this->language['zh']['评论系统异常!']="评论系统异常!";//评论系统异常!
			$this->language['zh']['评论成功!']="评论成功!";//评论成功!
			$this->language['zh']['发布成功!']="发布成功!";//发布成功!
			$this->language['zh']['发布内容异常!']="发布内容异常!";//发布内容异常!
			$this->language['zh']['帖子已经存在!']="帖子已经存在!";//帖子已经存在!
			$this->language['zh']['帖子类型']="帖子类型";//帖子类型!
			$this->language['zh']['帖子标题']="帖子标题";//帖子标题!
			$this->language['zh']['发帖']="发帖";//帖子标题!
			$this->language['zh']['发布帖子的名称']="发布帖子的名称";//发布帖子的名称!
			$this->language['zh']['forum']="论坛";//论坛
			$this->language['zh']['forum_notes']="论坛备注";//论坛备注
			$this->language['zh']['theme']="主题";//主题
			$this->language['zh']['post']="帖子";//帖子
			$this->language['zh']['last_reply_time']="最后发帖时间";//最后发帖时间
			
			$this->language['zh']['post_name']="帖子名称";//帖子名称
			$this->language['zh']['search']="搜索";//搜索
			$this->language['zh']['serial_number']="序号";//序号
			$this->language['zh']['title']="标题";//标题
			$this->language['zh']['user_name']="用户名称";//用户名称
			$this->language['zh']['released_time']="发表时间";//发表时间
			$this->language['zh']['browse_number']="浏览数量";//浏览数量
			$this->language['zh']['praise_quantity']="赞赏数量";//赞赏数量
			$this->language['zh']['post']="发表帖子";//发表帖子
			$this->language['zh']['posted_by']="发表人";//发表人
			$this->language['zh']['post_time']="发帖时间";//发帖时间
			$this->language['zh']['view_count']="发表人";//浏览次数
			$this->language['zh']['floor']="楼";//楼
			$this->language['zh']['comment']="发表评论";//发表评论
			$this->language['zh']['comment_info']="评论信息";//评论信息
			$this->language['zh']['bbs']="论坛";//论坛
			
			
			
			
			//英语
			$this->language['en']['current_menu']="bbs";//当前菜单名称
			$this->language['en']['release_post']="release post";//发布帖子
			$this->language['en']['您未登录,请登录后评论']="You are not logged in, please comment after login";//您未登录,请登录后评论
			$this->language['en']['帖子不存在!']="Post does not exist!";//帖子不存在!
			$this->language['en']['评论系统异常!']="Comment system exception!";//评论系统异常!
			$this->language['en']['评论成功!']="Comment successful!";//评论成功!
			$this->language['en']['发布成功!']="Release success!";//发布成功!
			$this->language['en']['发布内容异常!']="Published content exception!";//发布内容异常!
			$this->language['en']['帖子已经存在!']="The post already exists!";//帖子已经存在!
			$this->language['en']['帖子类型']="Post type";//帖子类型!
			$this->language['en']['帖子标题']="Post title";//帖子标题!
			$this->language['en']['发帖']="Post";//发帖!
			$this->language['en']['发布帖子的名称']="Name of the post";//发布帖子的名称!
			
			$this->language['en']['forum']="forum";//论坛
			$this->language['en']['forum_notes']="forum notes";//论坛备注
			$this->language['en']['theme']="theme";//主题
			$this->language['en']['post']="post";//帖子
			$this->language['en']['last_reply_time']="last reply time";//最后发帖时间
			
			$this->language['en']['post_name']="post name";//帖子名称
			$this->language['en']['search']="search";//搜索
			$this->language['en']['serial_number']="serial number";//序号
			$this->language['en']['title']="title";//标题
			$this->language['en']['user_name']="user name";//用户名称
			$this->language['en']['released_time']="released time";//发表时间
			$this->language['en']['browse_number']="browse number";//浏览数量
			$this->language['en']['praise_quantity']="praise quantity";//赞赏数量
			$this->language['en']['post']="Post";//发表帖子
			$this->language['en']['posted_by']="Posted by";//发表人
			$this->language['en']['post_time']="Post Time";//发帖时间
			$this->language['en']['view_count']="View Count";//浏览次数
			$this->language['en']['floor']="Floor";//楼
			$this->language['en']['comment']="Comment";//发表评论
			$this->language['en']['comment_info']="Comment Info";//评论信息
			$this->language['en']['bbs']="BBS";//论坛
		}
		
		public function get($name){
			return $this->language[$name];
		}
	}
?>