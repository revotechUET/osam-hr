import { useSnackbar } from "notistack";
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
  const { enqueueSnackbar } = useSnackbar();
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
    try {
      await apiService.leaveNew({ idRequester, startTime, endTime, reason, description });
      enqueueSnackbar('Đã tạo yêu cầu nghỉ', { variant: 'success' });
      history.goBack();
    } catch (error) {
      enqueueSnackbar(error.message || 'Không thể tạo yêu cầu nghỉ', { variant: 'error' });
    }
  }, [state]);
  return (
    <div className="StaffLeaveNew">
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-check" onClick={save} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
        <div className="my-button ti ti-close" onClick={() => history.goBack()} style={{ background: "#ddd", boxShadow: "none", color: "#888" }}></div>
        <div className="title">Yêu cầu nghỉ / Mới</div>
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
          <span>Thông báo cho</span>
          <div>
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
        </div>
        <div className="item-wrap">
          <span>Mô tả</span>
          <div>
            <textarea className="input" value={state.description} onChange={event => setState({ description: event.target.value })} />
          </div>
        </div>
      </BorderedContainer>
    </div>
  );
}

export default withRouter(StaffLeaveNewPage);
