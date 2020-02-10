import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class StaffLeavePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div >
            <h1 style={{marginBottom: "10px"}}>Yêu cầu nghỉ</h1>
            <button className="my-button active-btn" onClick={()=>this.props.history.push("/leaves/new")}>Tạo mới</button>
            <div>
               {/* <StyledPaginationTable /> */}
            </div>
        </div>)
    }
}

export default withRouter(StaffLeavePage);