import { DatePicker } from "@material-ui/pickers";
import React, { useReducer, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './style.less';
import apiService from "../../service/api.service";

function PayrollPage({ history }) {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      startDate: null,
      endDate: null,
      departments: null,
      loadingDepartments: true,
    });
  const cancellable = apiService.useCancellable();

  useEffect(() => {
    (async () => {

    })()
  }, []);

  return (
    <div className="Payroll">
      <div className="title-vs-btn">
        <div className="button-text my-button active-btn">Tải về</div>
        <div className="title">Tính công</div>
      </div>
      <div className="count-setting">
        <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
          <div className="field-member">
            <div>
              Chọn thời gian tính công
              </div>
            <DatePicker
              label="Basic example"
              value={state.startDate}
              onChange={(date) => setState({ startDate: date })}
              animateYearScrolling
              format="dd/MM/yyyy"
            />
            <span>đến</span>
            <DatePicker
              label="Basic example"
              value={state.endDate}
              onChange={(date) => setState({ endDate: date })}
              animateYearScrolling
              format="dd/MM/yyyy"
            />
          </div>
          <div className="field-member">
            <div>
              Chọn bộ phận
            </div>
            <div>
              <select style={{ width: "250px" }}>
                <option>hello</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <button>Tính công</button>
        </div>
      </div>
    </div>
  )
}

export default withRouter(PayrollPage);
