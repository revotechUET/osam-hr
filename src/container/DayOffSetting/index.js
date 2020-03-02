import React from 'react';
import { withRouter } from 'react-router-dom';

import { withSnackbar } from 'notistack';

import apis from '../../service/api.service';
import CenteredModal from '../../components/CenteredModal';
import "react-big-calendar/lib/css/react-big-calendar.css";
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import "./style.less";
let CalendarBigTable = require('react-big-calendar');

import { format, getDay, parse, startOfWeek } from 'date-fns';
const locales = {
  'en-US': require('date-fns/locale/en-US'),
  'vi': require('date-fns/locale/vi'),
}
import dateFnsLocalizer from 'react-big-calendar/lib/localizers/date-fns';
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
let Calendar = CalendarBigTable.Calendar;
let Views = CalendarBigTable.Views;
//let allViews = Object.keys(Views).map(k => Views[k]);
let allViews = ["month"];

let mock = {
  events: [{
    id: "Hello1",
    summary: "Hello1",
    start: new Date().toISOString(),
    end: new Date().toISOString()
  }]
}

function normalizeEndTime(end) {
  let newEnd = new Date(end);
  newEnd.setHours(23);
  newEnd.setMinutes(59);
  newEnd.setSeconds(59);
  return newEnd;
}
class DayOffSettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.viewDate = false;
    this.state = {
      events: [],
      modalActive: false,
      detailedActive: false,
      startTime:new Date(),
      endTime: new Date(),
      holidayName: "",
      holidayDesc: "",
      inThePast: false,
      confirmActive: false,
      confirmMessage: ""
    }
  }

  componentDidMount() {
    this.doGet();
  }

  closeModal() {
    this.setState({
      modalActive: false
    });
  }
  deleteHoliday(eventId) {
    return apis.deleteHoliday(eventId);
  }
  updateHoliday(eventId, summary, description, startTimeStr, endTimeStr, []) {
    if (summary && summary.length)
      return apis.updateHoliday(eventId, summary, description, startTimeStr, endTimeStr, []);

    return new Promise((resolve, reject) => {
      reject(new Error("Không có lý do nghỉ"));
    });
  }
  createHoliday(summary, description, start, end, emails) {
    if (summary && summary.length)
      return apis.createHoliday(summary, description, start, end, emails);
    return new Promise((resolve, reject) => {
      reject(new Error("Không có lý do nghỉ"));
    });
  }
  doGet(aDate) {
    apis.getHolidayOfMonth(aDate).then(calEventsObj => {
      console.log(calEventsObj);
      this.setState({
        events: calEventsObj.events.map((e, idx)=>({
          id: e.id,
          start: e.start,
          end: e.end,
          title: e.summary,
          description: "bla blo"
        }))
      })
    }).catch(e => {
      console.error(e);
    });
    /*
    this.setState({
      events: mock.events.map((e, idx)=>({
        id: e.id,
        start: e.start,
        end: e.end,
        title: e.summary,
        description: "bla blo"
      }))
    })
     */
  }

  handleChange(evt) {
    let name = evt.target.name;
    this.setState({
      [name]: evt.target.value
    });
  }

  selectSlotHandler(slotObj) {
    console.log("slot:", slotObj);
    this.setState({
      modalActive:true, 
      detailedActive:false, 
      startTime: new Date(slotObj.start), 
      holidayName: "", 
      holidayDesc: "", 
      endTime: new Date(slotObj.end)
    });
  }
  selectEventHandler(event) {
    console.log("selected:" , event);
    this.setState({
      detailedActive:true, 
      modalActive:false, 
      holidayName: event.title, 
      holidayDesc: event.description, 
      startTime: new Date(event.start), 
      endTime: new Date(event.end),
      eventId: event.id
    })
  }
  confirmIt(confirmMessage) {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this.setState({confirmActive:true, confirmMessage});
    });
  }
  confirmHandler(res) {
    this.setState({confirmActive:false, confirmMessage: ""});
    if (res) {
      this._resolve && this._resolve();
    }
    else {
      this._reject && this._reject();
    }
  }
  render() {
    return (
      <div className="DayOffSetting">
        <Calendar events={this.state.events}
          defaultView={Views.MONTH}
          views = {allViews}
          selectable
          localizer={localizer}
          onNavigate={ (date, view, action) => {  
            console.log(date, view, action);
            this.viewDate = date;
            this.doGet(this.viewDate);
          }}
          onSelectEvent={event => this.selectEventHandler(event)}
          onSelectSlot = {(slot) => this.selectSlotHandler(slot)}
        />

        <CenteredModal active={this.state.detailedActive} onCancel={() => { this.setState({detailedActive:false}) }}>
          <div className="contract-svg"></div>
          <div className="content-modal">
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Lý do nghỉ</div>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "60%" }}>
                <input className="input" placeholder="Lý do nghỉ" name="holidayName" value={this.state.holidayName} onChange={(e) => this.handleChange(e)} />
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Mô tả</div>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "60%" }}>
                <input className="input" placeholder="Mô tả" name="holidayDesc" value={this.state.holidayDesc} onChange={(e) => this.handleChange(e)} />
              </div>
            </div>
            <div>
              <h4>{this.state.startTime.toLocaleString()}</h4>
              <h4>{this.state.endTime.toLocaleString()}</h4>
            </div>
            <div className="footer">
              <button className="my-button-cancel" onClick={() => { this.setState({ detailedActive:false }) }}>Hủy</button>
              <div className={"my-button-ok" + (this.state.inThePast?" button-disabled":"")} style={{marginRight:"20px"}} onClick={(evt) => {
                  this.confirmIt("Ban chắc chắn không?").then(() => {
                    let key = this.props.enqueueSnackbar("Đang xoá ngày nghỉ");
                    this.deleteHoliday(this.state.eventId).then((res) => {
                      this.props.closeSnackbar(key);
                      this.props.enqueueSnackbar("Thành công !", {variant: "success"});
                      this.setState({detailedActive:false});
                      this.doGet(this.viewDate);
                    }).catch((err) => {
                      this.props.closeSnackbar(key);
                      console.error(err);
                      this.props.enqueueSnackbar(err.message, {variant:"error"});
                    });
                  }).catch(() => {});
              }}>Xoá</div>
              <div className={"my-button-ok" + (this.state.inThePast?" button-disabled":"")} onClick={(evt) => {
                  let key = this.props.enqueueSnackbar("Đang cập nhật ngày nghỉ");
                  this.updateHoliday(
                    this.state.eventId,
                    this.state.holidayName, 
                    this.state.holidayDesc, 
                    this.state.startTime.toISOString(), 
                    normalizeEndTime(this.state.endTime).toISOString(),
                    []
                  ).then((res) => {
                    this.props.closeSnackbar(key);
                    this.props.enqueueSnackbar("Thành công !", {variant: "success"});
                    this.setState({detailedActive:false});
                    this.doGet(this.viewDate);
                  }).catch((err) => {
                    this.props.closeSnackbar(key);
                    this.props.enqueueSnackbar(err.message, {variant:"error"});
                  });
              }}>Lưu</div>
            </div>
          </div>
        </CenteredModal>


        <CenteredModal active={this.state.modalActive} onCancel={() => { this.close() }}>
          <div className="contract-svg"></div>
          <div className="content-modal">
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Lý do nghỉ</div>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "60%" }}>
                <input className="input" placeholder="Lý do nghỉ" name="holidayName" value={this.state.holidayName} onChange={(e) => this.handleChange(e)} />
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Mô tả</div>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "60%" }}>
                <input className="input" placeholder="Mô tả" name="holidayDesc" value={this.state.holidayDesc} onChange={(e) => this.handleChange(e)} />
              </div>
            </div>
            <div>
              <h4>{this.state.startTime.toLocaleString()}</h4>
              <h4>{this.state.endTime.toLocaleString()}</h4>
            </div>
            <div className="footer">
              <div className="my-button-cancel" onClick={() => { this.closeModal() }}>Hủy</div>
              <div className="my-button-ok" onClick={(evt) => {
                  let key = this.props.enqueueSnackbar("Đang tạo ngày nghỉ");
                  this.createHoliday(
                    this.state.holidayName, 
                    this.state.holidayDesc, 
                    this.state.startTime.toISOString(), 
                    normalizeEndTime(this.state.endTime).toISOString(), 
                    []
                  ).then((res) => {
                    this.props.closeSnackbar(key);
                    this.props.enqueueSnackbar("Thành công !", {variant: "success"});
                    this.closeModal();
                    this.doGet(this.viewDate);
                  }).catch((err) => {
                    this.props.closeSnackbar(key);
                    this.props.enqueueSnackbar(err.message, {variant:"error"});
                  });
              }}>Lưu</div>
            </div>
          </div>
        </CenteredModal>
        <ConfirmDialog onClose={(res) => this.confirmHandler(res)} active={this.state.confirmActive} message={this.state.confirmMessage}/>
      </div>
    );
  }
}

export default withSnackbar(withRouter(DayOffSettingPage));
