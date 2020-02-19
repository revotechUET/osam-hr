import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import ChipsContainer from './../../components/ChipsContainer';
import './style.less';
import apiService from '../../service/api.service';

class DepartmentNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentName : '',
      manager        : '',
      active         : true,
      countActive    : 0,
      name           : ''
    };
    this.handleManagerChange    = this.handleManagerChange.bind(this);
    this.handleSave             = this.handleSave.bind(this);
    this.handleCancel           = this.handleCancel.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus     = this.handleActiveStatus.bind(this);
  }

  async handleSave(event){
    let data = {
      "name"        : this.state.departmentName,
      "active"      : this.state.active.toString(),
      "idManager"   : "Le Van Thinh",
      "idApprovers" : "Mr.Thinh"
    }
    let newSheetData = await apiService.addNewDepartment(data);
    console.log(newSheetData);
    event.preventDefault();
  }

  handleCancel(){
    this.props.history.push('/departments');
  }

  handleManagerChange(event){
    this.setState({manager : event.target.value});
  }

  handleDepartmentChange(event){
    this.setState({departmentName : event.target.value});
  }

  async componentDidMount(){

  }

  handleActiveStatus(){
    this.state.countActive += 1;
    if(this.state.countActive % 2 === 0){
      this.setState({active : false});
    }
    else if (this.state.countActive % 2 !== 0){
      this.setState({active : true});
    }
  }

  render() {
    return (
      <div className = "DepartmentNew">
        <h1 style={{ marginBottom: "10px" }}>Bộ Phận / Mới</h1>
        <div style={{ display: "flex" }}>
          <button className="my-button active-btn" onClick={this.handleSave}>Lưu</button>
          <button className="my-button" onClick={this.handleCancel}>Hủy</button>
        </div>
        <BorderedContainer>
          <h3>Tên Bộ Phận</h3>
          <BorderBottomInput placeholder="Tên Bộ Phận" value = {this.state.departmentName} onChange={this.handleDepartmentChange}/>
          <div className="input-field">
            <div className = "label">Người quản lý</div>
            <input className = "input" value={this.state.manager} onChange={this.handleManagerChange}/>
          </div>
          <div className="input-field">
            <div className = "label">Người phụ trách duyệt leave request</div>
            <div className = "input">
              <ChipsContainer/>
            </div>
          </div>
          <div className="input-field">
            <div className = "label">Hoạt động</div>
            <input className = "input checkbox" type="checkbox" onClick={this.handleActiveStatus}/>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(DepartmentNewPage);
