import React from 'react';
import {withRouter} from 'react-router-dom';
import FullSizeCalendar from './../../components/FullSizeCalendar';

import './style.less';

class DayOffSettingPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <FullSizeCalendar />
        </div>)
    }
}

export default withRouter(DayOffSettingPage);