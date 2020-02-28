import { Chip, MenuItem, Select, TextField } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { isSameDay, startOfDay, sub } from "date-fns";
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
      startTime: null,
      endTime: null,
      reason: '',
      description: '',
      notifyList: [],
      users: null,
      notifyListInput: '',
      errors: {},
    });
  const cancellable = apiService.useCancellable();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    (async () => {
      try {
        setState({ loading: true });
        const users = await cancellable(apiService.listUsers());
        setState({ users, usersEmail: users.map(u => u.email), loading: false });
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
    } else {
      if (state.reason == 1 && !isSameDay(state.startTime, state.endTime)) {
        errors.endTime = 'Thời gian đi công vụ phải kết thúc trong ngày';
      }
      if (state.endTime <= state.startTime) {
        errors.endTime = 'Thời gian kết thúc không hợp lệ';
      }
    }
    if (state.reason === '') {
      errors.reason = 'Chọn lý do nghỉ';
    }
    if (!state.description) {
      errors.description = 'Nhập mô tả';
    }
    setState({ errors });
    if (Object.keys(errors).length) return;
    const { idRequester, startTime, endTime, reason, description, notifyList } = state;
    try {
      const newLeave = await apiService.leaveNew({ idRequester, startTime, endTime, reason, description, notifyList });
      if (!newLeave) throw new Error();
      enqueueSnackbar('Đã tạo yêu cầu nghỉ', { variant: 'success' });
      history.push(`/leaves/${newLeave.id}`);
    } catch (error) {
      enqueueSnackbar(error.message || 'Không thể tạo yêu cầu nghỉ', { variant: 'error' });
    }
  }, [state]);

  const onNotifyListInputChange = (event) => {
    let value = event.target.value;
    setState({ notifyListInput: value });
    if (!value || !value.includes(' ')) return;
    const fragments = value.split(' ');
    const emails = [];
    for (const fragment of fragments) {
      if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fragment)) {
        emails.push(fragment);
      }
    }
    if (!emails.length) return;
    let { notifyList } = state;
    for (const email of emails) {
      value = value.replace(email, '');
      if (!notifyList.includes(email)) notifyList.push(email);
    }
    value.trim();
    setState({ notifyList, notifyListInput: value });
  }
  const { users, notifyList } = state;
  return (
    <div className="StaffLeaveNew">
      <div className="title-vs-btn">
        <div className="my-button ti ti-arrow-left" onClick={() => history.goBack()} style={{ background: "transparent", boxShadow: "none", color: "#888", fontSize: "20px" }}></div>
        <div className="my-button active-btn ti ti-check" onClick={save} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
        <div className="title">Yêu cầu nghỉ / Mới</div>
      </div>
      <BorderedContainer>
        <div className="item-wrap">
          <span>Nhân Viên</span>
          <div>
            <Autocomplete
              loading={users === null}
              style={{ flex: 1 }}
              options={users}
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
          <span>Thông báo cho</span>
          <div>
            <Autocomplete
              multiple freeSolo
              filterSelectedOptions
              loading={users === null}
              style={{ flex: 1 }}
              options={users}
              keyProp='id'
              labelProp='name'
              value={users && users.filter(u => notifyList.includes(u.email)) || []}
              onChange={(event, values) => {
                const emails = values.map(v => v.email);
                let notifyList = state.notifyList;
                for (const email of emails) {
                  if (!notifyList.includes(email)) notifyList.push(email);
                }
                setState({ notifyList });
              }}
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    fullWidth
                    variant='outlined'
                    inputProps={{
                      ...params.inputProps,
                      value: state.notifyListInput,
                      onChange: onNotifyListInputChange,
                      onKeyDown: (event) => {
                        if (event.keyCode !== 8 || event.target.selectionStart !== 0) return;
                        event.stopPropagation();
                        setState({ notifyList: state.notifyList.slice(0, -1) });
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: notifyList.map(email =>
                        <Chip key={email} label={email}
                          onDelete={(event) => setState({ notifyList: notifyList.filter(e => e !== email) })}
                        />
                      )
                    }}
                  />
                )
              }}
            />
          </div>
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
          <Error error={state.errors.description} />
        </div>
      </BorderedContainer>
    </div>
  );
}

export default withRouter(StaffLeaveNewPage);
