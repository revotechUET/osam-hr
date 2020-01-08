import React from 'react';
import {withRouter} from 'react-router-dom';

import './style.less';

class NotificationNewPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1>This is noti new page</h1>
        </div>)
    }
}

export default withRouter(NotificationNewPage);