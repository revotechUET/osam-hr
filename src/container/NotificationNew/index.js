import React from "react";
import { withRouter } from "react-router-dom";
import { withSnackbar } from 'notistack';
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Autocomplete from "../../components/Autocomplete";
import apiService from "../../service/api.service";
import {init} from 'pell';

// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import './style.less';
import 'pell/dist/pell.css';

const notificationTypes = [{value: "normal", name: "Thường"},{value:"popup", name: "Popup"}];
class NotificationNewPage extends React.Component {
  constructor(props) {
    super(props);
    let notification = (this.props.history.location.state || {}).notification || {title: "", content:"", status: "draft", type:"normal"};
    this.state = {
      notification: notification
    }
  }

  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    this.setState((state) => {
      state.notification[name] = value;
      return state
    })
  }

  confirmIt(confirmMessage) {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this.setState({confirmActive:true, confirmMessage});
    });
  }
  confirmHandler(res) {
    this.setState({confirmActive:false, confirmMessage: ""});
    if (res) {
      this._resolve && this._resolve();
    }
    else {
      this._reject && this._reject();
    }
  }

  deleteNotification(id) {
    this.confirmIt("Ban chắc chắn không?").then(() => {
      let key = this.props.enqueueSnackbar("Đang xoá notification");
      apiService.deleteNotification(id).then((res) => {
        console.log(res);
        this.props.closeSnackbar(key);
        this.props.history.goBack();
      }).catch(e => {
        console.error(e);
        this.props.closeSnackbar(key);
        this.props.enqueueSnackbar(e.message, {variant: "error"});
      });
    }).catch(() => {});
  }

  saveNotification(notification) {
    let fn = apiService.updateNotification;
    if (!notification) return;
    if (!notification.id) {
      fn = apiService.addNotification;
    }
    fn(notification).then(res => {
      console.log(res);
      if (notification.id){
        this.props.enqueueSnackbar('Thành công!');
      }
      else {
        this.props.history.goBack();
      }
    }).catch(e => {
      console.error(e);
      this.props.enqueueSnackbar("Error: " + e.message, { variant: "error" });
    });
  }
  componentDidMount() {
    this.editor = init({
      element: document.querySelector('.pell'),
      onChange: html => this.setState(state => {
        state.notification.content = html;
        return state;
      }),
      actions: ['bold', 'underline', 'italic', 'olist', 'ulist'],
    });
    this.editor.content.innerHTML = this.state.notification.content;
  }
  render() {
    let aType = notificationTypes.find(noti => noti.value === this.state.notification.type);
    let { id, status } = this.state.notification;
    return (
      <div className = "NotificationNew">
        <div className="title-vs-btn">
          <div className="my-button ti ti-arrow-left" onClick={()=>{this.props.history.goBack();}}  style={{background: "transparent", boxShadow: "none", color: "#888", fontSize: "20px"}}></div>
          <div className="my-button active-btn ti ti-check" style={{background: "linear-gradient(120deg, #67dc2c, #38c53e)"}}
            onClick={() => this.saveNotification(this.state.notification)} ></div>
          {(status === 'draft')?(<div className="my-button active-btn ti ti-email" style={{background: "linear-gradient(120deg, #2c4adc, #389ec5)"}}
            onClick={() => this.sendNotification(this.state.notification)} ></div>):(<></>)}
          { (id !== undefined)?(<div className="my-button ti ti-trash" onClick={()=>{this.deleteNotification(id);}}></div>):(<></>)}
          <div className="title">Thông báo / {(this.state.notification || {}).id || "Mới"}</div>
        </div>
        <BorderedContainer>
          <div className="item-wrap">
            <span>Trạng thái</span>
            <div>{this.state.notification.status}</div>
          </div>
          <div className="item-wrap">
            <span>Kiểu thông báo</span>
            <Autocomplete options={notificationTypes}
              value={ aType }
              keyProp="value"
              labelProp="name"
              onChange={(evt, v) => console.log(v, evt)}
            />
          </div>
          <div className="item-wrap">
            <span>Tiêu đề</span>
            <div>
              <BorderBottomInput placeholder="Tiêu đề" name="title" value={this.state.notification.title} onChange={(e) => this.handleChange(e)} />
            </div>
          </div>
          <div className="item-wrap">
            <span>Người nhận</span>
          </div>
          <div className="item-wrap" style={{width: "100%"}}>
            <span>Nội dung</span>
            <div className="pell">
            </div>
          </div>
        </BorderedContainer>
        <ConfirmDialog onClose={(res) => this.confirmHandler(res)} active={this.state.confirmActive} message={this.state.confirmMessage} />
      </div>
    );
  }
}

export default withSnackbar(withRouter(NotificationNewPage));
