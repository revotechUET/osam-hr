import React from "react";
import { withRouter } from "react-router-dom";
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import apiService from '../../service/api.service';
import Autocomplete from './../../components/Autocomplete';
import BorderBottomInput from "./../../components/BorderBottomInput";
import BorderedContainer from "./../../components/BorderedContainer";
import Loading from '../../components/Loading';
import { withSnackbar } from 'notistack';
import './style.less';

class StaffNewPage extends React.Component {
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
      contract: null,
      emailLists: null,
      idUser: null,
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
    this.clear();
    this.load();
  }

  clear() {
    this.setState({
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
      idUser: null,
      loading: false
    });
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
    this.setState({
      loading: true
    });
    let key = this.props.enqueueSnackbar("Đang lưu thông tin nhân viên mới");
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
      try {
        await apiService.appendUser(data);
        this.props.closeSnackbar(key);
        this.props.enqueueSnackbar("Lưu thành công", {variant: "success"});
        this.props.history.push('/staffs'); 
      } catch (e) {
        this.props.enqueueSnackbar(e.message, {variant: "error"});
        this.setState({
          loading: false
        })
      }
    }
    else {
      console.log(this.state.errors);
    }
    e.preventDefault();
  }

  handleValidation() {
    let formIsValid = true;
    let e = {};
    this.setState({
      errors: e
    });
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

    //contract:
    if (!this.state.contract || this.state.contract.length < 1) {
      formIsValid = false;
      e["contract"] = "Can not be empty"
    }

    if (!this.state.role || this.state.role < 1) {
      formIsValid = false;
      e["role"] = "Can not be empty"
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
      <div className="StaffNew">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={this.handleSave} style={{background: "linear-gradient(120deg, #67dc2c, #38c53e)"}}></div>
          <div className="my-button ti ti-close" onClick={this.handleCancel} style={{background: "#ddd", boxShadow: "none", color: "#888"}}></div>
          <div className="title">Nhân viên / Mới</div>
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
            <span>Email</span>
            <div>
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
              <div className="error">{this.state.errors["email"]}</div>
            </div>
          </div>
          <div className="item-wrap">
            <span>Hợp đồng</span>
            <div>
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
              <div className="error">{this.state.errors["contract"]}</div>
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
              <input className="input checkbox" type="checkbox" checked={this.state.active} onChange={(e) => this.handleActiveStatus(e.target.checked)} />
            </div>
          </div>
          <div className="item-wrap">
            <span>Vai trò</span>
            <div>
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
            <div className="error">{this.state.errors["role"]}</div>
            </div>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withSnackbar(withRouter(StaffNewPage));
