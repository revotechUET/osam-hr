import React from 'react';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import apiService from '../../service/api.service';
import NotificationDialog from '../../dialogs/NotificationDialog';

import './style.less';

const notifications = [{
  subject: "Notifi 1",
  date: "Di truc nhat",
  unread: true
},{
  subject: "Notifi 1",
  date: "Di truc nhat",
  unread: false
}];

class TopBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      opening: false,
      notifications: [], //notifications,
      notificationDialogActive: false,
      notificationContent: ""
    }
  }
  doGet() {
    apiService.getMyNotifications().then(myNotifications => {
      this.setState({ notifications: myNotifications||[] });
    }).catch(e => {
      console.error(e);
      this.props.enqueueSnackbar(e.message, {variant: 'error'});
    });
  }
  componentDidMount() {
    apiService.me().then(me => this.setState({me})).catch(e => console.error(e));
    apiService.checkMail().then(() => {}).catch(e => console.error(e.message));
    this.timer = setInterval(() => {
      apiService.checkMail().then(() => {}).catch(e => console.error(e.message));
    }, 1000 * 60 * 5);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleMessageClicked(e, idx) {
    let noti = this.state.notifications[idx];
    apiService.getMyNotificationBody(noti.messageId).then(body => {
      console.log(body);
      this.setState({notificationDialogActive: true, notificationContent: body});
    }).catch(e => {
      console.error(e);
      let body = "<div>Troi oi, content day roi</div>";
      this.setState({notificationDialogActive: true, notificationContent: body});
      this.props.enqueueSnackbar(e.message, {variant: 'error'});
    });
  }
  render() {
    let { opening, notifications } = this.state;
    return (
      <React.Fragment>
        <div className="TopBar">
          <div style={{ position: "relative" }}>
            <div
              className="bell-svg"
              onClick={() => {
                this.setState({ opening: !this.state.opening });
                this.doGet();
              }}
            >
              <div className="bage"></div>
            </div>
            <div className="container-drop-down-noti">
              {opening && (
                <div className="drop-down-noti">
                  <div style={{ flex: 1, overflow: "auto", margin: "10px" }}>
                    {notifications.map((n, idx) => (
                      <div
                        key={idx}
                        className="item-noti"
                        onClick={e => {
                          this.handleMessageClicked(e, idx);
                        }}
                      >
                        <div
                          className="bell-svg"
                          style={{ margin: "0 20px 0 0" }}
                        ></div>
                        <div style={{ flex: 1 }}>
                          <div>{n.subject}</div>
                          <span>{n.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/*
                <div style={{height:"40px", display: "grid", gridGap: "10px", gridTemplateColumns: "auto auto", margin: "0 10px 10px 10px"}}>
                  <div className="btn-noti">Đánh dấu tất cả đã đọc</div>
                  <div className="btn-noti" onClick={()=>{this.setState({opening: false}); this.props.history.push("/my-notifies");}}>Xem tất cả</div>
                </div>*/}
                </div>
              )}
            </div>
          </div>
          <div className="user-button">
              <span style={{}}>{(this.state.me || {}).name || "Admin"}</span>
              <div className="user-profile-svg"></div>
          </div>
        </div>
        <NotificationDialog
          active={this.state.notificationDialogActive}
          content={this.state.notificationContent}
          onClose={() => {
            this.setState({ notificationDialogActive: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export default withSnackbar(withRouter(TopBar));
