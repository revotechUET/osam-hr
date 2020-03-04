import { Checkbox } from "@material-ui/core";
import { withSnackbar } from 'notistack';
import React from "react";
import { withRouter } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import Loading from "../../components/Loading";
import apiService from '../../service/api.service';
import BorderBottomInput from "./../../components/BorderBottomInput";
import BorderedContainer from "./../../components/BorderedContainer";
import './style.less';


class DepartmentNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentName: '',
      manager: null,
      idManager: null,
      active: true,
      name: '',
      approvers: null,
      idApprovers: null,
      loading: false,
      departments: [],
      nameDepartmentExist: false,
      idGroup: '',
      errors: {}

    };
    this.handleManagerChange = this.handleManagerChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus = this.handleActiveStatus.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  async handleSave() {
    this.setState({loading : true});
    if (!this.handleValidation()) return;
    let key = this.props.enqueueSnackbar("Đang lưu thông tin bộ phận mới", {variant: 'info', persist: true});
    let data = {
      name: this.state.departmentName,
      idManager: this.state.idManager.id,
      idApprovers: this.state.idApprovers || [this.state.idManager.id],
      active: this.state.active,
      idGroup: this.state.idGroup
    };
    try {
      const newDepartment = await apiService.addNewDepartment(data);
      if (newDepartment) {
        this.props.enqueueSnackbar("Lưu thành công", { variant: "success" });
        this.props.history.push('/departments');
      }
    } catch (e) {
      this.props.enqueueSnackbar(e.message, { variant: "error" });
    } finally {
      this.props.closeSnackbar(key);
      this.setState({loading: false});
    }
  }


  handleValidation() {
    let formIsValid = true;
    let e = {};
    // name
    if (this.state.departmentName === '') {
      formIsValid = false;
      e["name"] = "Cannot be empty";
    }
    this.state.departments.forEach((val, index) => {
      if (val.name === this.state.departmentName) {
        formIsValid = false;
        e["name"] = "Đã tồn tại";
      }
    });
    if (!this.state.idManager || !this.state.idManager.id) {
      formIsValid = false;
      e['manager'] = "Cannot be empty";
    }
    this.setState({
      errors: e
    });
    return formIsValid;
  }

  handleCancel() {
    this.props.history.push('/departments');
  }

  handleManagerChange(event) {
    this.setState({ manager: event.target.value });
  }

  handleDepartmentChange(event) {
    this.state.departments.forEach((val, index) => {
      if (val.name === event.target.value) {
        this.setState({ nameDepartmentExist: true });
      }
    })
    this.setState({ departmentName: event.target.value });
  }

  handleActiveStatus(e) {
    this.setState({ active: e.target.checked });
  }

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      let users = await apiService.listUsers({ full: true });
      let department = await apiService.listDepartment();
      this.setState({ manager: users, approvers: users, departments: department, loading: false });
    } catch (e) {
      this.setState({ loading: false });
      this.props.enqueueSnackbar(e.message, { variant: "error" });
    }

  }


  render() {
    // if (this.state.loading) return <Loading />
    return (
      <div className="DepartmentNew">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={this.handleSave} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
          <div className="my-button ti ti-close" onClick={this.handleCancel} style={{ background: "#ddd", boxShadow: "none", color: "#888" }}></div>
          <div className="title">Bộ Phận / New</div>
        </div>
        <BorderedContainer>
          <div className="item-wrap">
            <span>Tên Bộ Phận</span>
            <div>
              <BorderBottomInput placeholder="Tên Bộ Phận" value={this.state.departmentName} onChange={this.handleDepartmentChange} />
            </div>
            <div className="error">{this.state.errors["name"]}</div>
          </div>
          <div className="item-wrap">
            <span>Người quản lý</span>
            <div>
              <Autocomplete
                loading={this.state.manager === null}
                style={{ flex: 1 }}
                options={this.state.manager}
                keyProp='id'
                labelProp='name'
                onChange={(event, value) => {
                  this.setState({ idManager: value });
                }}
              />
            </div>
            <div className="error">{this.state.errors["manager"]}</div>
          </div>
          <div className="item-wrap">
            <span>Người phụ trách duyệt leave request</span>
            <div>
              <Autocomplete
                multiple
                filterSelectedOptions
                loading={this.state.approvers === null}
                style={{ flex: 1 }}
                options={this.state.approvers}
                keyProp='id'
                labelProp='name'
                onChange={(event, value) => {
                  this.setState({ idApprovers: value.map(v => v.id) });
                }}
              />
            </div>
          </div>
          <div className="item-wrap" style={{ width: "70px" }}>
            <span>Hoạt động</span>
            <div>
              <Checkbox checked={this.state.active} onChange={this.handleActiveStatus} />
            </div>
          </div>
        </BorderedContainer>

      </div>
    );
  }
}

export default withSnackbar(withRouter(DepartmentNewPage));
