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
        let date = new Date();
        let events = await apis.getCalendarEvents(date - 60*24*60*60*1000, new Date().toString());
        console.log(events);
        this.setState({
          events: events.map((e, idx)=>({
            id: idx,
            start: e.startDate,
            end: e.endDate,
            description: e.description,
            title: e.title
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