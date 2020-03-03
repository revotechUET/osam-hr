import React from "react";
import { withRouter } from "react-router-dom";
import { withSnackbar } from 'notistack';
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import Loading from "../../components/Loading";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import CenteredModal from "../../components/CenteredModal";
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Autocomplete from "../../components/Autocomplete";
import apiService from "../../service/api.service";
import { init } from 'pell';

// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import './style.less';
import 'pell/dist/pell.css';
import { DateTimePicker } from "@material-ui/pickers";
import Error from "../../components/Error";
import { Select, MenuItem } from "@material-ui/core";

const notificationTypes = [{ value: "normal", name: "Thường" }, { value: "popup", name: "Popup" }];
class NotificationNewPage extends React.Component {
  constructor(props) {
    super(props);
    let notification = (this.props.history.location.state || {}).notification || { 
      title: "default title", 
      content: "Some content", 
      status: "draft", 
      type: "normal",
      receipient: {
        type: 'all',
        selected: []
      }
    };
    if (typeof notification.receipient === 'string') {
      notification.receipient = JSON.parse(notification.receipient);
    }
    this.state = {
      loading: true,
      sendTime: new Date(),
      sendNow: true,
      sendModalActive: false,
      notification: notification,
      errors: { sendTime: "" },
      receipientLists: {all: [], staff: [{"role":"admin","idContract":"k71qrl3f","name":"Le Van Thinh","active":true,"id":"111162821854229823178","email":"user8@rvtcompany.page"},{"role":"user","idContract":"k71qrl3f","name":"Boooo","active":true,"id":"108826265259234244326","email":"user2@rvtcompany.page"},{"role":"manager","idContract":"k71qrl3f","name":"NAM PRO hehe","active":true,"id":"110714449735001419856","email":"user1@rvtcompany.page"},{"role":"user","idContract":"k71qrl3f","name":"dgdgdfdfd","active":true,"id":"112033124304597707450","email":"user10@rvtcompany.page"},{"role":"admin","idContract":"k71qps8l","name":"NAM PHAN","active":true,"id":"111348398142083650098","email":"quangln@rvtcompany.page"}], department: [{"name":"Security","active":true,"idManager":"111162821854229823178","id":"k779j0s3","idApprovers":"[\"108826265259234244326\"]"},{"name":"HR","active":true,"idManager":"111348398142083650098","id":"k78xkb4v","idApprovers":"[\"111162821854229823178\"]"}]}
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
      this.setState({ confirmActive: true, confirmMessage });
    });
  }

  confirmHandler(res) {
    this.setState({ confirmActive: false, confirmMessage: "" });
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
        this.props.enqueueSnackbar(e.message, { variant: "error" });
      });
    }).catch(() => { });
  }

  saveNotification(notification) {
    let fn = apiService.updateNotification;
    if (!notification) return;
    if (!notification.id) {
      fn = apiService.addNotification;
    }
    let toSave = {};
    Object.assign(toSave, notification);
    toSave.receipient = JSON.stringify(notification.receipient);
    console.log(toSave);
    fn(toSave).then(res => {
      console.log(res);
      if (notification.id) {
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

  sendNotification(notification, sendTime, sendNow) {
    let key = this.props.enqueueSnackbar("Đang thực hiện", { variant: "info" });
    let aSendTime = sendTime;
    if (sendNow)
      aSendTime = undefined;

    apiService.sendNotification(notification, aSendTime).then(res => {
      console.log(res);
      this.props.closeSnackbar(key);
      this.setState(state => {
        state.notification.status = 'sent';
        state.sendModalActive = false;
        return state;
      });
    }).catch(e => {
      console.error(e);
      this.props.closeSnackbar(key);
      this.props.enqueueSnackbar(e.message, { variant: "error" });
    });
  }
  componentDidMount() {
    let jobs = [apiService.listDepartment(), apiService.listUsers()];
    //this.setState({loading: true});
    Promise.all(jobs).then(([departments, users]) => {
      this.setState({
        loading: false,
        receipientLists: {
          department:departments,
          staff: users
        }
      });
    }).catch(e => {
      console.error(e)
    });

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
    let {receipientLists} = this.state;
    let { id, status, receipient } = this.state.notification;
    let state = this.state;
    return (
      <div className="NotificationNew">
        <div className="title-vs-btn">
          <div className="my-button ti ti-arrow-left" onClick={() => { this.props.history.goBack(); }} style={{ background: "transparent", boxShadow: "none", color: "#888", fontSize: "20px" }}></div>
          <div className="my-button active-btn ti ti-check" style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}
            onClick={() => this.saveNotification(this.state.notification)} ></div>
          {(status === 'draft' && id) ? (<div className="my-button active-btn ti ti-email" style={{ background: "linear-gradient(120deg, #2c4adc, #389ec5)" }}
            onClick={() => this.setState({sendModalActive:true})} ></div>) : (<></>)}
          {(id !== undefined) ? (<div className="my-button ti ti-trash" onClick={() => { this.deleteNotification(id); }}></div>) : (<></>)}
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
              value={notificationTypes.find(noti => noti.value === this.state.notification.type)}
              keyProp="value"
              labelProp="name"
              onChange={(evt, v) => {
                console.log(v, evt);
                this.setState(state => {
                  state.notification.type = v.value;
                  return state;
                });
              }}
            />
          </div>
          <div className="item-wrap">
            <span>Người nhận</span>
            <RadioGroup aria-label="receipientTypes" name="receipientType" value={receipient.type} onChange={(e) => {
              let value = e.target.value;
              this.setState(state => {
                state.notification.receipient = {type: value, selected: []}
                return state;
              });
            }} row>
              <FormControlLabel
                value="all"
                control={<Radio color="primary" />}
                label="All"
                labelPlacement="end"
              />
              <FormControlLabel
                value="department"
                control={<Radio color="primary" />}
                label="Dept"
                labelPlacement="end"
              />
              <FormControlLabel
                value="staff"
                control={<Radio color="primary" />}
                label="Staff"
                labelPlacement="end"
              />
            </RadioGroup>
            <Autocomplete options={receipientLists[receipient.type]}
              multiple
              filterSelectedOptions
              keyProp="id"
              labelProp="name"
              value={receipientLists[receipient.type].filter(o => receipient.selected.includes(o.id))}
              onChange={(evt, values) => {
                this.setState(state => {
                  state.notification.receipient.selected = values.map(v => v.id);
                  return state;
                });
              }}
            />
          </div>
          <div className="item-wrap" style={{ width: "100%" }}>
            <span>Tiêu đề</span>
            <BorderBottomInput placeholder="Tiêu đề" name="title" value={this.state.notification.title} onChange={(e) => this.handleChange(e)} />
            <span></span>
            <span>Nội dung</span>
            <div className="pell">
            </div>
          </div>
        </BorderedContainer>
        <CenteredModal active={this.state.sendModalActive} onCancel={() => { this.setState({ sendModalActive: false }) }}>
          <div className="contract-svg"></div>
          <div className="content-modal">
            <h4>Send notification</h4>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{flex: 1, lineHeight: 2}}>
                Hình thức gửi: 
              </div>
              <Select style={{flexBasis: "60%"}} value={this.state.sendNow} onChange={val => {
                console.log(val);
                this.setState({ sendNow: val })
              }}>
                <MenuItem value={true}>Gửi ngay</MenuItem>
                <MenuItem value={false}>Hẹn giờ gửi</MenuItem>
              </Select>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{flex: 1, lineHeight: 2}}>
                Thời gian gửi:
              </div>
              <div style={{ flexBasis: "60%"}}>
                <div>
                  <DateTimePicker
                    autoOk clearable={1} fullWidth
                    inputVariant='outlined'
                    variant='inline'
                    ampm={false}
                    format="yyyy/MM/dd HH:mm"
                    value={state.startTime}
                    onChange={date => this.setState({ sendTime: date })}
                    minDate={new Date()}
                  />
                </div>
                <Error error={state.errors.sendTime} />
              </div>
            </div>
            <div className="footer">
              <button className="my-button-cancel" onClick={() => { this.setState({ sendModalActive: false }) }}>Hủy</button>
              <div className={"my-button-ok" + (this.state.inThePast ? " button-disabled" : "")} style={{ marginRight: "20px" }} onClick={(evt) => {
                this.sendNotification(this.state.notification, this.state.sendTime, this.state.sendNow);
              }}>Gửi</div>
            </div>
          </div>
        </CenteredModal>
        <ConfirmDialog onClose={(res) => this.confirmHandler(res)} active={this.state.confirmActive} message={this.state.confirmMessage} />
      </div>
    );
  }
}

export default withSnackbar(withRouter(NotificationNewPage));
