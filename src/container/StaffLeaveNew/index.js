import React, { useReducer } from "react";
import { withRouter } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import apiService from "../../service/api.service";
import { leaveReason } from "../../utils/enums";
import BorderedContainer from "./../../components/BorderedContainer";
import ChipsContainer from './../../components/ChipsContainer';
import './style.less';

function StaffLeaveNewPage() {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      idRequester: null,
      startTime: null,
      endTime: null,
      reason: leaveReason.all[0],
      description: '',
      notifyList: [],
    });
  return (
    <div className="StaffLeaveNew">
      <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ / Mới</h1>
      <div style={{ display: "flex" }}>
        <div className="my-button active-btn">Lưu</div>
        <div className="my-button">Hủy</div>
      </div>
      <BorderedContainer>
        <h3>Mới</h3>
        <div className="input-field">
          <div className="label">Nhân Viên</div>
          <Autocomplete style={{ flex: 1 }} getOptions={apiService.listUsers} onChange={user => setState({ idRequester: user.id })} />
        </div>
        <div className="input-field">
          <div className="label">Lý do nghỉ</div>
          <select>
            {leaveReason.all.map(r => <option value={r} label={leaveReason[r]} />)}
          </select>
        </div>
        <div className="input-field">
          <div className="label">Thời gian bắt đầu</div>
          <input type="datetime-local" />
        </div>
        <div className="input-field">
          <div className="label">Thời gian kết thúc</div>
          <input type="datetime-local" />
        </div>
        <div className="input-field">
          <div className="label">Thông báo cho</div>
          <div className="input">
            <ChipsContainer />
          </div>
        </div>
        <div className="input-field">
          <div className="label">Mô tả</div>
          <textarea className="input" />
        </div>
      </BorderedContainer>
    </div>
  );
}

export default withRouter(StaffLeaveNewPage);
