import React from 'react';
import {NavLink} from 'react-router-dom';
import './style.less';

export default function SideBar(props) {
    return (
        <div className = "SideBar">
                <div className="logo"></div>
                <NavLink className = "link-element" activeClassName='active' to='/staffs'><div className="nav-staff"></div>Quản lý nhân viên</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/departments'><div className="nav-setting"></div>Bộ phận</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/leaves'><div className="nav-bell"></div>Quản lý yêu cầu nghỉ</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/checking'><div className="nav-setting"></div>Quản lý chấm công</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/payroll'><div className="nav-staff"></div>Tính công</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/contracts'><div className="nav-bell"></div>Quản lý hợp đồng</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/notifies'><div className="nav-bell"></div>Thông báo</NavLink>
                <NavLink className = "link-element" activeClassName='active' to='/setting'><div className="nav-setting"></div>Cài đặt</NavLink>
                <NavLink className = "link-element" activeClassName='active' to='/test'><div className="nav-setting"></div>Test</NavLink>
        </div>
    )
}
