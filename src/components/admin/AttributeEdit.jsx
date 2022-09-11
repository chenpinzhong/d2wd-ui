import React,{createRef} from "react"
import {nanoid} from "nanoid";
import {Button,Input,message} from "antd";
import "../../pages/admin/css/base.css"


class Header extends React.Component {
    props
    //初始化方法
    constructor(props) {
        super(props);
        this.props=props;
        this.init(this.props);//初始化方法
    }

    init(props){
        //基础数据处理
        let product_images=props.product_images
        let attribute_images_select_map= {};//属性图选择表
        if(typeof(product_images)=="undefined")product_images=[];
        product_images.forEach(function (val){
            attribute_images_select_map[val['file_id']]=false;
        })

        //初始化属性值
        let attribute_value_map=props.attribute_value_map
        if(typeof(attribute_value_map)=="undefined")attribute_value_map=[];

        this.add_attribute=props.add_attribute;//父级添加属性的方法

        //组件的状态管理
        this.state={
            attribute_value_map:attribute_value_map,//属性值
            attribute_value_select:'',//当前选择的属性值ID
            product_images:product_images,//用户上传的属性图
            attribute_images_select_map:attribute_images_select_map,//属性图的选择
            dom_attribute_name:'',//属性名称
            dom_attribute_value:'',//属性值名称
        };
        this.state.attribute_value_map=[];
    }


    attribute_name_handle_change(e){
        this.setState(()=>{return {'dom_attribute_name':e.target.value}})
    }
    dom_attribute_value_handle_change(e){
        this.setState(()=>{return {'dom_attribute_value':e.target.value}})
    }
    //属性值选择
    attribute_value_select(value,image_id){
        if(this.state.attribute_value_select!==value){
            this.state.attribute_value_select=value;//当前选择的属性值名称
            this.state.dom_attribute_value=value;//改变当前属性值名称
            for (let key in this.state.attribute_images_select_map){
                this.state.attribute_images_select_map[key]=false;
            }
            this.state.attribute_images_select_map[image_id]=true;
            this.setState(this.state);
        }else{
            //第二次选择 相当于取消选择
            this.state.attribute_value_select='';//当前选择的属性值名称
            this.setState(this.state);
        }
    }

    //属性图选择
    attribute_img_select(id){
        if(this.state.attribute_images_select_map[id]==true){
            this.state.attribute_images_select_map[id]=false;
            this.setState(this.state);
            return true;
        }
        for (let key in this.state.attribute_images_select_map){
            this.state.attribute_images_select_map[key]=false;
        }
        this.state.attribute_images_select_map[id]=true;//选择对应ID
        this.setState(this.state);//刷新页面
    }
    //添加属性值
    add_attribute_value() {
        let attribute_value=this.state.dom_attribute_value;
        let attribute_images_id=false;
        for (let key in this.state.attribute_images_select_map){
            if (this.state.attribute_images_select_map[key]==true){
                attribute_images_id=key;
            }
        }
        //属性值信息
        let attribute_value_info={}
        attribute_value_info['value']=attribute_value;
        attribute_value_info['image_id']=attribute_images_id;
        let check_attribute_value=false;//检查属性值是否已经存在
        this.state.attribute_value_map.map(function(value,index){
            if(value['value']==attribute_value)check_attribute_value=true;
        })
        if(check_attribute_value){
            message.info("属性值:"+attribute_value+" 已经存在!").then(r =>{});
            return false;
        }
        this.state.attribute_value_map.push(attribute_value_info)
        this.setState(this.state);
    }
    //删除属性值
    del_attribute_value() {
        let attribute_value=this.state.dom_attribute_value;//得到属性值的名称

        let del_index=false;
        this.state.attribute_value_map.map(function(value,index){
            if(value['value']==attribute_value)del_index=index;
        })

        //如果找到了位置
        if(typeof(del_index)=="number"){
            this.state.attribute_value_map.splice(del_index,1);//移除掉一个成员
            message.info("成功删除 属性值:"+attribute_value).then(r =>{});
        }else{
            message.error("错误删除 属性值:"+attribute_value+" 不存在!").then(r =>{});
        }
        this.setState(this.state);//更新状态
    }

    //属性变成完成后 提交属性
    submit_attribute(){
        let attribute_name=this.state.dom_attribute_name
        let attribute_value_list=this.state.attribute_value_map
        this.add_attribute(attribute_name,attribute_value_list);

        this.init(this.props);//初始化状态 
        this.setState(this.state);//更新状态
    }

