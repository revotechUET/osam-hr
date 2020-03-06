import React from "react";
import { withRouter } from "react-router-dom";
import { withSnackbar } from 'notistack';
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from '../../components/BorderBottomInput';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import apiService from '../../service/api.service';
import Autocomplete from '../../components/Autocomplete';
import Loading from '../../components/Loading';
import './style.less'

class StaffCheckingEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffName: null,
      date: new Date(),
      checkIn: new Date(),
      checkOut: new Date(),
      note: '',
      idRequester: null,
      loading: false
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
      let id = this.props.match.params.id;
      this.state.date.setHours(0, 0, 0, 0, 0, 0);
      let date= this.state.date.toISOString();
      let checkinTime= new Date(this.state.checking.checkinTime).toISOString();
      let checkoutTime= new Date(this.state.checking.checkoutTime).toISOString();
      let idUser= this.state.idRequester;
      let note= this.state.note;
      let success = await apiService.checkingEdit({id, date,checkinTime, checkoutTime, note});
      if (success) {
        this.props.history.push('/checking');
      }
    else{
        console.log("Ôi hỏng ! <:()>");
    }
  }
  handleCheckInChange(val) {
    this.setState(state => {
      if (state.checking) {
        state.checking.checkinTime = new Date(val).toISOString();
        return state;
      }
      return {}
    });
  }

  handleCheckOutChange(val) {
    this.setState(state => {
      if (state.checking) {
        state.checking.checkoutTime = new Date(val).toISOString();
        return state;
      }
      return {}
    });
  }

  handleCancle() {
    this.props.history.push('/checking');
  }

  handleStaffNameChange(evt) {
    this.setState({ staffName: evt.target.value });
  }

  handleDateChange(val) {
    this.setState(state => {
      if (state.checking) {
        state.checking.date = new Date(val).toISOString();
        return state;
      }
      return {}
    })
    // this.setState({ date: val });
  }

  handleNoteChange(evt) {
    let val = evt.target.value;
    this.setState(state => {
      if (state.checking) {
        state.checking.note = val;
        return state;
      }
      return {}
    })
  }

  async componentDidMount() {
    let id = this.props.match.params.id;
    this.setState({ loading: true });
    apiService.checkingDetailById(id).then(checkingWithUser => {
      this.setState({ checking: checkingWithUser });
    }).catch(e => {
      console.error(e);
      this.props.enqueueSnackbar(e.message, {variant: 'error'});
    }).finally((() => {
      this.setState({ loading: false });
    }))  ;
    // let user = await apiService.listUsers();
  }
  render() {
    if (this.state.loading) return <Loading />
    return (
      <div className="CheckingEdit">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={this.handleSave} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
          <div className="my-button ti ti-close" onClick={this.handleCancle} style={{ background: "#ddd", boxShadow: "none", color: "#888" }}></div>
          <div className="title">Chấm công / {(this.state.checking || {}).id || "khong biet"}</div>
        </div>
        <BorderedContainer>
          <div className="item-wrap">
            <span>Tên nhân viên</span>
            <div>
              <BorderBottomInput readOnly value={((this.state.checking || {}).user || {}).name} disabled />
            </div>
          </div>
          <div className="item-wrap" style={{ width: "100px" }}>
            <span>Ngày</span>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker value={(this.state.checking || {}).date || new Date()} onChange={this.handleDateChange} />
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
                value={(this.state.checking || {}).checkinTime || new Date() }
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
                value={(this.state.checking || {}).checkoutTime || new Date()}
                onChange={this.handleCheckOutChange}
              />
            </div>
          </div>
          <div className="item-wrap">
            <span>Ghi chú</span>
            <div>
              <input className="input" value={(this.state.checking || {}).note || ""} onChange={this.handleNoteChange} />
            </div>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withSnackbar(withRouter(StaffCheckingEditPage));
