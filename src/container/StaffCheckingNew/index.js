import React from 'react';
import {withRouter} from 'react-router-dom';

import './style.less';

class StaffCheckingNewPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1>This is staff checking new page</h1>
        </div>)
    }
}

export default withRouter(StaffCheckingNewPage);