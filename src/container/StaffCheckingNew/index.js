import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import apiService from '../../service/api.service';

import './style.less'

class StaffCheckingNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffName: '',
      date: new Date(),
      checkIn: '',
      checkOut: '',
      note: ''
    }

    this.handleCancle = this.handleCancle.bind(this);
    this.handleStaffNameChange = this.handleStaffNameChange.bind(this);
    this.handleCheckInChange = this.handleCheckInChange.bind(this);
    this.handleCheckOutChange = this.handleCheckOutChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    let data = {
      date: this.state.date.toISOString(),
      checkinTime: this.state.checkIn,
      checkoutTime: this.state.checkOut,
      reportContent: "toDo",
      responseContent: "toDo",
      reportStatus: "toDo",
      idUser: "toDo",
      note: this.state.note
    }

    console.log(data);

    apiService.checkingNew(data);
  }
  handleCheckInChange(evt) {
    this.setState({ checkIn: evt.target.value });
  }

  handleCheckOutChange(evt) {
    this.setState({ checkOut: evt.target.value });
  }

  handleCancle() {
    this.props.history.push('/checking');
  }

  handleStaffNameChange(evt) {
    this.setState({ staffName: evt.target.value });
  }

  handleDateChange(val) {
    this.setState({ date: val });
  }

  handleNoteChange(evt) {
    this.setState({ note: evt.target.value });
  }
  render() {
    return (
      <div className="StaffCheckingNew">
        <h1 style={{ marginBottom: "10px" }}>Chấm công / Mới</h1>
        <div style={{ display: "flex" }}>
          <button className="my-button active-btn" onClick={this.handleSave}>Lưu</button>
          <button className="my-button" onClick={this.handleCancle}>Hủy</button>
        </div>
        <BorderedContainer>
          <h3>Mới</h3>
          <div className="input-field">
            <div className="label">Nhân Viên</div>
            <input className="input" value={this.state.staffName} onChange={this.handleStaffNameChange} />
          </div>
          <div className="input-field">
            <div className="label">Ngày</div>
            {/* <input type="date" value={this.state.date} onChange={this.handleCheckInChange}/> */}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker value={this.state.date} onChange={this.handleDateChange} />
            </MuiPickersUtilsProvider>
          </div>

          <div className="input-field">
            <div className="label">Check in</div>
            <input type="time" value={this.state.checkIn} onChange={this.handleCheckInChange} />
          </div>
          <div className="input-field">
            <div className="label">Check out</div>
            <input type="time" value={this.state.checkOut} onChange={this.handleCheckOutChange} />
          </div>
          <div className="input-field">
            <div className="label">Ghi chú</div>
            <input className="input" value={this.state.note} onChange={this.handleNoteChange} />
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffCheckingNewPage);
