import { TextField } from "@material-ui/core";
import { TimePicker } from "@material-ui/pickers";
import React, { useEffect, useReducer } from "react";
import { withRouter } from "react-router-dom";
import Autocomplete from '../../components/Autocomplete';
import Error from "../../components/Error";
import Loading from '../../components/Loading';
import apiService from "../../service/api.service";
import CenteredModal from "./../../components/CenteredModal";
import "./style.less";

const dateOptions = new Array(31).fill().map((v, i) => ({
  id: i + 1,
  name: 'Ngày ' + (i + 1),
}));

const monthOptions = new Array(12).fill().map((v, i) => ({
  id: i,
  name: 'Tháng ' + (i + 1),
}));

const workDayOptions = [
  {
    id: 0,
    name: 'Ngày nghỉ',
  },
  {
    id: 1,
    name: 'Chỉ ca sáng',
  },
  {
    id: 2,
    name: 'Chỉ ca chiều',
  },
  {
    id: 3,
    name: 'Cả 2 ca',
  },
]

function SettingPage({ history }) {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }), {
    welcomeMessage: null,
    monthEnd: null,
    yearEnd: null,
    morningStart: null,
    morningEnd: null,
    afternoonStart: null,
    afternoonEnd: null,
    lunchStart: null,
    lunchEnd: null,
    workDays: null,
    loading: true,
    workDayModal: false,
    errors: {},
  });
  const cancellable = apiService.useCancellable();
  useEffect(() => {
    (async () => {
      let setting = await cancellable(apiService.getSetting());
      setState({ loading: false, ...setting });
    })()
  }, []);
  const save = async () => {
    const { welcomeMessage, monthEnd, yearEnd, morningStart, morningEnd, afternoonStart, afternoonEnd, lunchStart, lunchEnd, workDays } = state;
    const errors = {};
    if (morningStart >= morningEnd || morningEnd >= afternoonStart) {
      errors.morning = 'Thời gian không hợp lệ';
    }
    if (afternoonStart >= afternoonEnd) {
      errors.afternoon = 'Thời gian không hợp lệ';
    }
    if (lunchStart >= lunchEnd) {
      errors.lunch = 'Thời gian không hợp lệ';
    }
    if (Object.keys(errors).length) {
      return setState({ errors });
    }
    await cancellable(apiService.updateSetting({
      welcomeMessage, monthEnd, yearEnd, morningStart, morningEnd, afternoonStart, afternoonEnd, lunchStart, lunchEnd, workDays
    }))
  }
  const setWorkDay = (day, value) => {
    const workDays = state.workDays;
    workDays[day] = value;
    setState({ workDays });
  }
  if (state.loading) return <Loading />
  {
    return (
      <div className="SettingPage">
        <div>
          <div className="title-vs-btn">
            <div className="my-button active-btn ti ti-check" onClick={save}></div>
            <div className="title">Cài đặt</div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Ngày kết thúc kì lương</div>
            <div className="fieldinput">
              <Autocomplete value={dateOptions.find(o => o.id === state.monthEnd)} options={dateOptions} onChange={(e, option) => setState({ monthEnd: option && option.id })} />
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Reset nghỉ phép của năm</div>
            <div className="fieldinput">
              <Autocomplete value={monthOptions.find(o => o.id === state.yearEnd)} options={monthOptions} onChange={(e, option) => setState({ yearEnd: option && option.id })} />
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Lời chào buổi sáng</div>
            <div className="fieldinput">
              <TextField value={state.welcomeMessage} onChange={(e) => setState({ welcomeMessage: e.target.value })} />
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Ngày nghỉ trong năm</div>
            <div className="fieldinput">
              <button className="my-button active-btn"
                onClick={() => {
                  history.push("/setting/day-off");
                }}
              >
                Cài đặt
              </button>
            </div>
          </div>
          <div className="fieldrow">
            <div className="fieldname">Ca làm sáng</div>
            <div className="fieldinput">
              <TimePicker variant="inline" autoOk ampm={false} minutesStep={5} value={state.morningStart} onChange={v => setState({ morningStart: v })} />
              <span> - </span>
              <TimePicker variant="inline" autoOk ampm={false} minutesStep={5} value={state.morningEnd} onChange={v => setState({ morningEnd: v })} />
            </div>
            <Error error={state.errors.morning} />
          </div>
          <div className="fieldrow">
            <div className="fieldname">Ca làm chiều</div>
            <div className="fieldinput">
              <TimePicker variant="inline" autoOk ampm={false} minutesStep={5} value={state.afternoonStart} onChange={v => setState({ afternoonStart: v })} />
              <span> - </span>
              <TimePicker variant="inline" autoOk ampm={false} minutesStep={5} value={state.afternoonEnd} onChange={v => setState({ afternoonEnd: v })} />
            </div>
            <Error error={state.errors.afternoon} />
          </div>
          <div className="fieldrow">
            <div className="fieldname">Thời gian tính ăn trưa</div>
            <div className="fieldinput">
              <span> Check in trước </span>
              <TimePicker variant="inline" autoOk ampm={false} minutesStep={5} value={state.lunchStart} onChange={v => setState({ lunchStart: v })} />
              <span>& Check out sau </span>
              <TimePicker variant="inline" autoOk ampm={false} minutesStep={5} value={state.lunchEnd} onChange={v => setState({ lunchEnd: v })} />
            </div>
            <Error error={state.errors.lunch} />
          </div>
          <div className="fieldrow">
            <div className="fieldname">Ngày làm việc</div>
            <div className="fieldinput">
              <button className="my-button active-btn"
                onClick={() => {
                  setState({ workDayModal: true });
                }}
              >
                Cài đặt
              </button>
            </div>
          </div>
        </div>
        <CenteredModal
          active={state.workDayModal}
          onCancel={() => {
            setState({ workDayModal: false });
          }}
        >
          <div>
            <div className="header">
              Cài đặt ngày làm việc
            </div>
            <div className="field-container">
              <div>
                <div className="input-field">
                  <div className="label">Thứ Hai</div>
                  <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[1])} options={workDayOptions} onChange={(e, option) => setWorkDay(1, option && option.id)} />
                </div>
                <div className="input-field">
                  <div className="label">Thứ Ba</div>
                  <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[2])} options={workDayOptions} onChange={(e, option) => setWorkDay(2, option && option.id)} />
                </div>
                <div className="input-field">
                  <div className="label">Thứ Tư</div>
                  <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[3])} options={workDayOptions} onChange={(e, option) => setWorkDay(3, option && option.id)} />
                </div>
                <div className="input-field">
                  <div className="label">Thứ Năm</div>
                  <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[4])} options={workDayOptions} onChange={(e, option) => setWorkDay(4, option && option.id)} />
                </div>
              </div>
              <div>
                <div className="input-field">
                  <div className="label">Thứ Sáu</div>
                  <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[5])} options={workDayOptions} onChange={(e, option) => setWorkDay(5, option && option.id)} />
                </div>
                <div className="input-field">
                  <div className="label">Thứ Bảy</div>
                  <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[6])} options={workDayOptions} onChange={(e, option) => setWorkDay(6, option && option.id)} />
                </div>
                <div className="input-field">
                  <div className="label">Chủ Nhật</div>
                  <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[0])} options={workDayOptions} onChange={(e, option) => setWorkDay(0, option && option.id)} />
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
