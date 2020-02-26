import React from "react";
import { withRouter } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
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
      departments : []

    };
    this.handleManagerChange = this.handleManagerChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus = this.handleActiveStatus.bind(this);
  }

  async handleSave() {
    console.log(this.state.idRequester, this.state.departments);
    if(!isInDepartment){
      this.state.idRequester.departments.push()
    }
  
    let data = {
      name: this.state.departmentName,
      idManager: this.state.idRequester.id,
      idApprovers: this.state.idApprovers,
      active: this.state.active
    };
    let addNewDepartment = await apiService.addNewDepartment(data);
    
    if (addNewDepartment) {
      this.props.history.push('/departments');
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
    let users = await apiService.listUsers({full : true});
    let department = await apiService.listDepartment({});
    this.setState({ manager: users, approvers: users , departments : department});
  }
  render() {
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
                  this.setState({ idRequester: value});
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
              <input className="input checkbox" type="checkbox" checked={this.state.active} onClick={this.handleActiveStatus} />
            </div>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(DepartmentNewPage);
