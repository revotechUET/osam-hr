import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import ChipsContainer from './../../components/ChipsContainer';

import './style.less'

class DepartmentNewPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className = "DepartmentNew">
        <h1 style={{ marginBottom: "10px" }}>Bộ Phận / Mới</h1>
        <div style={{ display: "flex" }}>
          <div className="my-button active-btn">Lưu</div>
          <div className="my-button">Hủy</div>
        </div>
        <BorderedContainer>
          <h3>Tên Bộ Phận</h3>
          <BorderBottomInput placeholder="Tên Bộ Phận"/>
          <div className="input-field">
            <div className = "label">Người quản lý</div>
            <input className = "input"/>
          </div>
          <div className="input-field">
            <div className = "label">Người phụ trách duyệt leave request</div>
            <div className = "input">
              <ChipsContainer/>
            </div>
          </div>
          <div className="input-field">
            <div className = "label">Hoạt động</div>
            <input className = "input checkbox" type="checkbox"/>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(DepartmentNewPage);
