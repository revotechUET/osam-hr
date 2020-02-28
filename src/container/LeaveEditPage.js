import { MenuItem, Select, TextField } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { isSameDay, startOfDay, sub } from "date-fns";
import { useSnackbar } from "notistack";
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
  const { enqueueSnackbar } = useSnackbar();
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
  const minDate = startOfDay(sub(new Date(), { days: 15 }));
  const save = useCallback(async () => {
    const errors = {};
    console.log(state);
    if (!state.idRequester) {
      errors.idRequester = 'Chọn nhân viên';
    }
    if (!state.startTime) {
      errors.startTime = 'Chọn thời gian bắt đầu';
    } else if (state.startTime < minDate) {
      errors.startTime = 'Thời gian bắt đầu không hợp lệ';
    }
    if (!state.endTime) {
      errors.endTime = 'Chọn thời gian kết thúc'
    } else if (state.endTime <= state.startTime) {
      errors.endTime = 'Thời gian kết thúc không hợp lệ';
    } else {
      if (state.reason == 1 && !isSameDay(state.startTime, state.endTime)) {
        errors.endTime = 'Thời gian đi công vụ phải kết thúc trong ngày';
      }
      if (state.endTime <= state.startTime) {
        errors.endTime = 'Thời gian kết thúc không hợp lệ';
      }
    }
    if (!state.reason === '') {
      errors.reason = 'Chọn lý do nghỉ';
    }
    if (!state.description) {
      errors.description = 'Nhập mô tả';
    }
    if (Object.keys(errors).length) {
      return setState({ errors });
    }
    setState({ errors });
    if (Object.keys(errors).length) return;
    const { id, idRequester, idApprover, startTime, endTime, reason, description } = state;
    try {
      const ok = await apiService.leaveEdit({ id, idRequester, idApprover, startTime, endTime, reason, description });
      if (!ok) throw new Error();
      history.goBack();
      enqueueSnackbar('Đã lưu yêu cầu nghỉ', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Không thể lưu yêu cầu nghỉ', { variant: 'error' });

    }
  }, [state]);
  if (state.loading) return <Loading />;
  console.log(state);
  return (
    <div className="StaffLeaveNew">
      <div className="title-vs-btn">
        <div className="my-button ti ti-arrow-left" onClick={() => history.goBack()} style={{ background: "transparent", boxShadow: "none", color: "#888", fontSize: "20px" }}></div>
        <div className="my-button active-btn ti ti-check" onClick={save} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
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
            <Select variant='outlined' fullWidth
              value={state.reason}
              onChange={e => setState({ reason: e.target.value })}
            >
              {leaveReason.all.map(r => <MenuItem key={r} value={r}>{leaveReason[r]}</MenuItem>)}
            </Select>
          </div>
          <Error error={state.errors.reason} />
        </div>
        <div className="item-wrap">
          <span>Thời gian bắt đầu</span>
          <div>
            <DateTimePicker
              autoOk clearable={1} fullWidth
              inputVariant='outlined'
              variant='inline'
              ampm={false}
              format="yyyy/MM/dd HH:mm"
              value={state.startTime}
              onChange={date => setState({ startTime: date })}
              minDate={minDate}
            />
          </div>
          <Error error={state.errors.startTime} />
        </div>
        <div className="item-wrap">
          <span>Thời gian kết thúc</span>
          <div>
            <DateTimePicker
              autoOk clearable={1} fullWidth
              inputVariant='outlined'
              variant='inline'
              ampm={false}
              format="yyyy/MM/dd HH:mm"
              value={state.endTime}
              onChange={date => setState({ endTime: date })}
              minDate={state.startTime || minDate}
            />
          </div>
          <Error error={state.errors.endTime} />
        </div>
        <div className="item-wrap">
          <span>Mô tả</span>
          <div>
            <TextField
              multiline fullWidth variant='outlined'
              value={state.description}
              onChange={event => setState({ description: event.target.value })}
            />
          </div>
          <Error error={state.errors.endTime} />
        </div>
      </BorderedContainer>
    </div>
  );
}

export default withRouter(LeaveEditPage);
