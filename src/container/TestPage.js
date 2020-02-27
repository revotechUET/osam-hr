import React from 'react';
import {withRouter} from 'react-router-dom';
import apis from '../service/api.service';
//import FullSizeCalendar from './../../components/FullSizeCalendar';

class TestPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
      doGet();
    }

    async doGet() {
      try {
        let events = await apis.getCalendarEvents(new Date() - 30*24*60*60*1000, new Date());
        console.log(events);
      } catch (e) {
        console.log(e);
      }
    }

    render() {
        return (
          <div className="DayOffSetting">
            {/* <Calendar
              events={events}
              defaultView={Views.MONTH}
              views = {Views}
              // step={60}
              selectable
              localizer={localizer}
              onSelectEvent={event=>console.log(event)}
              onSelectSlot = {(e)=>{console.log(e)}}
            /> */}
            {/* <iframe 
            src="https://calendar.google.com/calendar/b/4/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FHo_Chi_Minh&amp;src=cXVhbmdsbkBydnRjb21wYW55LnBhZ2U&amp;src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;src=cnZ0Y29tcGFueS5wYWdlX2ZxYmU3bzFrbzNxdTdtMWZzMW5qZmVmaTJvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&amp;src=ZW4udmlldG5hbWVzZSNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%23039BE5&amp;color=%2333B679&amp;color=%23F6BF26&amp;color=%230B8043" 
            scrolling="no" style={{border: "solid 1px #777", frameBorder: "0"}} width="800" height="600"></iframe> */}
          </div>
        );
    }
}

const now = new Date()

let events  = [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2020, 3, 0),
    end: new Date(2020, 3, 1),
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2020, 3, 7),
    end: new Date(2020, 3, 10),
  },

  {
    id: 2,
    title: 'DTS STARTS',
    start: new Date(2020, 2, 13, 0, 0, 0),
    end: new Date(2020, 2, 20, 0, 0, 0),
  },

  {
    id: 3,
    title: 'DTS ENDS',
    start: new Date(2020, 10, 6, 0, 0, 0),
    end: new Date(2020, 10, 13, 0, 0, 0),
  },

  {
    id: 4,
    title: 'Some Event',
    start: new Date(2020, 3, 9, 0, 0, 0),
    end: new Date(2020, 3, 10, 0, 0, 0),
  },
  {
    id: 5,
    title: 'Conference',
    start: new Date(2020, 3, 11),
    end: new Date(2020, 3, 13),
    desc: 'Big conference for important people',
  },
  {
    id: 6,
    title: 'Meeting',
    start: new Date(2020, 3, 12, 10, 30, 0, 0),
    end: new Date(2020, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    id: 7,
    title: 'Lunch',
    start: new Date(2020, 3, 12, 12, 0, 0, 0),
    end: new Date(2020, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch',
  },
  {
    id: 8,
    title: 'Meeting',
    start: new Date(2020, 3, 12, 14, 0, 0, 0),
    end: new Date(2020, 3, 12, 15, 0, 0, 0),
  },
  {
    id: 9,
    title: 'Happy Hour',
    start: new Date(2020, 3, 12, 17, 0, 0, 0),
    end: new Date(2020, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day',
  },
  {
    id: 10,
    title: 'Dinner',
    start: new Date(2020, 3, 12, 20, 0, 0, 0),
    end: new Date(2020, 3, 12, 21, 0, 0, 0),
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2020, 3, 13, 7, 0, 0),
    end: new Date(2020, 3, 13, 10, 30, 0),
  },
  {
    id: 12,
    title: 'Late Night Event',
    start: new Date(2020, 3, 17, 19, 30, 0),
    end: new Date(2020, 3, 18, 2, 0, 0),
  },
  {
    id: 12.5,
    title: 'Late Same Night Event',
    start: new Date(2020, 3, 17, 19, 30, 0),
    end: new Date(2020, 3, 17, 23, 30, 0),
  },
  {
    id: 13,
    title: 'Multi-day Event',
    start: new Date(2020, 3, 20, 19, 30, 0),
    end: new Date(2020, 3, 22, 2, 0, 0),
  },
  {
    id: 14,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 15,
    title: 'Point in Time Event',
    start: now,
    end: now,
  },
  {
    id: 16,
    title: 'Video Record',
    start: new Date(2020, 3, 14, 15, 30, 0),
    end: new Date(2020, 3, 14, 19, 0, 0),
  },
  {
    id: 17,
    title: 'Dutch Song Producing',
    start: new Date(2020, 3, 14, 16, 30, 0),
    end: new Date(2020, 3, 14, 20, 0, 0),
  },
  {
    id: 18,
    title: 'Itaewon Halloween Meeting',
    start: new Date(2020, 3, 14, 16, 30, 0),
    end: new Date(2020, 3, 14, 17, 30, 0),
  },
  {
    id: 19,
    title: 'Online Coding Test',
    start: new Date(2020, 3, 14, 17, 30, 0),
    end: new Date(2020, 3, 14, 20, 30, 0),
  },
  {
    id: 20,
    title: 'An overlapped Event',
    start: new Date(2020, 3, 14, 17, 0, 0),
    end: new Date(2020, 3, 14, 18, 30, 0),
  },
  {
    id: 21,
    title: 'Phone Interview',
    start: new Date(2020, 3, 14, 17, 0, 0),
    end: new Date(2020, 3, 14, 18, 30, 0),
  },
  {
    id: 22,
    title: 'Cooking Class',
    start: new Date(2020, 3, 14, 17, 30, 0),
    end: new Date(2020, 3, 14, 19, 0, 0),
  },
  {
    id: 23,
    title: 'Go to the gym',
    start: new Date(2020, 3, 14, 18, 30, 0),
    end: new Date(2020, 3, 14, 20, 0, 0),
  },
]

export default withRouter(TestPage);