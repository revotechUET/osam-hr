import React from "react";
import { withRouter } from "react-router-dom";
import { Checkbox, MenuItem, Select } from '@material-ui/core';
import apiService from '../../service/api.service';
import Autocomplete from './../../components/Autocomplete';
import BorderBottomInput from "./../../components/BorderBottomInput";
import BorderedContainer from "./../../components/BorderedContainer";
import Loading from '../../components/Loading';
import { withSnackbar } from 'notistack';
import './style.less';

class StaffEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      email: '',
      active: true,
      role: '',
      errors: {},
      departments: null,
      departmentList: [],
      contract: {},
      emailLists: null,
      contracts: null,
      loading: false
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleContractChange = this.handleContractChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleActiveStatus = this.handleActiveStatus.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  componentDidMount() {
    //load department
    // this.clear();
    let user = this.props.history.location.state.user || {};
    console.log(user);
    //console.log(user);
    this.setState({
      userName: user.name,
      email: user.email,
      role: user.role,
      acitve: user.active,
      departmentList: user.departments.map((v)=>(v.id)),
      contract: user.idContract,
      idUser: user.id,
      loading: false,
      departments: [],
    })
    this.load();
  }

  async load() {
    this.setState({
      loading: true
    })
    let promises = [];
    //console.log('run');
    promises.push(this.loadEmailList());
    promises.push(this.loadDepartments());
    promises.push(this.loadContracts());
    await Promise.all(promises);
    //console.log('done');
    this.setState({
      loading: false
    });
  }

  async loadEmailList() {
    let rs = await apiService.listEmails();
    this.setState({ emailLists: rs });
  }

  async loadDepartments() {
    let rs = await apiService.listDepartment({});
    this.setState({ departments: rs });
  }

  async loadContracts() {
    let rs = await apiService.getContracts();
    this.setState({ contracts: rs });
  }

  handleNameChange(evt) {
    this.setState({ userName: evt.target.value });
  }

  async handleSave(e) {
    if (this.handleValidation()) {
      let data = {
        name: this.state.userName,
        active: this.state.active,
        idContract: this.state.contract,
        role: this.state.role,
        departments: this.state.departmentList
      }
      this.setState({
        loading: true
      });
      let key = this.props.enqueueSnackbar("Đang cập nhật thông tin nhân viên");
      try {
        await apiService.updateUserById(this.state.idUser, data);
        this.props.closeSnackbar(key);
        this.props.enqueueSnackbar("Cập nhật thông tin nhân viên thành công", {variant: "success"});
        this.props.history.push('/staffs');
      } catch (e) {
        this.props.enqueueSnackbar(e.message, {variant: "error"});
      }
    }
    else {
      // do nothing
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
    if (this.state.loading) return <Loading />
    return (
      <div className="StaffEdit">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={this.handleSave} style={{background: "linear-gradient(120deg, #67dc2c, #38c53e)"}}></div>
          <div className="my-button ti ti-close" onClick={this.handleCancel} style={{background: "#ddd", boxShadow: "none", color: "#888"}}></div>
          <div className="title">Nhân viên / {this.state.email}</div>
        </div>
        <BorderedContainer>
          <div className="item-wrap">
            <span>Tên nhân viên</span>
            <div>
              <BorderBottomInput placeholder="Tên nhân viên" value={this.state.userName} onChange={this.handleNameChange} />
            </div>
            <div className="error">{this.state.errors["name"]}</div>
          </div>
          <div className="item-wrap">
            <span>Hợp đồng</span>
            <div>
              <Select onChange={(e) => {
                  this.setState({ contract: e.target.value });
                }}
                value = {this.state.contract}
                style={{ flex: 1 }}
                outlined="true"
              >
                {
                  (this.state.contracts || []).map((e, idx)=>
                    <MenuItem key={idx} value={e.id}>{e.name}</MenuItem>
                  )
                }
              </Select>
            </div>
          </div>
          <div className="item-wrap">
            <span>Bộ phận</span>
            <div>
              <Autocomplete
                multiple
                filterSelectedOptions
                loading={this.state.departments === null}
                style={{ flex: 1 }}
                options={this.state.departments}
                value={(this.state.departments || []).filter(o => this.state.departmentList.includes(o.id))}
                keyProp='id'
                labelProp='name'
                onChange={(event, values) => {
                  this.setState({ departmentList: values.map(v => v.id) });
                }}/>
            </div>
          </div>
          <div className="item-wrap" style={{width: "80px"}}>
            <span>Hoạt động</span>
            <div>
              <Checkbox checked={this.state.active} onChange={(e) => this.handleActiveStatus(e.target.checked)} />
            </div>
          </div>
          <div className="item-wrap">
            <span>Vai trò</span>
            <div>
            <Select onChange={(e) => {
                this.setState({ role: e.target.value });
              }}
              value = {this.state.role}
              style={{ flex: 1 }}
              outlined="true"
            >
              {
                optionsForRole.map((e,idx)=>
                  <MenuItem key={idx} value={e.value}>{e.name}</MenuItem>
                )
              }
            </Select>
            </div>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

let optionsForRole = [
  { value: "user", name: "Nhân viên" },
  { value: "manager", name: "Back Office" },
  { value: "admin", name: "Admin" }
];

export default withSnackbar(withRouter(StaffEditPage));
