import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";


import './style.less'

class ContractNewPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className = "ContractNew">
        <h1 style={{ marginBottom: "10px" }}>Loại hợp đồng</h1>
        
        <BorderedContainer>
          <div className="input-field">
            <div className = "label">Tên</div>
            <input className = "input" value="CTV"/>
          </div>
          <div className="input-field">
            <div className = "label">Cách tính công</div>
            <select className = "input">
                <option value="" selected disabled hidden>Theo ngày</option>
                <option value="1">Theo tháng</option>
                <option value="2">Theo năm</option>
            </select>
          </div>
          <div className="input-field">
            <div className = "label">Ăn trưa</div>
            <input className = "input checkbox" type="checkbox"/>
          </div>

          <div className="input-field">
            <div className = "label">Nghỉ phép</div>
            <input className = "input checkbox" type="checkbox"/>
          </div>

          <div style={{ display: "flex"}}>
          <div className="my-button active-btn">Lưu</div>
          <div className="my-button">Hủy</div>
        </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(ContractNewPage);
