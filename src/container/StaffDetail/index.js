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
          <div className="title-vs-btn">
            <div className="my-button active-btn ti ti-check" style={{background: "linear-gradient(120deg, #67dc2c, #38c53e)"}}></div>
            <div className="my-button ti ti-close"  style={{background: "#ddd", boxShadow: "none", color: "#888"}}></div>
            <div className="title">Nhân viên / {this.state.user.name || "Loading..."}</div>
          </div>
        <BorderedContainer>
        <div className="item-detail">
          <div className="infor-item-detail">
            <span>Nhân viên</span>
            <div style={{fontWeight: "bold", fontSize: "150%", marginBottom: "20px"}}>{this.state.user.name || "Loading..."}</div>
            <div style={{display: "flex", flexDirection: "column"}}>
              <div style={{display: "flex", marginBottom: "10px"}}>
                  <div style={{flexBasis: "120px", fontWeight: "bold"}}>Email</div>
                  <div style={{flex: 1}}>{this.state.user.email || "Loading..."}</div>
              </div>
              <div style={{display: "flex", marginBottom: "10px"}}>
                  <div style={{flexBasis: "120px", fontWeight: "bold"}}>Hợp đồng</div>
                  <div style={{flex: 1}}>{(this.state.user.contract || {}).name || "Loading..."}</div>
              </div>
              <div style={{display: "flex", marginBottom: "10px"}}>
                  <div style={{flexBasis: "120px", fontWeight: "bold"}}>Bộ phận</div>
                  <div style={{flex: 1}}>{(this.state.user.departments || []).map((e)=>e.name).join(", ")}</div>
              </div>
              <div style={{display: "flex", marginBottom: "10px"}}>
                  <div style={{flexBasis: "120px", fontWeight: "bold"}}>Vai trò</div>
                  <div style={{flex: 1}}>{role[this.state.user.role || "Loading"]}</div>
              </div>
              <div style={{display: "flex", marginBottom: "10px"}}>
                  <div style={{flexBasis: "120px", fontWeight: "bold"}}>Hoạt động</div>
                  <div style={{flex: 1}}><input className="input checkbox" type="checkbox" defaultChecked={this.state.user.active}  /></div>
              </div>
            </div>
          </div>
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