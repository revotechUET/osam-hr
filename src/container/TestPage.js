import React from 'react';
import {withRouter} from 'react-router-dom';

import { withSnackbar } from 'notistack';

import apis from '../service/api.service';
import "react-big-calendar/lib/css/react-big-calendar.css";
//import FullSizeCalendar from './../../components/FullSizeCalendar';
let CalendarBigTable = require('react-big-calendar');
let momentLocalizer = CalendarBigTable.momentLocalizer;
import CenteredModal from './../components/CenteredModal';
let Calendar = CalendarBigTable.Calendar;
let Views = CalendarBigTable.Views;
// import moment from 'moment';;
// const localizer = momentLocalizer(moment);
let allViews = Object.keys(Views).map(k => Views[k]);


let mock = {
  "from": "2020-02-01T03:34:13.881Z",
  "to": "2020-03-01T03:34:13.881Z",
  "events": [
    {
      "summary": "SU kien 1",
      "start": "2020-02-04T00:00:00.000Z",
      "end": "2020-02-05T00:00:00.000Z"
    },
    {
      "summary": "hello",
      "start": "2020-02-12T00:00:00.000Z",
      "end": "2020-02-13T00:00:00.000Z"
    },
    {
      "summary": "well",
      "start": "2020-02-10T00:00:00.000Z",
      "end": "2020-02-11T00:00:00.000Z"
    },
    {
      "summary": "troi oi",
      "start": "2020-02-16T00:00:00.000Z",
      "end": "2020-02-19T00:00:00.000Z"
    },
    {
      "summary": "troi oi",
      "start": "2020-02-20T00:00:00.000Z",
      "end": "2020-02-23T00:00:00.000Z"
    },
    {
      "summary": "All day",
      "start": "2020-02-14T00:00:00.000Z",
      "end": "2020-02-15T00:00:00.000Z"
    }
  ],
  "rawEvents": [
    {
      "updated": "2020-02-26T04:51:51.604Z",
      "htmlLink": "https://www.google.com/calendar/event?eid=Nm9kNjZ2ZDlsNnJyY2JhcmplZ2FsNzk0c20gcnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGc",
      "sequence": 0,
      "summary": "SU kien 1",
      "organizer": {
        "self": true,
        "email": "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com",
        "displayName": "test-calendar"
      },
      "id": "6od66vd9l6rrcbarjegal794sm",
      "created": "2020-02-26T04:51:51.000Z",
      "etag": "\"3165385423208000\"",
      "status": "confirmed",
      "creator": {
        "email": "quangln@rvtcompany.page"
      },
      "iCalUID": "6od66vd9l6rrcbarjegal794sm@google.com",
      "end": {
        "date": "2020-02-05"
      },
      "transparency": "transparent",
      "kind": "calendar#event",
      "reminders": {
        "useDefault": false
      },
      "start": {
        "date": "2020-02-04"
      }
    },
    {
      "end": {
        "date": "2020-02-13"
      },
      "transparency": "transparent",
      "kind": "calendar#event",
      "reminders": {
        "useDefault": false
      },
      "start": {
        "date": "2020-02-12"
      },
      "updated": "2020-02-27T03:46:35.477Z",
      "htmlLink": "https://www.google.com/calendar/event?eid=MXRwdTAwdWZjZjdiZ243M2h2cTMzaGNnZmcgcnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGc",
      "sequence": 0,
      "summary": "hello",
      "organizer": {
        "self": true,
        "email": "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com",
        "displayName": "test-calendar"
      },
      "id": "1tpu00ufcf7bgn73hvq33hcgfg",
      "created": "2020-02-27T03:46:35.000Z",
      "etag": "\"3165550390954000\"",
      "status": "confirmed",
      "creator": {
        "email": "quangln@rvtcompany.page"
      },
      "iCalUID": "1tpu00ufcf7bgn73hvq33hcgfg@google.com"
    },
    {
      "id": "59c4a63gilvr4qfc52ogve8t7t",
      "created": "2020-02-27T04:08:22.000Z",
      "etag": "\"3165553005084000\"",
      "status": "confirmed",
      "creator": {
        "email": "quangln@rvtcompany.page"
      },
      "iCalUID": "59c4a63gilvr4qfc52ogve8t7t@google.com",
      "end": {
        "date": "2020-02-11"
      },
      "transparency": "transparent",
      "kind": "calendar#event",
      "reminders": {
        "useDefault": false
      },
      "start": {
        "date": "2020-02-10"
      },
      "updated": "2020-02-27T04:08:22.542Z",
      "htmlLink": "https://www.google.com/calendar/event?eid=NTljNGE2M2dpbHZyNHFmYzUyb2d2ZTh0N3QgcnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGc",
      "sequence": 0,
      "summary": "well",
      "organizer": {
        "self": true,
        "email": "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com",
        "displayName": "test-calendar"
      }
    },
    {
      "iCalUID": "7fd9ld8iikh84f2l27e7d59iv9@google.com",
      "end": {
        "date": "2020-02-19"
      },
      "transparency": "transparent",
      "kind": "calendar#event",
      "reminders": {
        "useDefault": false
      },
      "start": {
        "date": "2020-02-16"
      },
      "updated": "2020-02-27T14:12:57.478Z",
      "htmlLink": "https://www.google.com/calendar/event?eid=N2ZkOWxkOGlpa2g4NGYybDI3ZTdkNTlpdjkgcnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGc",
      "sequence": 0,
      "summary": "troi oi",
      "organizer": {
        "email": "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com",
        "displayName": "test-calendar",
        "self": true
      },
      "id": "7fd9ld8iikh84f2l27e7d59iv9",
      "created": "2020-02-27T14:12:57.000Z",
      "etag": "\"3165625554956000\"",
      "status": "confirmed",
      "creator": {
        "email": "quangln@rvtcompany.page"
      }
    },
    {
      "iCalUID": "4dlstka2b39iaa6qarl4oh4lgl@google.com",
      "end": {
        "date": "2020-02-23"
      },
      "transparency": "transparent",
      "kind": "calendar#event",
      "reminders": {
        "useDefault": false
      },
      "start": {
        "date": "2020-02-20"
      },
      "updated": "2020-02-27T14:13:10.866Z",
      "htmlLink": "https://www.google.com/calendar/event?eid=NGRsc3RrYTJiMzlpYWE2cWFybDRvaDRsZ2wgcnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGc",
      "sequence": 0,
      "summary": "troi oi",
      "organizer": {
        "displayName": "test-calendar",
        "self": true,
        "email": "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com"
      },
      "id": "4dlstka2b39iaa6qarl4oh4lgl",
      "created": "2020-02-27T14:13:10.000Z",
      "etag": "\"3165625581732000\"",
      "status": "confirmed",
      "creator": {
        "email": "quangln@rvtcompany.page"
      }
    },
    {
      "organizer": {
        "displayName": "test-calendar",
        "self": true,
        "email": "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com"
      },
      "id": "15dha4pkch5ht2791deh8q8rk4",
      "created": "2020-02-27T14:22:53.000Z",
      "etag": "\"3165626746418000\"",
      "status": "confirmed",
      "creator": {
        "email": "quangln@rvtcompany.page"
      },
      "iCalUID": "15dha4pkch5ht2791deh8q8rk4@google.com",
      "end": {
        "date": "2020-02-15"
      },
      "transparency": "transparent",
      "kind": "calendar#event",
      "reminders": {
        "useDefault": false
      },
      "start": {
        "date": "2020-02-14"
      },
      "updated": "2020-02-27T14:22:53.209Z",
      "htmlLink": "https://www.google.com/calendar/event?eid=MTVkaGE0cGtjaDVodDI3OTFkZWg4cThyazQgcnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGc",
      "sequence": 0,
      "summary": "All day"
    }
  ]
}

