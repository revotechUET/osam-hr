import React from 'react';
import {withRouter} from 'react-router-dom';

import './style.less';

class StaffLeaveNewPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1>This is staff leave new</h1>
        </div>)
    }
}

export default withRouter(StaffLeaveNewPage);