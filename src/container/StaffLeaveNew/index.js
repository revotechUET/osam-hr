import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import ChipsContainer from './../../components/ChipsContainer';
import apiServive from '../../service/api.service';

import './style.less'

class StaffLeaveNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffName : '',
      reason    : '',
      startTime  : '',
      endTime    : '',
      informTo  : '',
      decription: ''
    }

    this.handleStaffNameChange  = this.handleStaffNameChange.bind(this);
    this.handleReasonChange     = this.handleReasonChange.bind(this);
    this.handleStartTimeChange   = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange     = this.handleEndTimeChange.bind(this);
    this.handleInformToChange   = this.handleInformToChange.bind(this);
    this.handleDecriptionChange = this.handleDecriptionChange.bind(this);
    this.handleSave             = this.handleSave.bind(this);
    this.handleCancel           = this.handleCancel.bind(this);
  }

  async handleSave(){
    let id = await apiServive.generateUid();
    let data = {
      "id"    : id,
      "startTime" : this.state.startTime,
      "endTime"   : this.state.endTime,
      "reason"    : this.state.reason,
      "description" : this.state.description,
      "status"      : "wating",
      "idRequester" : await apiServive.generateUid(),
      "idApprover"  : await apiServive.generateUid()
    }

    apiServive.leaveNew(data);
  }
  handleCancel(){
    this.props.history.push('/leaves');
  }
  handleStaffNameChange(evt){
    this.setState({staffName:evt.target.value})
  }
  handleReasonChange(evt){
    this.setState({reason:evt.target.value})
  }
  handleStartTimeChange(evt){
    this.setState({startTime:evt.target.value})
  }
  handleEndTimeChange(evt){
    this.setState({endTime:evt.target.value})
  }
  handleInformToChange(evt){
    this.setState({informTo:evt.target.value})
  }
  handleDecriptionChange(evt){
    this.setState({decription:evt.target.value})
  }
  

  render() {
    return (
      <div className = "StaffLeaveNew">
        <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ / Mới</h1>
        <div style={{ display: "flex" }}>
          <div className="my-button active-btn">Lưu</div>
          <div className="my-button">Hủy</div>
        </div>
        <BorderedContainer>
          <h3>Mới</h3>
          <div className="input-field">
            <div className = "label">Nhân Viên</div>
            <input className = "input" value={this.state.staffName} onChange={this.handleStaffNameChange}/>
          </div>
          <div className="input-field">
            <div className = "label">Lý do nghỉ</div>
            <input className = "input" value={this.state.reason} onChange={this.handleReasonChange}/>
          </div>
        
          <div className = "input-field">
            <div className = "label">Thời gian bắt đầu</div>
            <input type="date" value={this.state.startTime} onChange={this.handleStartTimeChange} />
          </div>
          <div className = "input-field">
            <div className = "label">Thời gian kết thúc</div>
            <input type="date" value={this.state.endTime} onChange={this.handleEndTimeChange}/>
          </div>
          <div className="input-field">
            <div className = "label">Thông báo cho</div>
            {/* <div className = "input">
              <ChipsContainer/>
            </div> */}
          </div>
          <div className="input-field">
            <div className = "label">Mô tả</div>
            <input className = "input"/>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffLeaveNewPage);
