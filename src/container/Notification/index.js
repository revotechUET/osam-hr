import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class NotifyPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className = "NotiPage">
            <h1 style={{marginBottom: "10px"}}>Thông báo</h1>
            <button onClick={()=>this.props.history.push("/notifies/new")}>Tạo mới</button>
            <div>
               <StyledPaginationTable />
            </div>
        </div>)
    }
}

export default withRouter(NotifyPage);