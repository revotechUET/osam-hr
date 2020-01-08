import React from 'react';
import {withRouter} from 'react-router-dom';

class StaffEditPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (<div>
            <h1>This is staff edit page</h1>
        </div>)
    }
}

export default withRouter(StaffEditPage);