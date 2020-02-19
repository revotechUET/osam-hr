import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import ChipsContainer from './../../components/ChipsContainer';
import Autocomplete from "../../components/Autocomplete";
import apiService from '../../service/api.service';

import './style.less';
class DepartmentNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentName: '',
      manager: null,
      idManager: null,
      active: true,
      countActive: 0,
      name: '',
      approvers: null,
      idApprovers: null,
      loading: false,

    };
    this.handleManagerChange = this.handleManagerChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus = this.handleActiveStatus.bind(this);
  }

  async handleSave() {
    let data = {
      name: this.state.departmentName,
      active: this.state.active.toString(),
      idManager: this.state.idRequester,
      idApprovers: this.state.idApprovers,
      active     : this.state.active   
    };
    let addNewDepartment = await apiService.addNewDepartment(data);
    console.log(addNewDepartment);
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


  handleActiveStatus() {
    this.state.countActive += 1;
    if (this.state.countActive % 2 === 0) {
      this.setState({ active: false });
    }
    else if (this.state.countActive % 2 !== 0) {
      this.setState({ active: true });
    }
  }

  async componentDidMount() {
    let users = await apiService.listUsers();
    this.setState({ manager: users, approvers: users });
  }
  render() {
    return (
      <div className="DepartmentNew">
        <h1 style={{ marginBottom: "10px" }}>Bộ Phận / Mới</h1>
        <div style={{ display: "flex" }}>
          <button className="my-button active-btn" onClick={this.handleSave}>Lưu</button>
          <button className="my-button" onClick={this.handleCancel}>Hủy</button>
        </div>
        <BorderedContainer>
          <h3>Tên Bộ Phận</h3>
          <BorderBottomInput placeholder="Tên Bộ Phận" value={this.state.departmentName} onChange={this.handleDepartmentChange} />
          <div className="input-field">
            <div className="label">Người quản lý</div>
            <Autocomplete
              loading={this.state.manager === null}
              style={{ flex: 1 }}
              options={this.state.manager}
              keyProp='id'
              labelProp='name'
              onChange={(event, value) => {
                this.setState({ idRequester: value && value.id });
                console.log(this.state.idRequester);
              }}
            />
          </div>
          <div className="input-field">
            <div className="label">Người phụ trách duyệt leave request</div>
            <Autocomplete
              multiple
              filterSelectedOptions
              loading={this.state.approvers === null}
              style={{ flex: 1 }}
              options={this.state.approvers}
              keyProp='id'
              labelProp='name'
              onChange={(event, value) => {
                this.setState({ idApprovers: value && value.id });
                console.log(this.state.idApprovers);
              }}
            />
          </div>
          <div className="input-field">
            <div className="label">Hoạt động</div>
            <input className="input checkbox" type="checkbox" checked={this.state.active} onClick={this.handleActiveStatus} />
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(DepartmentNewPage);
