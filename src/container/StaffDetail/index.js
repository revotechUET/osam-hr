import React from 'react';
import {withRouter} from 'react-router-dom';
import apiService from '../../service/api.service';
import Autocomplete from './../../components/Autocomplete';
import BorderBottomInput from "./../../components/BorderBottomInput";
import BorderedContainer from "./../../components/BorderedContainer";

class StaffDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    this.setState({
      user: this.props.history.location.state.user
    })
  }

  render() {
    return (
        <div className="StaffDetail">
        <h1 style={{ marginBottom: "10px" }}>Nhân viên / {this.state.user.name || "Loading..."}</h1>
        <div style={{ display: "flex" }}>
          <button className="my-button active-btn" >Sửa</button>
          <button className="my-button" >Xóa</button>
        </div>
        <BorderedContainer>
          <h3>Tên nhân viên</h3>
          <div className="input-field">
            <div className="label" >Email</div>
            <div>{this.state.user.email || "Loading..."}</div>
          </div>
          <div className="input-field">
            <div className="label">Hợp đồng</div>
            <div>{(this.state.user.contract || {}).name || "Loading..."}</div>
          </div>
          <div className="input-field">
            <div className="label">Bộ phận</div>
            <div>{(this.state.user.departments || []).map((e)=>e.name).join(", ")}</div>
          </div>
          <div className="input-field">
            <div className="label">Hoạt động</div>
            <input className="input checkbox" type="checkbox" defaultChecked={this.state.user.active}  />
          </div>
          <div className="input-field">
            <div className="label">Vai trò</div>
            <div>{role[this.state.user.role || "Loading"]}</div>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

let role = {
  "admin": "Admin",
  "manager": "Back office",
  "user": "Nhân viên",
  "Loading": "Loading"
}

export default withRouter(StaffDetailPage);