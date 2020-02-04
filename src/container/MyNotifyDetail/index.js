import React from 'react';
import {withRouter} from 'react-router-dom';
//import userImg from './../../assets/images/17004.svg';

import './style.less';

class MyNotifyDetailPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.id = this.props.match.params.id;
        console.log(this.id);
    }

    render() {
        return (
        <div className = "MyNotiDetailPage">
            <h1 style={{marginBottom: "10px"}}>Thông báo của bạn / Thông báo lịch trực nhật mới</h1>
            
        </div>
        )
    }
}

export default withRouter(MyNotifyDetailPage);