class TestPage extends React.Component {
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

    clearModal() {
        this.setState({
            modalActive: false
        });
    }

    createEvent(summary, description, start, end, emails) {
        return new Promise((resolve, reject) => {
            setTimeout(() =>{
                reject({message: "Nooix roi"});
            }, 1000);
        });
        //return apis.gscriptrun("createEvent", {summary, description, start, end, emails});
    }
    async doGet() {
      try {
        // let date = new Date();
        // let events = await apis.getCalendarEvents(date - 60*24*60*60*1000, new Date().toString());
        // console.log(events);
        this.setState({
          events: mock.events.map((e, idx)=>({
            id: idx,
            start: e.start,
            end: e.end,
            title: e.summary,
            description: "bla blo"
          }))
        })
      } catch (e) {
        console.log(e);
      }
    }

    handleChange(evt) {
        let name = evt.target.name;
        this.setState({
            [name]: evt.target.value
        });
        /*
        switch(evt.target.name) {
        case "holidayName":
            this.setState({
                holidayName: evt.target.value
            })
            break;
        case "holidayDesc":
            break;
            this.setState({
                holidayName: evt.target.value
            })
        }
        */
    }

    render() {
        return (
          <div className="DayOffSetting">
            <Calendar
              events={this.state.events}
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



      <CenteredModal active={this.state.modalActive} onCancel={() => { this.clearModal() }}>
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
            <div className="my-button-cancel" onClick={() => { this.clearModal() }}>Hủy</div>
            <div className="my-button-ok" onClick={(evt) => {
                let key = this.props.enqueueSnackbar("Đang tạo ngày nghỉ");
                this.createEvent(this.state.holidayName, this.state.holidayDesc, this.state.startTime.toISOString(), this.state.endTime.toISOString(), [])
                    .then((res) => {
                        this.props.closeSnackbar(key);
                        this.props.enqueueSnackbar("Thành công !", {variant: "success"});
                    })
                    .catch((err) => {
                        this.props.closeSnackbar(key);
                        this.props.enqueueSnackbar(err.message, {variant:"error"});
                    });
            }}>Lưu</div>
          </div>
        </div>
      </CenteredModal>


          </div>
        );
    }
}

export default withSnackbar(withRouter(TestPage));
