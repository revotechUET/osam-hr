import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class StaffChecking extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div >
            <h1 style={{marginBottom: "10px"}}>Chấm công</h1>
            <button className="my-button active-btn" onClick={()=>this.props.history.push("/checking/new")}>Tạo mới</button>
            <div>
               {/* <StyledPaginationTable /> */}
            </div>
        </div>)
    }
}

export default withRouter(StaffChecking);