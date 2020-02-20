import React from "react";
import { withRouter } from "react-router-dom";
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import apiService from '../../service/api.service';
import Autocomplete from './../../components/Autocomplete';
import BorderBottomInput from "./../../components/BorderBottomInput";
import BorderedContainer from "./../../components/BorderedContainer";
import './style.less';

class StaffNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countActive: 0,
      userName: '',
      email: '',
      active: true,
      role: '',
      errors: {},
      departments: null,
      departmentList: [],
      contract: null,
      emailLists: null,
      idUser: null
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleContractChange = this.handleContractChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus = this.handleActiveStatus.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  componentDidMount() {
    //load department
    this.clear();
    this.load();
  }

  clear() {
    this.setState({
      countActive: 0,
      userName: '',
      email: '',
      active: true,
      role: '',
      errors: {},
      departments: null,
      contracts: null,
      departmentList: [],
      contract: null,
      emailLists: null,
      idUser: null
    })
  }

  load() {
    this.loadEmailList();
    this.loadDepartments();
    this.loadContracts();
  }

  async loadEmailList() {
    let rs = [];
    try {
      rs = await apiService.listEmails();
    } catch(e) {
      console.log(e);
    }
    this.setState({
      emailLists: rs
    });
  }

  async loadDepartments() {
    let rs = await apiService.listDepartment();
    this.setState({
      departments: rs
    });
  }

  async loadContracts() {
    let rs = await apiService.getContracts();
    this.setState({
      contracts: rs
    });
  }

  handleNameChange(evt) {
    this.setState({ userName: evt.target.value });
  }

  async handleSave(e) {
    if (this.handleValidation()) {
      let data = {
        "name": this.state.userName,
        "email": this.state.email,
        "id": this.state.idUser,
        "active": this.state.active,
        "idContract": this.state.contract,
        "role": this.state.role,
        "departments": this.state.departmentList
      }
      await apiService.appendUser(data);
      this.props.history.push('/staffs'); 
    }
    else {
      console.log(this.state.errors);
    }
    e.preventDefault();
  }

  handleValidation() {
    let formIsValid = true;
    let e = {};

    // name
    if (this.state.userName === '') {
      formIsValid = false;
      e["name"] = "Cannot be empty";
    }

    //Email
    if (this.state.email === '') {
      formIsValid = false;
      e["email"] = "Cannot be empty";
    }
    this.setState({
      errors: e
    });
    return formIsValid;
  }

  handleEmailChange(evt) {
    this.setState({ email: evt.target.value });
  }

  handleContractChange(evt) {
    this.setState({ contract: evt.target.value })
  }

  handleDepartmentChange() {

  }

  handleRoleChange(evt) {
    this.setState({ role: evt.target.value });
  }

  handleCancel() {
    this.props.history.push('/staffs');
  }

  handleActiveStatus(e) {
    this.setState({ active: e });
  }

  render() {
    return (
      <div className="StaffNew">
        <h1 style={{ marginBottom: "10px" }}>Nhân viên / Mới</h1>
        <div style={{ display: "flex" }}>
          <button className="my-button active-btn" onClick={this.handleSave}>Lưu</button>
          <button className="my-button" onClick={this.handleCancel}>Hủy</button>
        </div>
        <BorderedContainer>
          <h3>Tên nhân viên</h3>
          <BorderBottomInput placeholder="Tên nhân viên" value={this.state.userName} onChange={this.handleNameChange} />
          <span className="error">{this.state.errors["name"]}</span>
          <div className="input-field">
            <div className="label" >Email</div>
            <Autocomplete
              filterSelectedOptions
              loading={this.state.emailLists === null}
              style={{ flex: 1 }}
              options={this.state.emailLists}
              keyProp='id'
              labelProp='primaryEmail'
              onChange={(event, value) => {
                this.setState({ email: value.primaryEmail, idUser: value.id });
              }}
            />
            {/* <span className="error">{this.state.errors['email']}</span> */}
          </div>
          <div className="input-field">
            <div className="label" ></div>
            <span className="error">{this.state.errors['email']}</span>
          </div>
          <div className="input-field">
            <div className="label">Hợp đồng</div>
            <Autocomplete
              filterSelectedOptions
              loading={this.state.contracts === null}
              style={{ flex: 1 }}
              options={this.state.contracts}
              keyProp='id'
              labelProp='name'
              onChange={(event, value) => {
                this.setState({ contract: value.id });
              }}
            />
          </div>
          <div className="input-field">
            <div className="label">Bộ phận</div>
            <Autocomplete
              multiple
              filterSelectedOptions
              loading={this.state.departments === null}
              style={{ flex: 1 }}
              options={this.state.departments}
              keyProp='id'
              labelProp='name'
              onChange={(event, values) => {
                this.setState({ departmentList: values.map(v => v.id) });
              }}
            />
          </div>
          <div className="input-field">
            <div className="label">Hoạt động</div>
            <input className="input checkbox" type="checkbox" checked={this.state.active} onChange={(e) => this.handleActiveStatus(e.target.checked)} />
          </div>
          <div className="input-field">
            <div className="label">Vai trò</div>
            {/* <select className="input" defaultValue='' onChange={this.handleRoleChange}>
              <option value="" disabled hidden>Choose here</option>
              <option value="user">Nhân viên</option>
              <option value="manager">Back Office</option>
              <option value="admin">Admin</option>
            </select> */}
            <Autocomplete
              filterSelectedOptions
              //loading={this.state.contracts === null}
              style={{ flex: 1 }}
              options={[
                { value: "user", name: "Nhân viên" },
                { value: "manager", name: "Back Office" },
                { value: "admin", name: "Admin" }
              ]}
              keyProp='value'
              labelProp='name'
              onChange={(event, value) => {
                //console.log(value);
                this.setState({ role: value.value });
              }}
            />
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffNewPage);
