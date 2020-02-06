import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";


import './style.less'

class StaffLeaveNewPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className = "StaffNew">
        <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ / Mới</h1>
        <div style={{ display: "flex" }}>
          <div className="my-button active-btn">Lưu</div>
          <div className="my-button">Hủy</div>
        </div>
        <BorderedContainer>
          <h3>Mới</h3>
          <div className="input-field">
            <div className = "label">Nhân Viên</div>
            <input className = "input"/>
          </div>
          <div className="input-field">
            <div className = "label">Lý do nghỉ</div>
            <input className = "input"/>
          </div>
        
          <div className = "input-field">
            <div className = "label">Thời gian bắt đầu</div>
            <input type="date" />
          </div>
          <div className = "input-field">
            <div className = "label">Thời gian kết thúc</div>
            <input type="date" />
          </div>
          <div className="input-field">
            <div className = "label">Thông báo cho</div>
            <input className = "input"/>
          </div>
          <div className="input-field">
            <div className = "label">Mô tả</div>
            <input className = "input"/>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffLeaveNewPage);