    render() {
        let _this=this;
        let product_images=_this.state.product_images;
        return (
            <>
                <div style={{color:"red",marginBottom:"10px"}}>
                    ps:<br/>
                    1.添加属性基本逻辑,例如产品是一个衣服,有<span style={{color:"#000"}}>黑色</span>,<span style={{color:"#00F"}}>蓝色</span> 2种颜色。那么属性值需要增加 <span style={{color:"#000"}}>黑色</span>,<span style={{color:"#00F"}}>蓝色</span>
                    如果有上传属性图 可以在填写属性值的同时选择属性图<br/>
                    2.编辑属性名称 点击提交 就完成属性编辑了
                </div>
                {/*属性编辑*/}
                <div className="attribute_info_box">
                    <div>属性：</div>
                    <div className="attribute_info">
                        <div className="attribute_name_box">
                            <div className="attribute_title">属性名：</div>
                            <Input className="attribute_name" name="attribute_name" defaultValue="颜色" onChange={(e)=>this.attribute_name_handle_change(e)} value={this.state.dom_attribute_name}  placeholder="请输入属性名" style={{width:"220px"}} />
                        </div>
                    </div>
                    <div className="attribute_info">
                        <div className="attribute_set">
                            <div className="attribute_set_name">属性值：</div>
                            {/*这边展示属性列表*/}
                            {this.state.attribute_value_map.map(function (attribute_value){
                                let attribute_image_id=attribute_value['image_id'];
                                //如果不是假值 则说明有产品图
                                if(typeof(attribute_image_id)!=="boolean"){
                                    let image_id=attribute_value['image_id']
                                    let image_data={}
                                    product_images.forEach(function(image){
                                        if(image['file_id']==image_id)image_data=image;//找到图片信息
                                    })
                                    return (
                                        <div key={nanoid()} onClick={()=>_this.attribute_value_select(attribute_value['value'],attribute_value['image_id'])}
                                            className={"attribute_image "+(_this.state.attribute_value_select==attribute_value['value']?'select':'')}>
                                            <img width={30} src={image_data['web_path']} title={attribute_value['value']}/>
                                        </div>
                                    )
                                }
                                return <div key={nanoid()} onClick={()=>_this.attribute_value_select(attribute_value['value'],attribute_value['image_id'])} className={"attribute_value "+(_this.state.attribute_value_select==attribute_value['value']?'select':'')}>{attribute_value['value']}</div>
                            })}

                        </div>
                    </div>
                    <div className="attribute_action_box" style={{paddingLeft:"120px"}}>
                        <Button type="link" style={{padding:"0 5px"}} onClick={()=>this.submit_attribute()}>提交属性</Button>
                    </div>
                </div>

                {/*<!--属性值编辑-->*/}
                <div className="attribute_info_box">
                    {/*<!--目前属性信息-->*/}
                    <div>属性值：</div>
                    {/*<!--当前的属性信息 开始-->*/}
                    <div className="attribute_info">
                        {/*<!--属性标题信息-->*/}
                        <div className="attribute_name_box">
                            <div className="attribute_title">属性值名称：</div>
                            <Input className="attribute_input" name="attribute_value" id="dom_attribute_value" ref={this.dom_attribute_value} onChange={(e)=>this.dom_attribute_value_handle_change(e)} value={this.state.dom_attribute_value}  defaultValue="白色" placeholder="请输入属性值" style={{width:"220px"}}/>
                        </div>
                        <div className="attribute_name_box">
                            <div className="attribute_title">属性图：</div>
                            <div className="attribute_img_box">
                                {this.state.product_images.map(function (image_data){
                                    return (
                                        <div key={nanoid()} className={"attribute_img "+ (_this.state.attribute_images_select_map[image_data['file_id']]?'select':'')} data-id={image_data['file_id']} onClick={()=>_this.attribute_img_select(image_data['file_id'])}>
                                            <img width={30} src={image_data['web_path']} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {/*<!--属性值变更-->*/}
                        <div className="attribute_action_box" style={{paddingLeft:"120px"}}>
                            <Button type="link" style={{padding:"0 5px"}} onClick={()=>this.add_attribute_value()}>添加</Button>
                            <Button type="link" style={{padding:"0 5px"}} onClick={()=>this.del_attribute_value()}>删除</Button>
                        </div>
                    </div>
                    {/*<!--当前属性信息 结束-->*/}
                </div>


                {/*<!--新增属性框 结束-->*/}
            </>
        )
    }
}
export default Header
