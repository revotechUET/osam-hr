import { InputBase, MenuItem, Select } from "@material-ui/core";
import { TimePicker } from "@material-ui/pickers";
import { useSnackbar } from 'notistack';
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

const workDayMenuItems = [
  'Ngày nghỉ',
  'Chỉ ca sáng',
  'Chỉ ca chiều',
  'Cả ngày',
].map((label, i) => <MenuItem key={i} value={i}>{label}</MenuItem>)

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
    tempWorkDays: {},
    errors: {},
  });
  const cancellable = apiService.useCancellable();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    (async () => {
      let setting = await cancellable(apiService.getSetting());
      setState({ loading: false, ...setting, tempWorkDays: [...setting.workDays] });
    })()
  }, []);
  const save = async () => {
    console.log(state);
    let { welcomeMessage, monthEnd, yearEnd, morningStart, morningEnd, afternoonStart, afternoonEnd, lunchStart, lunchEnd, workDays } = state;
    morningStart = new Date(morningStart);
    morningEnd = new Date(morningEnd);
    afternoonStart = new Date(afternoonStart);
    afternoonEnd = new Date(afternoonEnd);
    lunchStart = new Date(lunchStart);
    lunchEnd = new Date(lunchEnd);
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
    setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }
    try {
      const ok = await cancellable(apiService.updateSetting({
        welcomeMessage,
        monthEnd,
        yearEnd,
        morningStart: morningStart,
        morningEnd: morningEnd,
        afternoonStart: afternoonStart,
        afternoonEnd: afternoonEnd,
        lunchStart: lunchStart,
        lunchEnd: lunchEnd,
        workDays,
      }));
      if (ok) {
        enqueueSnackbar('Đã lưu cài đặt', { variant: 'success' });
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Không thể lưu cài đặt', { variant: 'error' });
    }
  }
  const setTempWorkDay = (day, value) => {
    const tempWorkDays = state.tempWorkDays;
    tempWorkDays[day] = value;
    setState({ tempWorkDays });
  }
  if (state.loading) return (<>
    <div className="title-vs-btn">
      <div className="my-button active-btn"></div>
      <div className="title">Cài đặt</div>
    </div>
    <Loading />
  </>)
  {
    return (
      <div className="SettingPage">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={save}></div>
          <div className="title">Cài đặt</div>
        </div>
        <div className="item-setting background-orange w350px bg">
          <div className="title-setting" style={{ fontSize: "150%", textShadow: "0 1px 7px #0000000f" }}>Lời chào buổi sáng</div>
          <div className="dis-setting"><InputBase style={{ color: "#fff" }} fullWidth value={state.welcomeMessage} onChange={(e) => setState({ welcomeMessage: e.target.value })} /></div>
        </div>
        <div className="item-setting background-white w350px with-icon">
          <span className="lunch-svg"></span>
          <div>
            <span>Thời gian tính ăn trưa</span>
            <div>
              <div>
                <span>Check in trước</span>
                <TimePicker inputProps={{ style: { fontWeight: "bold", fontSize: "150%" } }} variant="inline" autoOk ampm={false} minutesStep={5} value={state.lunchStart} onChange={v => setState({ lunchStart: v })} />
              </div>
              <div>
                <span>Check out sau</span>
                <TimePicker inputProps={{ style: { fontWeight: "bold", fontSize: "150%" } }} variant="inline" autoOk ampm={false} minutesStep={5} value={state.lunchEnd} onChange={v => setState({ lunchEnd: v })} />
              </div>
            </div>
            <Error error={state.errors.lunch} />
          </div>
        </div>
        <div className="item-setting background-white w125px">
          <div className="workday-svg"></div>
          <div className="title-setting">Ngày làm việc</div>
          <div className="dis-setting">
            <div className="button-setting" onClick={() => { setState({ workDayModal: true }); }}>Cài đặt</div>
          </div>
        </div>
        <div className="item-setting background-white w125px">
          <div className="freetime-svg"></div>
          <div className="title-setting">Ngày nghỉ trong năm</div>
          <div className="dis-setting">
            <div className="button-setting" onClick={() => { history.push("/setting/day-off"); }}>Cài đặt</div>
          </div>
        </div>
        <div className="item-setting background-white w350px">
          <div className="item-inline">
            <div className="morning-svg"></div>
            <div style={{ flexBasis: "120px" }}>Ca làm sáng</div>
            <span>
              <TimePicker inputProps={{ style: { fontWeight: "bold", fontSize: "150%" } }} variant="inline" autoOk ampm={false} minutesStep={5} value={state.morningStart} onChange={v => setState({ morningStart: v })} />
              <TimePicker inputProps={{ style: { fontWeight: "bold", fontSize: "150%" } }} variant="inline" autoOk ampm={false} minutesStep={5} value={state.morningEnd} onChange={v => setState({ morningEnd: v })} />
            </span>
            <Error error={state.errors.morning} />
          </div>
          <div className="item-inline" style={{ marginTop: "10px" }}>
            <div className="afternoon-svg"></div>
            <div style={{ flexBasis: "120px" }}>Ca làm Chiều</div>
            <span>
              <TimePicker inputProps={{ style: { fontWeight: "bold", fontSize: "150%" } }} variant="inline" autoOk ampm={false} minutesStep={5} value={state.afternoonStart} onChange={v => setState({ afternoonStart: v })} />
              <TimePicker inputProps={{ style: { fontWeight: "bold", fontSize: "150%" } }} variant="inline" autoOk ampm={false} minutesStep={5} value={state.afternoonEnd} onChange={v => setState({ afternoonEnd: v })} />
            </span>
            <Error error={state.errors.afternoon} />
          </div>
        </div>

        <div className="item-setting background-white w450px">
          <div className="item-inline">
            <div className="end-date-svg"></div>
            <div style={{ flexBasis: "170px" }}>Ngày kết thúc kì lương</div>
            <span>
              <Autocomplete
                style={{ flex: 1 }}
                value={dateOptions.find(o => o.id === state.monthEnd)}
                options={dateOptions}
                onChange={(e, option) => setState({ monthEnd: option && option.id })}
              />
            </span>
          </div>
          <div className="item-inline" style={{ marginTop: "10px" }}>
            <div className="reset-salary-svg"></div>
            <div style={{ flexBasis: "170px" }}>Reset nghỉ phép của năm</div>
            <span>
              <Autocomplete
                style={{ flex: 1 }}
                value={monthOptions.find(o => o.id === state.yearEnd)}
                options={monthOptions}
                onChange={(e, option) => setState({ yearEnd: option && option.id })}
              />
            </span>
          </div>
        </div>
        <CenteredModal
          active={state.workDayModal}
          onCancel={() => setState({ workDayModal: false })}
        >
          <div className="content-modal">
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ fontSize: "150%", fontWeight: "bold", marginBottom: "20px" }}>Cài đặt ngày làm việc</div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thứ Hai</div>
              <div style={{ flex: 1 }}>
                <Select variant='outlined' fullWidth
                  value={state.tempWorkDays[1]}
                  onChange={e => setTempWorkDay(1, e.target.value)}
                >
                  {workDayMenuItems}
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thứ Ba</div>
              <div style={{ flex: 1 }}>
                <Select variant='outlined' fullWidth
                  value={state.tempWorkDays[2]}
                  onChange={e => setTempWorkDay(2, e.target.value)}
                >
                  {workDayMenuItems}
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thứ Tư</div>
              <div style={{ flex: 1 }}>
                <Select variant='outlined' fullWidth
                  value={state.tempWorkDays[3]}
                  onChange={e => setTempWorkDay(3, e.target.value)}
                >
                  {workDayMenuItems}
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thứ Năm</div>
              <div style={{ flex: 1 }}>
                <Select variant='outlined' fullWidth
                  value={state.tempWorkDays[4]}
                  onChange={e => setTempWorkDay(4, e.target.value)}
                >
                  {workDayMenuItems}
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thứ Sáu</div>
              <div style={{ flex: 1 }}>
                <Select variant='outlined' fullWidth
                  value={state.tempWorkDays[5]}
                  onChange={e => setTempWorkDay(5, e.target.value)}
                >
                  {workDayMenuItems}
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thứ Bảy</div>
              <div style={{ flex: 1 }}>
                <Select variant='outlined' fullWidth
                  value={state.tempWorkDays[6]}
                  onChange={e => setTempWorkDay(6, e.target.value)}
                >
                  {workDayMenuItems}
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
              <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Chủ Nhật</div>
              <div style={{ flex: 1 }}>
                <Select variant='outlined' fullWidth
                  value={state.tempWorkDays[0]}
                  onChange={e => setTempWorkDay(0, e.target.value)}
                >
                  {workDayMenuItems}
                </Select>
              </div>
            </div>
            <div className="footer">
              <div className="my-button-cancel" onClick={() => setState({ workDayModal: false })}>Hủy</div>
              <div className="my-button-ok" onClick={() => setState({ workDayModal: false, workDays: [...state.tempWorkDays] })} >Lưu</div>
            </div>
          </div>
        </CenteredModal>
      </div>
    );
  }
}

export default withRouter(SettingPage);
