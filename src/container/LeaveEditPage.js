import React, { useCallback, useEffect, useReducer } from "react";
import { useParams, withRouter } from "react-router-dom";
import Autocomplete from "../components/Autocomplete";
import BorderedContainer from "../components/BorderedContainer";
import Error from "../components/Error";
import Loading from "../components/Loading";
import apiService from "../service/api.service";
import { leaveReason } from "../utils/enums";
import { Select } from "@material-ui/core";

function LeaveEditPage({ history }) {
  const { id } = useParams();
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      id,
      idRequester: null,
      idApprover: null,
      startTime: '',
      endTime: '',
      reason: '',
      description: '',
      notifyList: [],
      users: null,
      errors: {},
      loading: true,
    });
  const cancellable = apiService.useCancellable();
  useEffect(() => {
    (async () => {
      try {
        const users = await cancellable(apiService.listUsers());
        const leave = await cancellable(apiService.leaveDetail({ id }));
        setState({ ...leave, users, loading: false });
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
    }
    if (!state.endTime) {
      errors.endTime = 'Chọn thời gian kết thúc'
    } else if (state.endTime <= state.startTime) {
      errors.endTime = 'Thời gian kết thúc không hợp lệ';
    }
    if (!state.reason === '') {
      errors.reason = 'Chọn lý do nghỉ';
    }
    if (Object.keys(errors).length) {
      return setState({ errors });
    }
    const { id, idRequester, idApprover, startTime, endTime, reason, description } = state;
    await apiService.leaveEdit({ id, idRequester, idApprover, startTime, endTime, reason, description });
    history.goBack();
  }, [state]);
  if (state.loading) return <Loading />;
  console.log(state);
  return (
    <div className="StaffLeaveNew">
      <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ / <span className="uppercase">{id}</span></h1>
      <div style={{ display: "flex" }}>
        <div className="my-button active-btn" onClick={save}>Lưu</div>
        <div className="my-button" onClick={() => history.goBack()}>Hủy</div>
      </div>
      <BorderedContainer>
        <h3 className="uppercase">{id}</h3>
        <div className="input-field">
          <div className="label">Nhân Viên</div>
          <Autocomplete
            loading={state.users === null}
            style={{ flex: 1 }}
            options={state.users}
            keyProp='id'
            labelProp='name'
            defaultValue={state.users.find(u => u.id === state.idRequester)}
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
          <div className="label">Mô tả</div>
          <textarea className="input" value={state.description} onChange={event => setState({ description: event.target.value })} />
        </div>
      </BorderedContainer>
    </div>
  );
}

export default withRouter(LeaveEditPage);
