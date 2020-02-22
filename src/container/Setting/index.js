import { TextField, InputBase } from "@material-ui/core";
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
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={save}></div>
          <div className="title">Cài đặt</div>
        </div>
        <div className="item-setting background-orange w350px bg">
          <div className="title-setting" style={{fontSize: "150%", textShadow: " 0 1px 7px #0000000f;"}}>Lời chào buổi sáng</div>
          <div className="dis-setting"><InputBase inputProps={{style:{color: "#fff", width:"100%"}}} value={state.welcomeMessage} onChange={(e) => setState({ welcomeMessage: e.target.value })} /></div>
        </div>
        <div className="item-setting background-white w350px with-icon">
          <span className="lunch-svg"></span>
          <div>
              <span>Thời gian tính ăn trưa</span>
              <div>
                <div>
                  <span>Check in trước</span>
                  <TimePicker TextFieldComponent={InputBase} inputProps={{style:{fontWeight: "bold", fontSize: "150%"}}} variant="inline" autoOk ampm={false} minutesStep={5} value={state.lunchStart} onChange={v => setState({ lunchStart: v })} />
                </div>
                <div>
                  <span>Check out sau</span>
                  <TimePicker TextFieldComponent={InputBase} inputProps={{style:{fontWeight: "bold", fontSize: "150%"}}} variant="inline" autoOk ampm={false} minutesStep={5} value={state.lunchEnd} onChange={v => setState({ lunchEnd: v })} />
                </div>
              </div>
            <Error error={state.errors.lunch} />
          </div>
        </div>
        <div className="item-setting background-white w150px">
          <div className="workday-svg"></div>
          <div className="title-setting">Ngày làm việc</div>
          <div className="dis-setting">
            <div className="button-setting" onClick={() => {setState({ workDayModal: true });}}>Cài đặt</div>
          </div>
        </div>
        <div className="item-setting background-white w150px">
          <div className="freetime-svg"></div>
          <div className="title-setting">Ngày nghỉ trong năm</div>
          <div className="dis-setting">
            <div className="button-setting"onClick={() => {history.push("/setting/day-off");}}>Cài đặt</div>
          </div>
        </div>
        <div className="item-setting background-white w350px">
          <div className="item-inline">
            <div className="morning-svg"></div>
            <div style={{flexBasis: "120px"}}>Ca làm sáng</div>
            <span>
              <TimePicker TextFieldComponent={InputBase} inputProps={{style:{fontWeight: "bold", fontSize: "150%"}}}variant="inline" autoOk ampm={false} minutesStep={5} value={state.morningStart} onChange={v => setState({ morningStart: v })} />
              <TimePicker TextFieldComponent={InputBase} inputProps={{style:{fontWeight: "bold", fontSize: "150%"}}}variant="inline" autoOk ampm={false} minutesStep={5} value={state.morningEnd} onChange={v => setState({ morningEnd: v })} />
            </span>
            <Error error={state.errors.morning} />
          </div>
          <div className="item-inline" style={{marginTop: "10px"}}>
            <div className="afternoon-svg"></div>
            <div style={{flexBasis: "120px"}}>Ca làm Chiều</div>
            <span>
              <TimePicker TextFieldComponent={InputBase} inputProps={{style:{fontWeight: "bold", fontSize: "150%"}}}variant="inline" autoOk ampm={false} minutesStep={5} value={state.afternoonStart} onChange={v => setState({ afternoonStart: v })} />
              <TimePicker TextFieldComponent={InputBase} inputProps={{style:{fontWeight: "bold", fontSize: "150%"}}}variant="inline" autoOk ampm={false} minutesStep={5} value={state.afternoonEnd} onChange={v => setState({ afternoonEnd: v })} />
            </span>
            <Error error={state.errors.afternoon} />
          </div>
        </div>

        <div className="item-setting background-white w450px">
          <div className="item-inline">
            <div className="end-date-svg"></div>
            <div style={{flexBasis: "170px"}}>Ngày kết thúc kì lương</div>
            <span>
              <Autocomplete value={dateOptions.find(o => o.id === state.monthEnd)} options={dateOptions} onChange={(e, option) => setState({ monthEnd: option && option.id })} />
            </span>
          </div>
          <div className="item-inline" style={{marginTop: "10px"}}>
            <div className="reset-salary-svg"></div>
            <div style={{flexBasis: "170px"}}>Reset nghỉ phép của năm</div>
            <span>
              <Autocomplete value={monthOptions.find(o => o.id === state.yearEnd)} options={monthOptions} onChange={(e, option) => setState({ yearEnd: option && option.id })} />
            </span>
          </div>
        </div>
        <CenteredModal
          active={state.workDayModal}
          onCancel={() => {
            setState({ workDayModal: false });
          }}
        >
            <div className="content-modal">
                <div style={{display: "flex", marginBottom: "20px"}}>
                    <div style={{fontSize: "150%", fontWeight: "bold", marginBottom: "20px"}}>Cài đặt ngày làm việc</div>
                </div>
                <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                    <div style={{flexBasis: "120px", fontWeight: "bold"}}>Thứ Hai</div>
                    <div style={{flex: 1}}>
                      <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[1])} options={workDayOptions} onChange={(e, option) => setWorkDay(1, option && option.id)} />
                    </div>
                </div>
                <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                    <div style={{flexBasis: "120px", fontWeight: "bold"}}>Thứ Ba</div>
                    <div style={{flex: 1}}>
                      <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[2])} options={workDayOptions} onChange={(e, option) => setWorkDay(2, option && option.id)} />
                    </div>
                </div>
                <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                    <div style={{flexBasis: "120px", fontWeight: "bold"}}>Thứ Tư</div>
                    <div style={{flex: 1}}>
                      <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[3])} options={workDayOptions} onChange={(e, option) => setWorkDay(3, option && option.id)} />
                    </div>
                </div>
                <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                    <div style={{flexBasis: "120px", fontWeight: "bold"}}>Thứ Năm</div>
                    <div style={{flex: 1}}>
                      <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[4])} options={workDayOptions} onChange={(e, option) => setWorkDay(4, option && option.id)} />
                    </div>
                </div>
                <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                    <div style={{flexBasis: "120px", fontWeight: "bold"}}>Thứ Sáu</div>
                    <div style={{flex: 1}}>
                      <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[5])} options={workDayOptions} onChange={(e, option) => setWorkDay(5, option && option.id)} />
                    </div>
                </div>
                <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                    <div style={{flexBasis: "120px", fontWeight: "bold"}}>Thứ Bảy</div>
                    <div style={{flex: 1}}>
                      <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[6])} options={workDayOptions} onChange={(e, option) => setWorkDay(6, option && option.id)} />
                    </div>
                </div>
                <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                    <div style={{flexBasis: "120px", fontWeight: "bold"}}>Chủ Nhật</div>
                    <div style={{flex: 1}}>
                      <Autocomplete value={workDayOptions.find(o => o.id === state.workDays[0])} options={workDayOptions} onChange={(e, option) => setWorkDay(0, option && option.id)} />
                    </div>
                </div>
                <div className="footer">
                    <div className="my-button-cancel">Hủy</div>
                    <div className="my-button-ok">Lưu</div>
                </div>
            </div>
        </CenteredModal>
      </div>
    );
  }
}

export default withRouter(SettingPage);
