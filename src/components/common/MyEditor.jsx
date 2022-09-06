import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import {useImperativeHandle, useRef} from "preact/hooks";

function MyEditor(props) {
    // editor 实例
    const [editor, setEditor] = useState(null)                   // JS 语法

    // 编辑器内容
    const [html, setHtml] = useState('<p>hello</p>')

    useEffect(() => {
        setHtml('')
    })
    // 工具栏配置
    const toolbarConfig = { }
    let server_url = process.env.REACT_APP_SERVER_URL;

    // 编辑器配置
    const editorConfig = {                         // JS 语法
        placeholder: '请输入内容...',
        MENU_CONF:{
            'uploadImage':{
                server: server_url+'/admin/upload/editor_image',
                ustomInsert(res, insertFn) {

                    // res 即服务端的返回结果
                    if(res['code']=='200'){
                        let image_list=res['data'];
                        console.log(image_list)
                        image_list.forEach(function (image){
                            insertFn(image['web_path'], image['file_name'], image['web_path'])
                        })
                    }

                },
            }
        }
    }

    editorConfig.MENU_CONF['uploadVideo'] = {
        // form-data fieldName ，默认值 'wangeditor-uploaded-video'
        fieldName: 'your-custom-name',
        // 单个文件的最大体积限制，默认为 10M
        maxFileSize: 20 * 1024 * 1024, // 20M
        // 最多可上传几个文件，默认为 5
        maxNumberOfFiles: 3,
        // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['video/*'],

        // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
        meta: {
            token: 'xxx',
            otherKey: 'yyy'
        },

        // 将 meta 拼接到 url 参数中，默认 false
        metaWithUrl: false,

        // 自定义增加 http  header
        headers: {
            Accept: 'text/x-json',
            otherKey: 'xxx'
        },

        // 跨域是否传递 cookie ，默认为 false
        withCredentials: true,

        // 超时时间，默认为 30 秒
        timeout: 15 * 1000, // 15 秒

        // 视频不支持 base64 格式插入
    }




    function onChange(editor) {
        props.get_html(editor.getHtml())
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100}}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={onChange}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
        </>
    )
}

export default MyEditor
