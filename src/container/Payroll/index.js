import React from 'react';
import {withRouter} from 'react-router-dom';

import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class PayrollPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className = "Payroll">
            <h1 style={{marginBottom: "10px"}}>Tính công</h1>
            <button>Xuất file</button>
            
            <StyledPaginationTable />
        </div>
        )
    }
}

export default withRouter(PayrollPage);