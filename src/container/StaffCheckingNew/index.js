import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import apiService from '../../service/api.service';
import Autocomplete from "../../components/Autocomplete";

import './style.less'

class StaffCheckingNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffName: null,
      date: new Date(0),
      checkIn: new Date(),
      checkOut: new Date(),
      note: '',
      idRequester: null,
    }

    this.handleCancle = this.handleCancle.bind(this);
    this.handleStaffNameChange = this.handleStaffNameChange.bind(this);
    this.handleCheckInChange = this.handleCheckInChange.bind(this);
    this.handleCheckOutChange = this.handleCheckOutChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async handleSave() {
    let data = {
      date: this.state.date.toISOString(),
      checkinTime: new Date(this.state.checkIn).toISOString(),
      checkoutTime: new Date(this.state.checkOut).toISOString(),
      reportContent: "toDo",
      responseContent: "toDo",
      reportStatus: "toDo",
      idUser: this.state.idRequester,
      note: this.state.note
    }

    let success = await apiService.checkingNew(data);
    if(success){
      this.props.history.push('/checking');
    }
  }
  handleCheckInChange(val) {
    this.setState({ checkIn: val });
  }

  handleCheckOutChange(val) {
    this.setState({ checkOut: val });
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

  async componentDidMount(){
    let user = await apiService.listUsers();
    this.setState({staffName : user});
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
            {/* <input className="input" value={this.state.staffName} onChange={this.handleStaffNameChange} /> */}
            <Autocomplete
              loading={this.state.staffName === null}
              style={{ flex: 1 }}
              options={this.state.staffName}
              keyProp='id'
              labelProp='name'
              onChange={(event, value) => {
                this.setState({ idRequester: value && value.id });
                console.log(this.state.idRequester);
              }}
            />
          </div>
          <div className="input-field">
            <div className="label">Ngày</div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker value={this.state.date} onChange={this.handleDateChange} />
            </MuiPickersUtilsProvider>
          </div>

          <div className="input-field">
            <div className="label">Check in</div>
            <TimePicker
              clearable
              ampm={false}
              label="24 hours"
              value={this.state.checkIn}
              onChange={this.handleCheckInChange}
            />
          </div>
          <div className="input-field">
            <div className="label">Check out</div>
            {/* <input type="time" value={this.state.checkOut} onChange={this.handleCheckOutChange} /> */}
            <TimePicker
              clearable
              ampm={false}
              label="24 hours"
              value={this.state.checkOut}
              onChange={this.handleCheckOutChange}
            />
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
