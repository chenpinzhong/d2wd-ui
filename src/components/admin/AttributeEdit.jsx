import React,{createRef} from "react"
import {nanoid} from "nanoid";
import {Button,Input,message} from "antd";
import "../../pages/admin/css/base.css"


class Header extends React.Component {

    constructor(props) {
        super(props);
        //基础数据处理
        let product_images=props.product_images
        let attribute_images_select_map= {};//属性图选择表
        if(typeof(product_images)=="undefined")product_images=[];
        product_images.forEach(function (val){
            attribute_images_select_map[val['file_id']]=false;
        })

        //初始化属性值
        let attribute_value_map=props.attribute_value_map
        if(typeof(attribute_value_map)=="undefined")attribute_value_map={};


        this.state={
            product_images:product_images,
            attribute_images_select_map:attribute_images_select_map,
            attribute_value_map:attribute_value_map,
        };
        console.log(this.state.attribute_images_select_map)
    }
    dom_attribute_name=createRef();//属性名称
    dom_attribute_value=createRef();//属性值

    componentDidMount() {

    }
    attribute_img_select(id){
        for (let key in this.state.attribute_images_select_map){
            this.state.attribute_images_select_map[key]=false;
        }
        this.state.attribute_images_select_map[id]=true;//选择对应ID
        this.setState(this.state);//刷新页面
    }

    add_attribute_value() {
        let attribute_value=this.dom_attribute_value.current.input.value;
        let attribute_images_id=false;
        for (let key in this.state.attribute_images_select_map){
            if (this.state.attribute_images_select_map[key]==true){
                attribute_images_id=key;
            }
        }
        //属性值信息
        let attribute_value_info={}
        attribute_value_info['value']=attribute_value;
        attribute_value_info['images']=attribute_images_id;
        if((attribute_value in this.state.attribute_value_map)){
            message.info("属性值:"+attribute_value+" 已经存在!").then(r =>{});
            return false;
        }
        this.state.attribute_value_map[attribute_value]=attribute_value_info;
        return undefined;
    }

    modify_attribute_value() {
        return undefined;
    }

    del_attribute_value() {
        return undefined;
    }






    render() {
        let _this=this

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
                            <Input className="attribute_name" name="attribute_name" ref={this.dom_attribute_name} defaultValue="颜色" placeholder="请输入属性名" style={{width:"220px"}} />
                        </div>
                    </div>
                    <div className="attribute_info">
                        <div className="attribute_set">
                            <div className="attribute_set_name">属性值：</div>
                            <div className="attribute_value">白色</div>
                            <div className="attribute_value">黑色</div>
                        </div>
                    </div>
                    <div className="attribute_action_box" style={{paddingLeft:"120px"}}>
                        <Button type="link" style={{padding:"0 5px"}}>提交属性</Button>
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
                            <div className="attribute_title">属性值：</div>
                            <Input className="attribute_input" name="attribute_value" ref={this.dom_attribute_value} defaultValue="白色" placeholder="请输入属性值" style={{width:"220px"}}/>
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
                            <Button type="link" style={{padding:"0 5px"}} onClick={()=>this.modify_attribute_value()}>修改</Button>
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
