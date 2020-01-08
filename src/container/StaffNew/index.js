import React from 'react';
import {withRouter} from 'react-router-dom';

class StaffNewPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (<div>
            <h1>This is employee new page</h1>
        </div>)
    }
}

export default withRouter(StaffNewPage);