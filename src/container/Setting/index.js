import React from "react";
import { withRouter } from "react-router-dom";
import CenteredModal from "./../../components/CenteredModal";

import "./style.less";

class SettingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workDayModal: false
    };
  }

  resetState() {
    this.setState({
      workDayModal: false
    });
  }

  componentDidMount() {
    this.resetState();
  }

  render() {
    return (
      <div className="SettingPage">
        <div>
          <h1 style={{ marginBottom: "10px" }}>Cài đặt</h1>
          <div className="fieldrow">
            <div className="fieldname">Ngày kết thúc kì lương</div>
            <div className="fieldinput">
              <select>
                <option>Hello</option>
              </select>
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Reset nghỉ phép của năm</div>
            <div className="fieldinput">
              <select>
                <option>Hello</option>
              </select>
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Lời chào buổi sáng</div>
            <div className="fieldinput">
              <input />
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Cài đặt ngày nghỉ trong năm</div>
            <div className="fieldinput">
              <button className="my-button active-btn"
                onClick={() => {
                  this.props.history.push("/setting/day-off");
                }}
              >
                Cài đặt
              </button>
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Cài đặt ca làm sáng</div>
            <div className="fieldinput">
              <input type="time" />
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Cài đặt ca làm chiều</div>
            <div className="fieldinput">
              <input type="time" />
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Cài đặt thời gian tính ăn trưa</div>
            <div className="fieldinput">
              Check in trước <input type="time" /> & Check out sau{" "}
              <input type="time" />
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Cài đặt ngày làm việc</div>
            <div className="fieldinput">
              <button className="my-button active-btn"
                onClick={() => {
                  this.setState({ workDayModal: true });
                }}
              >
                Cài đặt
              </button>
            </div>
          </div>
        </div>
        <CenteredModal
          active={this.state.workDayModal}
          onCancel={() => {
            this.setState({ workDayModal: false });
          }}
        >
          <div>
            <div className="header">
              Cài đặt ngày làm việc
            </div>
            <div className="field-container">
              <div>
                <div className="input-field">
                  <div className="label">Thứ hai</div>
                  <div>
                    <select className="input">
                      <option>Hello</option>
                    </select>
                  </div>
                </div>
                <div className="input-field">
                  <div className="label">Thứ hai</div>
                  <div>
                    <select className="input">
                      <option>Hello</option>
                    </select>
                  </div>
                </div>
                <div className="input-field">
                  <div className="label">Thứ hai</div>
                  <div >
                    <select className="input">
                      <option>Hello</option>
                    </select>
                  </div>
                </div>
                <div className="input-field">
                  <div className="label">Thứ hai</div>
                  <div>
                    <select className="input">
                      <option>Hello</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <div className="input-field">
                  <div className="label">Thứ hai</div>
                  <div>
                    <select className="input">
                      <option>Hello</option>
                    </select>
                  </div>
                </div>
                <div className="input-field">
                  <div className="label">Thứ hai</div>
                  <div>
                    <select className="input">
                      <option>Hello</option>
                    </select>
                  </div>
                </div>
                <div className="input-field">
                  <div className="label">Thứ hai</div>
                  <div>
                    <select className="input">
                      <option>Hello</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer">
              <div className="my-button">Hủy</div>
              <div className="my-button active-btn">Lưu</div>
            </div>
          </div>
        </CenteredModal>
      </div>
    );
  }
}

export default withRouter(SettingPage);
