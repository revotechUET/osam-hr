import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import ChipsContainer from './../../components/ChipsContainer';
import apiService from '../../service/api.service';
import './style.less'

class StaffNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countActive : 0,
      userName    : '',
      email       : '',
      active      : true,
      contract    : '',
      role        : '',
      errors       : {}
    };

    this.handleSave             = this.handleSave.bind(this);
    this.handleCancel           = this.handleCancel.bind(this);
    this.handleEmailChange      = this.handleEmailChange.bind(this);
    this.handleContractChange   = this.handleContractChange.bind(this);
    this.handleRoleChange       = this.handleRoleChange.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus     = this.handleActiveStatus.bind(this);
    this.handleNameChange       = this.handleNameChange.bind(this);
    this.handleValidation       = this.handleValidation.bind(this);
  }

  handleNameChange(evt){
    this.setState({userName : evt.target.value});
  }
  async handleSave(e){
    let id = await apiService.generateUid();
    if(this.handleValidation()){
      let data = {
        "id"        : id, 
        "name"      : this.state.userName,
        "email"     : this.state.email,
        "active"    : this.state.active,
        "idContract"  : this.state.contract,
        "role"      : this.state.role
      }
      apiService.appendUser(data);
    }
    else {
      console.log(this.state.errors);
    }
    e.preventDefault();
  }


  handleEmailChange(evt){
    this.setState({email : evt.target.value});
  }

  handleContractChange(evt){
    this.setState({contract : evt.target.value})
  }

  handleDepartmentChange(){

  }

  handleRoleChange(evt){
    this.setState({role : evt.target.value});
  }

  handleCancel(){
    this.props.history.push('/staffs');
  }

  handleActiveStatus(e){
    this.setState({active : e});
  }

  handleValidation(){
    let formIsValid = true;
    let e           = {};

    // name
    if(this.state.userName === ''){
      formIsValid = false;
      e["name"] = "Cannot be empty";
    }

    //Email
    if(this.state.email === ''){
      formIsValid = false;
      e["email"] = "Cannot be empty";
    }

    if(this.state.email !== ''){
      let lastAtPos = this.state.email.lastIndexOf('@');
      let lastDotPos = this.state.email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
        formIsValid = false;
        e["email"] = "Email is not valid";
      }
    }
    this.setState({
      errors : e
    })
    return formIsValid;
  }

  render() {
    return (
      <div className = "StaffNew">
        <h1 style={{ marginBottom: "10px" }}>Nhân viên / Mới</h1>
        <div style={{ display: "flex" }}>
          <button className="my-button active-btn" onClick={this.handleSave}>Lưu</button>
          <button className="my-button" onClick={this.handleCancel}>Hủy</button>
        </div>
        <BorderedContainer>
          <h3>Tên nhân viên</h3>
          <BorderBottomInput placeholder="Tên nhân viên" value = {this.state.userName} onChange = {this.handleNameChange}/>
          <span className="error">{this.state.errors["name"]}</span>
          <div className="input-field">
            <div className = "label" >Email</div>
            <input className = "input" value={this.state.email} onChange={this.handleEmailChange}/>
            {/* <span className="error">{this.state.errors['email']}</span> */}
          </div>
          <div className="input-field">
            <div className = "label" ></div>
            <span className="error">{this.state.errors['email']}</span>
          </div>
          <div className="input-field">
            <div className = "label">Hợp đồng</div>
            <select className = "input" onChange={this.handleContractChange}>
                <option value="" selected disabled hidden>Choose here</option>
                <option value="Hợp đồng 1">Hợp đồng 1</option>
                <option value="Hợp đồng 2">Hợp đồng 2</option>
                <option value="Hợp đồng 3">Hợp đồng 3</option>
                <option value="Hợp đồng 4">Hợp đồng 4</option>
            </select>
          </div>
          <div className="input-field">
            <div className = "label">Bộ phận</div>
            <div className="input">
                <ChipsContainer />
            </div>
          </div>
          <div className="input-field">
            <div className = "label">Hoạt động</div>
            <input className = "input checkbox" type="checkbox" onChange={(e)=>this.handleActiveStatus(e.target.checked)}/>
          </div>
          <div className="input-field">
            <div className = "label">Vai trò</div>
            <select className = "input" onChange={this.handleRoleChange}>
                <option value="" selected disabled hidden>Choose here</option>
                <option value="CEO">CEO</option>
                <option value="CTO">CTO</option>
                <option value="Nhân Viên">Nhân viên</option>
                <option value="Bảo Vệ">Bảo vệ</option>
            </select>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffNewPage);
