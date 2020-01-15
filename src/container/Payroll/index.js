import React from 'react';
import {withRouter} from 'react-router-dom';

import './style.less';

class PayrollPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className = "Payroll">
            <h1>This is pay roll page</h1>
        </div>
        )
    }
}

export default withRouter(PayrollPage);