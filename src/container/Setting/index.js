import React from 'react';
import {withRouter} from 'react-router-dom';

import './style.less';

class SettingPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "SettingPage">
                <h1 style={{marginBottom: "10px"}}>Cài đặt</h1>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Ngày kết thúc kì lương
                    </div>
                    <div className = "fieldinput">
                        <select>
                            <option>Hello</option>
                        </select>
                    </div>
                </div>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Reset nghỉ phép của năm
                    </div>
                    <div className = "fieldinput">
                        <select>
                            <option>Hello</option>
                        </select>
                    </div>
                </div>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Lời chào buổi sáng
                    </div>
                    <div className = "fieldinput">
                        <input />
                    </div>
                </div>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Cài đặt ngày nghỉ trong năm
                    </div>
                    <div className = "fieldinput">
                        <button onClick={()=>{this.props.history.push("/setting/day-off")}}>Cài đặt</button>
                    </div>
                </div>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Cài đặt ca làm sáng
                    </div>
                    <div className = "fieldinput">
                        <input type="time" />
                    </div>
                </div>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Cài đặt ca làm chiều
                    </div>
                    <div className = "fieldinput">
                        <input type="time" />
                    </div>
                </div>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Cài đặt thời gian tính ăn trưa
                    </div>
                    <div className = "fieldinput">
                        Check in trước <input type="time" /> & Check out sau <input type="time" />
                    </div>
                </div>
                <div className = "fieldrow">
                    <div className = "fieldname">
                        Cài đặt ngày làm việc
                    </div>
                    <div className = "fieldinput">
                        <button>Cài đặt</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SettingPage);