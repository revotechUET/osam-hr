import React from "react";
import { withRouter } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import apiService from '../../service/api.service';
import BorderBottomInput from "./../../components/BorderBottomInput";
import BorderedContainer from "./../../components/BorderedContainer";
import Loading from "../../components/Loading";
import './style.less';
import { Checkbox } from "@material-ui/core";
import { withSnackbar } from 'notistack';

class DepartmentEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentName: '',
      idManager: null,
      active: true,
      name: '',
      users: null,
      idApprovers: null,
      loading: false
    };
    this.handleManagerChange = this.handleManagerChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus = this.handleActiveStatus.bind(this);
  }

  async handleSave() {
    let id = this.props.match.params.id;
    let name = this.state.departmentName;
    let idManager = this.state.idManager;
    let idApprovers = this.state.idApprovers;
    let active = this.state.active;
    this.setState({
      loading: true
    });
    let key = this.props.enqueueSnackbar("Đang lưu");
    try {
      let edit = await apiService.editDepartment({ id, name, idManager, idApprovers, active });
      this.setState({
        loading: false
      });
      this.props.closeSnackbar(key);
      if (edit) {
        this.props.enqueueSnackbar("Lưu thành công", { variant: "success" });
        this.props.history.push('/departments');
      }
      else {
        this.props.enqueueSnackbar("Lỗi", { variant: "error" });
        console.log("Toang rồi");
      }
    } catch (e) {
      this.props.closeSnackbar(key);
      this.props.enqueueSnackbar(e.message, { variant: "error" });
      this.setState({loading: false});
    }
    
  }

  handleCancel() {
    this.props.history.push('/departments');
  }

  handleManagerChange(event) {
    this.setState({ manager: event.target.value });
  }

  handleDepartmentChange(event) {
    this.setState({ departmentName: event.target.value });
  }

  handleActiveStatus(e) {
    this.setState({ active: e.target.checked });
  }

  async componentDidMount() {
    let department = this.props.history.location.state.department || {};
    this.setState({
      departmentName: department.name,
      idManager: department.idManager,
      idApprovers: department.idApprovers,
      active: department.active,
      loading: true
    })
    let users = await apiService.listUsers();
    this.setState({ users, loading: false });
  }
  render() {
    const { users } = this.state;
    if (this.state.loading) return <Loading />
    return (
      <div className="DepartmentNew">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={this.handleSave} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
          <div className="my-button ti ti-close" onClick={this.handleCancel} style={{ background: "#ddd", boxShadow: "none", color: "#888" }}></div>
          <div className="title">Bộ Phận / Edit</div>
        </div>
        <BorderedContainer>
          <div className="item-wrap">
            <span>Tên Bộ Phận</span>
            <div>
              <BorderBottomInput placeholder="Tên Bộ Phận" value={this.state.departmentName} onChange={this.handleDepartmentChange} />
            </div>
          </div>
          <div className="item-wrap">
            <span>Người quản lý</span>
            <div>
              <Autocomplete
                loading={users === null}
                style={{ flex: 1 }}
                options={users}
                keyProp='id'
                labelProp='name'
                keyValue={this.state.idManager}
                onChange={(event, value) => {
                  this.setState({ idManager: value && value.id });
                }}
              />
            </div>
          </div>
          <div className="item-wrap">
            <span>Người phụ trách duyệt leave request</span>
            <div>
              <Autocomplete
                multiple
                filterSelectedOptions
                loading={users === null}
                style={{ flex: 1 }}
                options={users}
                keyProp='id'
                labelProp='name'
                keyValue={this.state.idApprovers}
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

export default withSnackbar(withRouter(DepartmentEdit));
