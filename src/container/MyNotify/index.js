import React from 'react';
import {withRouter} from 'react-router-dom';
import userImg from './../../assets/images/17004.svg';

import './style.less';

class MyNotifyPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className = "MyNotiPage">
            <h1 style={{marginBottom: "10px"}}>Thông báo của bạn</h1>
            <button>Đánh dấu tất cả đã đọc</button>
            <div style={{marginTop: "30px", border: "1px solid"}}>
                {/* content for notify */}
                <div style={{display: "flex", padding: "10px", borderBottom: "1px solid black"}}>
                  <div style={{flexBasis: "30px", marginRight: "15px"}}>
                    <img src={userImg} style={{width: "100%"}}/>
                  </div>
                  <div>
                    Thông báo lịch trực nhật
                    <br />
                    <p style={{fontStyle: "italic", margin: "0px"}}>25/10/2019</p>
                  </div> 
                </div>
                <div style={{display: "flex", padding: "10px", borderBottom: "1px solid black"}}>
                  <div style={{flexBasis: "30px", marginRight: "15px"}}>
                    <img src={userImg} style={{width: "100%"}}/>
                  </div>
                  <div>
                    Thông báo lịch trực nhật
                    <br />
                    <p style={{fontStyle: "italic", margin: "0px"}}>25/10/2019</p>
                  </div> 
                </div>
            </div>
        </div>)
    }
}

export default withRouter(MyNotifyPage);