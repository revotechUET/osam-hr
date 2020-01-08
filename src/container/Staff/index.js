import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class StaffPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: ""
        }
    }



    render() {
        return (<div>
            <h1 style={{marginBottom: "10px"}}>Nhân viên</h1>
            <button onClick = {()=>{this.props.history.push("/staffs/new")}}>Tạo mới</button>
            <div>
               <StyledPaginationTable />
            </div>
        </div>)
    }
}


export default withRouter(StaffPage);

