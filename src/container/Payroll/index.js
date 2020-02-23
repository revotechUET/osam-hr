import { DatePicker } from "@material-ui/pickers";
import { startOfMonth } from "date-fns";
import { useSnackbar } from "notistack";
import React, { useEffect, useReducer } from 'react';
import DataTable from "react-data-table-component";
import { withRouter } from 'react-router-dom';
import Autocomplete from "../../components/Autocomplete";
import Loading from "../../components/Loading";
import apiService from "../../service/api.service";
import './style.less';

const columns = [
  {
    name: 'Nhân viên',
    selector: 'name',
  },
  {
    name: 'Tổng công',
    selector: 'points',
  },
  {
    name: 'Buổi ăn trưa',
    selector: 'lunches',
  },
]

function PayrollPage({ history }) {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      startDate: startOfMonth(new Date()),
      endDate: new Date(),
      idDepartment: null,
      departments: null,
      loadingDepartments: true,
      proceeded: false,
      loading: false,
      data: [],
    });
  const cancellable = apiService.useCancellable();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    (async () => {
      const departments = await cancellable(apiService.listDepartment());
      setState({ departments, loadingDepartments: false });
    })()
  }, []);

  const proceed = async () => {
    try {
      const { startDate, endDate, idDepartment } = state;
      if (!startDate || !endDate) return;
      setState({ proceeded: true, loading: true });
      try {
        const data = await cancellable(apiService.getPayroll(startDate.toISOString(), endDate.toISOString(), idDepartment));
        setState({ data });
      } catch (error) {
        enqueueSnackbar(error.message || 'Lỗi không xác định', { variant: 'error' });
      } finally {
        setState({ loading: false });
      }
    } catch (error) {
      console.error(error);
    }
  }

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
              value={state.startDate}
              onChange={(date) => setState({ startDate: date })}
              format="dd/MM/yyyy"
              variant="inline"
            />
            <span>đến</span>
            <DatePicker
              value={state.endDate}
              onChange={(date) => setState({ endDate: date })}
              format="dd/MM/yyyy"
              variant="inline"
              maxDate={new Date()}
            />
          </div>
          <div className="field-member">
            <div>
              Chọn bộ phận
            </div>
            <div>
              <Autocomplete
                style={{ flex: 1 }}
                filterSelectedOptions
                loading={state.loadingDepartments}
                options={state.departments}
                keyProp='id'
                labelProp='name'
                onChange={(event, value) => {
                  setState({ idDepartment: value && value.id || null });
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <button className="my-button-ok" onClick={() => proceed()} disabled={!state.startDate || !state.endDate}>Tính công</button>
        </div>
      </div>
      {
        state.proceeded &&
        <DataTable
          noHeader
          fixedHeader
          fixedHeaderScrollHeight="calc(100vh - 333px)"
          noDataComponent='Không có dữ liệu'
          progressPending={state.loading}
          progressComponent={<Loading />}
          persistTableHead
          columns={columns}
          data={state.data}
          pagination
        />
      }
    </div>
  )
}

export default withRouter(PayrollPage);
