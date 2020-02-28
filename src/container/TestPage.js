import React from 'react';
import {withRouter} from 'react-router-dom';
import apis from '../service/api.service';
//import FullSizeCalendar from './../../components/FullSizeCalendar';
let CalendarBigTable = require('react-big-calendar');
let momentLocalizer = CalendarBigTable.momentLocalizer;
let Calendar = CalendarBigTable.Calendar;
let Views = CalendarBigTable.Views;
import moment from 'moment';;
const localizer = momentLocalizer(moment);
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
          events: []
        }
    }

    componentDidMount() {
      this.doGet();
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
            title: summary,
            description: "bla blo"
          }))
        })
      } catch (e) {
        console.log(e);
      }
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
              onSelectEvent={event=>console.log(event)}
              onSelectSlot = {(e)=>{console.log(e)}}
            />
            {/* <iframe 
            src="https://calendar.google.com/calendar/b/4/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FHo_Chi_Minh&amp;src=cXVhbmdsbkBydnRjb21wYW55LnBhZ2U&amp;src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;src=cnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&amp;src=ZW4udmlldG5hbWVzZSNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%23039BE5&amp;color=%2333B679&amp;color=%23F6BF26&amp;color=%230B8043" 
            scrolling="no" style={{border: "solid 1px #777", frameBorder: "0"}} width="800" height="600"></iframe> */}
          </div>
        );
    }
}

export default withRouter(TestPage);