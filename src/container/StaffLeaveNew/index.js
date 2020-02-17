import React, { useCallback, useEffect, useReducer } from "react";
import { withRouter } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import Error from "../../components/Error";
import apiService from "../../service/api.service";
import { leaveReason } from "../../utils/enums";
import BorderedContainer from "./../../components/BorderedContainer";
import './style.less';

function StaffLeaveNewPage({ history }) {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      idRequester: null,
      startTime: '',
      endTime: '',
      reason: '',
      description: '',
      notifyList: [],
      users: null,
      errors: {},
    });
  const cancellable = apiService.useCancellable();
  useEffect(() => {
    (async () => {
      try {
        setState({ loading: true });
        const users = await cancellable(apiService.listUsers());
        setState({ users, loading: false });
      } catch (error) {
      }
    })();
  }, []);
  const save = useCallback(async () => {
    const errors = {};
    console.log(state);
    if (!state.idRequester) {
      errors.idRequester = 'Chọn nhân viên';
    }
    if (!state.startTime) {
      errors.startTime = 'Chọn thời gian bắt đầu';
    } else if (new Date(state.startTime) <= new Date()) {
      errors.startTime = 'Thời gian bắt đầu không hợp lệ';
    }
    if (!state.endTime) {
      errors.endTime = 'Chọn thời gian kết thúc'
    } else if (state.endTime <= state.startTime) {
      errors.endTime = 'Thời gian kết thúc không hợp lệ';
    }
    if (!state.reason) {
      errors.reason = 'Chọn lý do nghỉ';
    }
    if (Object.keys(errors).length) {
      return setState({ errors });
    }
    const { idRequester, startTime, endTime, reason, description } = state;
    await apiService.addLeave({ idRequester, startTime, endTime, reason, description });
    history.goBack();
  }, [state]);
  return (
    <div className="StaffLeaveNew">
      <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ / Mới</h1>
      <div style={{ display: "flex" }}>
        <div className="my-button active-btn" onClick={save}>Lưu</div>
        <div className="my-button" onClick={() => history.goBack()}>Hủy</div>
      </div>
      <BorderedContainer>
        <h3>Mới</h3>
        <div className="input-field">
          <div className="label">Nhân Viên</div>
          <Autocomplete
            loading={state.users === null}
            style={{ flex: 1 }}
            options={state.users}
            keyProp='id'
            labelProp='name'
            onChange={(event, value) => {
              setState({ idRequester: value && value.id })
            }}
          />
          <Error error={state.errors.idRequester} />
        </div>
        <div className="input-field">
          <div className="label">Lý do nghỉ</div>
          <select className="input" value={state.reason} onChange={event => setState({ reason: event.target.value })} >
            <option value='' label='---Chọn lý do nghỉ---' />
            {leaveReason.all.map(r => <option key={r} value={r} label={leaveReason[r]} />)}
          </select>
          <Error error={state.errors.reason} />
        </div>
        <div className="input-field">
          <div className="label">Thời gian bắt đầu</div>
          <input className="input" type="datetime-local" value={state.startTime} onChange={event => setState({ startTime: event.target.value })} />
          <Error error={state.errors.startTime} />
        </div>
        <div className="input-field">
          <div className="label">Thời gian kết thúc</div>
          <input className="input" type="datetime-local" value={state.endTime} onChange={event => setState({ endTime: event.target.value })} />
          <Error error={state.errors.endTime} />
        </div>
        <div className="input-field">
          <div className="label">Thông báo cho</div>
          <Autocomplete
            multiple
            filterSelectedOptions
            loading={state.users === null}
            style={{ flex: 1 }}
            options={state.users}
            keyProp='id'
            labelProp='name'
            onChange={(event, values) => {
              setState({ notifyList: values.map(v => v.id) });
            }}
          />
        </div>
        <div className="input-field">
          <div className="label">Mô tả</div>
          <textarea className="input" value={state.description} onChange={event => setState({ description: event.target.value })} />
        </div>
      </BorderedContainer>
    </div>
  );
}

export default withRouter(StaffLeaveNewPage);
