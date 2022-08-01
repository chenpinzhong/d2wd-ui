import { createSlice } from '@reduxjs/toolkit'

//定义初始化状态
let initialState = {
    menu_list: [],
}
export const app = createSlice({
    name: 'menu_data',
    initialState,
    reducers: {
        /*设置菜单数据*/
        set_menu:(state,params)=>{
            let data=params['payload']
            state.menu_list=data
        },
        /*匹配当前菜单*/
        set_current_menu:(state,params)=>{
            
        },
    },
})

// reducer方法的每一个case都会生成一个Action
export const {set_menu,get_current_menu} = app.actions

export default app.reducer