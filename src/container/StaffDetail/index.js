import React from 'react';
import { withRouter } from 'react-router-dom';
import apiService from '../../service/api.service';
import { withSnackbar } from 'notistack';
import BorderedContainer from "./../../components/BorderedContainer";
import { Checkbox } from '@material-ui/core';
import Loading from '../../components/Loading';
import ConfirmDialog from '../../dialogs/ConfirmDialog';

class StaffDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loading: false
    }
  }

  componentDidMount() {
    this.setState({
      user: this.props.history.location.state.user || {},
      loading: false
    });
  }

  goBack() {
    this.props.history.push({
      pathname: '/staffs'
    });
  }

  goToEdit() {
    this.props.history.push({
      pathname: '/staffs/edit/' + this.state.user.id,
      state: { user: this.state.user }
    });
  }

  confirmIt(message) {
    return new Promise((res, rej) => {
      this._resolve = res;
      this._reject = rej;
      this.setState({
        confirmActive: true,
        confirmMessage: message
      });
    })
  }
  async deleteUser() {
    this.setState({
      loading: true
    })
    let key = this.props.enqueueSnackbar("Đang cập nhật thông tin nhân viên", { variant: 'info' });
    try {
      await apiService.deleteUserById(this.state.user.id);
      this.props.closeSnackbar(key);
      this.props.enqueueSnackbar("Xóa nhân viên thành công", { variant: "success" });
      this.goBack();
    } catch (e) {
      this.setState({
        loading: false
      })
      this.props.enqueueSnackbar(e.message, { variant: "error" });
    }
  }

  render() {
    if (this.state.loading) return <Loading />
    return (
      <div className="StaffDetail">
        <div className="title-vs-btn">
          <div className="my-button ti ti-arrow-left" onClick={() => { this.goBack(); }} style={{ background: "transparent", boxShadow: "none", color: "#888", fontSize: "20px" }}></div>
          <div className="my-button active-btn ti ti-pencil" onClick={() => { this.goToEdit(); }}></div>
          <div className="my-button ti ti-trash" onClick={() => { this.confirmIt("").then(() => this.deleteUser()).catch(e => { }); }}></div>
          <div className="title">Nhân viên / {this.state.user.name || "Loading..."}</div>
        </div>
        <BorderedContainer>
          <div className="item-detail">
            <div className="infor-item-detail">
              <span>Nhân viên</span>
              <div style={{ fontWeight: "bold", fontSize: "150%", marginBottom: "20px" }}>{this.state.user.name || "Loading..."}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Email</div>
                  <div style={{ flex: 1 }}>{this.state.user.email || "Loading..."}</div>
                </div>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Hợp đồng</div>
                  <div style={{ flex: 1 }}>{(this.state.user.contract || {}).name || "Loading..."}</div>
                </div>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Bộ phận</div>
                  <div style={{ flex: 1 }}>{(this.state.user.departments || []).map((e) => e.name).join(", ")}</div>
                </div>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Vai trò</div>
                  <div style={{ flex: 1 }}>{role[this.state.user.role || "Loading"]}</div>
                </div>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Hoạt động</div>
                  <div style={{ flex: 1 }}><Checkbox defaultChecked value={this.state.user.active ? "checked" : ""} disabled /></div>
                </div>
              </div>
            </div>
          </div>
        </BorderedContainer>
        <ConfirmDialog active={this.state.confirmActive} message={this.state.confirmMessage} onClose={(result) => {
          if (result) this._resolve();
          else this._reject();
        }} />
      </div>
    );
  }
}

let role = {
  "admin": "Admin",
  "manager": "Back office",
  "user": "Nhân viên",
  "Loading": "Loading"
}

export default withSnackbar(withRouter(StaffDetailPage));
