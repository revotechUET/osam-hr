import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import apiService from '../../service/api.service';
import Autocomplete from "../../components/Autocomplete";
import {withSnackbar} from 'notistack';

import './style.less'
import Loading from "../../components/Loading";

class StaffCheckingNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffName: null,
      date: new Date(),
      checkIn: new Date(),
      checkOut: new Date(),
      note: '',
      idRequester: null,
      loading: false,
      errors : {}
    }

    this.handleCancle = this.handleCancle.bind(this);
    this.handleStaffNameChange = this.handleStaffNameChange.bind(this);
    this.handleCheckInChange = this.handleCheckInChange.bind(this);
    this.handleCheckOutChange = this.handleCheckOutChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  async handleSave() {
    this.setState({loading : true});
    this.state.date.setHours(0, 0, 0, 0, 0, 0);
    let data = {
      date: this.state.date.toISOString(),
      checkinTime: new Date(this.state.checkIn).toISOString(),
      checkoutTime: new Date(this.state.checkOut).toISOString(),
      reportContent: "",
      responseContent: "",
      reportStatus: "none",
      idUser: this.state.idRequester,
      note: this.state.note
    }
    try{
      let success = await apiService.checkingNew(data);
        if (success) {
        this.props.enqueueSnackbar("Lưu thành công", { variant: "success" });
        this.props.history.push('/checking');
        }
    }catch(e){
      this.props.enqueueSnackbar(e.message, { variant: "error" });
    }finally{
      this.setState({loading: false});
    }
  }

  handleValidation() {
    let formIsValid = true;
    let e = {};
    // name
    if (this.state.idRequester === null) {
      formIsValid = false;
      e["name"] = "Không thể để trống";
    }
    this.state.departments.forEach((val, index) => {
      if (val.name === this.state.departmentName) {
        formIsValid = false;
        e["name"] = "Đã tồn tại";
      }
    });
    
    this.setState({
      errors: e
    });
    return formIsValid;
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

  handleValidation(){
    
  }

  async componentDidMount() {
    let user = await apiService.listUsers();
    this.setState({ staffName: user });
  }
  render() {
    if(this.state.loading){
      return(
        <Loading />
      )
    }
    return (
      <div className="StaffCheckingNew">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={this.handleSave} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
          <div className="my-button ti ti-close" onClick={this.handleCancle} style={{ background: "#ddd", boxShadow: "none", color: "#888" }}></div>
          <div className="title">Chấm công / Mới</div>
        </div>
        <BorderedContainer>
          <div className="item-wrap">
            <span>Tên nhân viên</span>
            <div>
              <Autocomplete
                loading={this.state.staffName === null}
                style={{ flex: 1 }}
                options={this.state.staffName}
                keyProp='id'
                labelProp='name'
                onChange={(event, value) => {
                  this.setState({ idRequester: value && value.id });
                }}
              />
              <div className="error">{this.state.errors["name"]}</div>
            </div>
          </div>
          <div className="item-wrap" style={{ width: "100px" }}>
            <span>Ngày</span>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker value={this.state.date} onChange={this.handleDateChange} />
              </MuiPickersUtilsProvider>
            </div>
          </div>
          <div className="item-wrap" style={{ width: "100px" }}>
            <span>Check in</span>
            <div>
              <TimePicker
                clearable
                ampm={false}
                label="24 hours"
                value={this.state.checkIn}
                onChange={this.handleCheckInChange}
              />
            </div>
          </div>
          <div className="item-wrap" style={{ width: "100px" }}>
            <span>Check out</span>
            <div>
              <TimePicker
                clearable
                ampm={false}
                label="24 hours"
                value={this.state.checkOut}
                onChange={this.handleCheckOutChange}
              />
            </div>
          </div>
          <div className="item-wrap">
            <span>Ghi chú</span>
            <div>
              <input className="input" value={this.state.note} onChange={this.handleNoteChange} />
            </div>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withSnackbar(withRouter(StaffCheckingNewPage));
