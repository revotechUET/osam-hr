import React from 'react';
import {NavLink} from 'react-router-dom';
import './style.less';

export default function SideBar(props) {
    return (
        <div className = "SideBar">
                <div className="logo"></div>
                <NavLink className = "link-element" activeClassName='active' to='/staffs'><div className="nav-staff"></div>Quản lý nhân viên</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/departments'><div className="nav-depar"></div>Quản lý bộ phận</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/leaves'><div className="nav-time"></div>Quản lý yêu cầu nghỉ</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/checking'><div className="nav-date"></div>Quản lý chấm công</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/payroll'><div className="nav-salary"></div>Tính công</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/contracts'><div className="nav-doc"></div>Quản lý hợp đồng</NavLink>
                <NavLink className = "link-element" activeClassName='active' to = '/notifies'><div className="nav-bell"></div>Thông báo</NavLink>
                <NavLink className = "link-element" activeClassName='active' to='/setting'><div className="nav-setting"></div>Cài đặt</NavLink>
                <NavLink className = "link-element" activeClassName='active' to='/test'><div className="nav-setting"></div>Test</NavLink>
                <NavLink className = "link-element" activeClassName='active' to='/tungtest'><div className="nav-setting"></div>Tung Test</NavLink>
        </div>
    )
}
