import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import ChipsContainer from './../../components/ChipsContainer';

import './style.less'

class StaffNewPage extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
  }
  
  componentDidMount() {
    
  }

  render() {
    return (
      <div className = "StaffNew">
        <h1 style={{ marginBottom: "10px" }}>Nhân viên / Mới</h1>
        <div style={{ display: "flex" }}>
          <div className="my-button active-btn">Lưu</div>
          <div className="my-button">Hủy</div>
        </div>
        <BorderedContainer>
          <h3>Tên nhân viên</h3>
          <BorderBottomInput placeholder="Tên nhân viên"/>
          <div className="input-field">
            <div className = "label">Email</div>
            <input className = "input"/>
          </div>
          <div className="input-field">
            <div className = "label">Hợp đồng</div>
            <select className = "input"/>
          </div>
          <div className="input-field">
            <div className = "label">Bộ phận</div>
            <div className="input">
                <ChipsContainer />
            </div>
          </div>
          <div className="input-field">
            <div className = "label">Hoạt động</div>
            <input className = "input checkbox" type="checkbox"/>
          </div>
          <div className="input-field">
            <div className = "label">Vai trò</div>
            <select className = "input"/>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffNewPage);
