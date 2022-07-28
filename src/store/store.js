import { configureStore } from '@reduxjs/toolkit'
import menu_data from './admin/menu_data'
export default configureStore({
    reducer: {
        'menu_data': menu_data,//菜单数据
    },
})