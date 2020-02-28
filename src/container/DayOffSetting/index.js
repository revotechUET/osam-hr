import React from 'react';
import { withRouter } from 'react-router-dom';

import { withSnackbar } from 'notistack';

import apis from '../../service/api.service';
import CenteredModal from '../../components/CenteredModal';
import "react-big-calendar/lib/css/react-big-calendar.css";

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
let allViews = Object.keys(Views).map(k => Views[k]);


class DayOffSettingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      modalActive: false,
      startTime:new Date(),
      endTime: new Date(),
      holidayName: "",
      holidayDesc: ""
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

  createHoliday(summary, description, start, end, emails) {
    return apis.createHoliday(summary, description, start, end, email);
  }
  doGet() {
    apis.getHolidayOfThisMonth().then(calEventsObj => {
      this.setState({
        events: calEventsObj.events.map((e, idx)=>({
          id: idx,
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
        id: idx,
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

  render() {
    return (
      <div className="DayOffSetting">
        <Calendar events={this.state.events}
          defaultView={Views.MONTH}
          views = {allViews}
          // step={60}
          selectable
          localizer={localizer}
          onSelectEvent={event=>console.log("selected:" , event)}
          onSelectSlot = {(slotObj) => {
            console.log("slot:", slotObj);
            this.setState({modalActive:true, startTime: slotObj.start, endTime: slotObj.end});
          }}
        />



        <CenteredModal active={this.state.modalActive} onCancel={() => { this.close() }}>
          <div className="contract-svg"></div>
          <div className="content-modal">
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Tên ngày nghỉ</div>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ flexBasis: "60%" }}>
                <input className="input" placeholder="Nhập tên ngày nghỉ" name="holidayName" value={this.state.holidayName} onChange={(e) => this.handleChange(e)} />
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
                  this.createHoliday(this.state.holidayName, this.state.holidayDesc, this.state.startTime.toISOString(), this.state.endTime.toISOString(), [])
                  .then((res) => {
                    this.props.closeSnackbar(key);
                    this.props.enqueueSnackbar("Thành công !", {variant: "success"});
                    this.closeModal();
                  })
                  .catch((err) => {
                    this.props.closeSnackbar(key);
                    this.props.enqueueSnackbar(err.message, {variant:"error"});
                    this.closeModal();
                  });
              }}>Lưu</div>
            </div>
          </div>
        </CenteredModal>

      </div>
    );
  }
}

export default withSnackbar(withRouter(DayOffSettingPage));
