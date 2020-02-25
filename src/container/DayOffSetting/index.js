import React from 'react';
import {withRouter} from 'react-router-dom';
import FullSizeCalendar from './../../components/FullSizeCalendar';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment';

const localizer = momentLocalizer(moment);

let allViews = Object.keys(Views).map(k => Views[k]);

//import './style.less';

class DayOffSettingPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className="DayOffSetting">
            <Calendar
              events={[]}
              views={allViews}
              step={60}
              localizer={localizer}
            />
          </div>
        );
    }
}

export default withRouter(DayOffSettingPage);