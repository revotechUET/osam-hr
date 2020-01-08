import React from 'react';
import {withRouter} from 'react-router-dom';

class SettingPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1>This is Setting</h1>
        </div>)
    }
}

export default withRouter(SettingPage);