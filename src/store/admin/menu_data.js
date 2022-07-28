import { createSlice } from '@reduxjs/toolkit'

//定义初始化状态
const initialState = {
    menu_list: {},
}
export const app = createSlice({
    name: 'menu_data',
    initialState,
    reducers: {
        set_menu: (state) =>{
            console.log(state)
            //state.menu_list=state
        }
    },
})

// reducer方法的每一个case都会生成一个Action
export const {set_menu} = app.actions

export default app.reducer