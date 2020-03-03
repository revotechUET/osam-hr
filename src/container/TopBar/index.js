import React from 'react';
import { withRouter } from 'react-router-dom';

import './style.less';

const notifications = [{
  subject: "Notifi 1",
  content: "Di truc nhat",
  unread: true
},{
  subject: "Notifi 1",
  content: "Di truc nhat",
  unread: false
}];

class TopBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      opening: false
    }

    this.contentRef = React.createRef();
    this.bellRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      openning: false
    });
    // this.clickStream = fromEvent(document, 'click').subscribe((e)=>{
    //     if (this.bellRef.current.contains(e.target)) {
    //       return;
    //     }
    //     if (!(this.contentRef).current.contains(e.target)) {
    //         if (this.state.opening)
    //           this.setState({
    //               opening: false
    //           });
    //     }
    // });
  }

  componentWillUnmount() {
    if (this.clickStream) this.clickStream.unsubscribe();
  }

  render() {
    const { opening } = this.state;
    return (
      <React.Fragment>
        <div className="TopBar">
          <div style={{position: "relative"}}>
            <div ref={this.bellRef} className="bell-svg" onClick={() => this.setState({ opening: !opening })}>
              <div className="bage"></div>
            </div>
            <div ref={this.contentRef} className="container-drop-down-noti">
            {opening &&
              <div className="drop-down-noti">
                <div style={{flex: 1, overflow: "auto", margin: "10px"}}> 
                  {notifications.map(n => (<div className="item-noti">
                      <div className="bell-svg" style={{margin: "0 20px 0 0"}}></div>
                      <div style={{flex: 1}}>
                        <div>{n.subject}</div>
                        <span>{n.content}</span>
                      </div>
                    </div>)) }
                </div>
                {/*
                <div style={{height:"40px", display: "grid", gridGap: "10px", gridTemplateColumns: "auto auto", margin: "0 10px 10px 10px"}}>
                  <div className="btn-noti">Đánh dấu tất cả đã đọc</div>
                  <div className="btn-noti" onClick={()=>{this.setState({opening: false}); this.props.history.push("/my-notifies");}}>Xem tất cả</div>
                </div>*/}
              </div>
              }
            </div>
          </div>
          <div className="user-profile-svg"></div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(TopBar);
