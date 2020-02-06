import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";


import './style.less'

class StaffCheckingNewPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className = "StaffNew">
        <h1 style={{ marginBottom: "10px" }}>Chấm công / Mới</h1>
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
            <div className = "label">Ngày</div>
            <input type="date"/>
          </div>
        
          <div className = "input-field">
            <div className = "label">Check in</div>
            <input type="time" />
          </div>
          <div className = "input-field">
            <div className = "label">Check out</div>
            <input type="time" />
          </div>
          <div className="input-field">
            <div className = "label">Ghi chú</div>
            <input className = "input"/>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffCheckingNewPage);
