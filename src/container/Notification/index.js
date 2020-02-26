import React from 'react';
import { withRouter } from 'react-router-dom';
import './style.less';


class NotifyPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className = "NotiPage">
            <div className="title-vs-btn">
                <div className="my-button active-btn ti ti-plus" onClick={()=>this.props.history.push("/notifies/new")}></div>
                <div className="title">Thông báo</div>
            </div>
            <div>

            </div>
        </div>)
    }
}

export default withRouter(NotifyPage);
