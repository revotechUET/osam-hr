import React, { useCallback, useEffect, useReducer } from "react";
import { useParams, withRouter } from "react-router-dom";
import Autocomplete from "../components/Autocomplete";
import BorderedContainer from "../components/BorderedContainer";
import Error from "../components/Error";
import Loading from "../components/Loading";
import apiService from "../service/api.service";
import { leaveReason } from "../utils/enums";


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
      <div className="title-vs-btn">
        <div className="my-button ti ti-arrow-left" onClick={() => history.goBack()} style={{background: "transparent", boxShadow: "none", color: "#888", fontSize: "20px"}}></div>
        <div className="my-button active-btn ti ti-check" onClick={save} style={{background: "linear-gradient(120deg, #67dc2c, #38c53e)"}}></div>
        <div className="title">Yêu cầu nghỉ / <span className="uppercase">{id}</span></div>
      </div>
      <BorderedContainer>
        <div className="item-wrap">
          <span>Nhân Viên</span>
          <div>
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
          </div>
          <Error error={state.errors.idRequester} />
        </div>
        <div className="item-wrap">
          <span>Lý do nghỉ</span>
          <div>
            <select className="input" value={state.reason} onChange={event => setState({ reason: event.target.value })} >
              <option value='' label='---Chọn lý do nghỉ---' />
              {leaveReason.all.map(r => <option key={r} value={r} label={leaveReason[r]} />)}
            </select>
          </div>
          <Error error={state.errors.reason} />
        </div>
        <div className="item-wrap">
          <span>Thời gian bắt đầu</span>
          <div>
            <input className="input" type="datetime-local" value={state.startTime} onChange={event => setState({ startTime: event.target.value })} />
          </div>
          <Error error={state.errors.startTime} />
        </div>
        <div className="item-wrap">
          <span>Thời gian kết thúc</span>
          <div>
            <input className="input" type="datetime-local" value={state.endTime} onChange={event => setState({ endTime: event.target.value })} />
          </div>
          <Error error={state.errors.endTime} />
        </div>
        <div className="item-wrap">
          <span>Mô tả</span>
          <div>
            <textarea className="input" value={state.description} onChange={event => setState({ description: event.target.value })} />
          </div>
          <Error error={state.errors.endTime} />
        </div>
      </BorderedContainer>
    </div>
  );
}

export default withRouter(LeaveEditPage);
