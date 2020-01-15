import React from 'react';
import {NavLink} from 'react-router-dom';
import './style.less';

export default function SideBar(props) {
    return (
        <div className = "SideBar">
                <NavLink className = "link-element" exact={true} activeClassName='active' to='/staffs'>Quản lý nhân viên</NavLink>
                <NavLink className = "link-element" exact={true} activeClassName = 'active' to = '/departments'>Bộ phận</NavLink>
                <NavLink className = "link-element" exact={true} activeClassName='active' to = '/leaves'>Quản lý yêu cầu nghỉ</NavLink>
                <NavLink className = "link-element" exact={true} activeClassName='active' to = '/checking'>Quản lý chấm công</NavLink>
                <NavLink className = "link-element" exact={true} activeClassName='active' to = '/payroll'>Tính công</NavLink>
                <NavLink className = "link-element" exact={true} activeClassName='active' to = '/contracts'>Quản lý hợp đồng</NavLink>
                <NavLink className = "link-element" exact={true} activeClassName='active' to = '/notifies'>Thông báo</NavLink>
                <NavLink className = "link-element" exact={true} activeClassName='active' to='/setting'>Cài đặt</NavLink>
        </div>
    )
}
