import { createSlice } from '@reduxjs/toolkit'

//定义初始化状态
let initialState = {
    menu_list: [],
    menu_tier: [],
}
export const app = createSlice({
    name: 'menu_data',
    initialState,
    reducers: {
        /*设置菜单数据*/
        set_menu: (state, params) => {
            let data = params['payload']
            state.menu_list = data
        },
        /*匹配当前菜单*/
        set_menu_tier: (state, params) => {
            let data = params['payload']
            //查找菜单层级
            function find_menu_tier(menu_data, pathname) {
                //找到页面对应的菜单层级关系
                let menu_lavel = []
                menu_data.map(function (value, key) {
                    if (typeof (value['href']) != "undefined" && pathname.indexOf(value.href) >= 0) {
                        menu_lavel.push(value);
                    }
                    if (typeof (value['child']) != "undefined") {
                        let temp_menu = find_menu_tier(value['child'], pathname);
                        if (temp_menu.length >= 1) {
                            temp_menu.forEach(function (item) {
                                menu_lavel.push(item)
                            })
                            menu_lavel.push(value)
                        }
                    }
                    return value
                })
                return menu_lavel
            }
            let menu_tier=find_menu_tier(state.menu_list, data);
            state.menu_tier = menu_tier.reverse()
        },
    },
})

// reducer方法的每一个case都会生成一个Action
export const { set_menu, set_menu_tier,get_menu_tier } = app.actions

export default app.reducer