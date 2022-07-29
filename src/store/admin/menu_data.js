import { createSlice } from '@reduxjs/toolkit'

//定义初始化状态
const initialState = {
    menu_list: [],
}
export const app = createSlice({
    name: 'menu_data',
    initialState,
    reducers: {
        /*设置菜单*/
        set_menu:(state,params)=>{
            let data=params['payload']
            state.menu_list=data
        },
        /*更新菜单*/
        set_menu_click:(state,params)=>{
            let data=params['payload']
            console.log(...state.menu_list)
            state.menu_list['1000']['fold'] =!state.menu_list['1000']['fold']


            //state.menu_list=data
        }
    },
})

// reducer方法的每一个case都会生成一个Action
export const {set_menu,set_menu_click} = app.actions

export default app.reducer