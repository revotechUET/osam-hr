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
    name: 'Công',
    selector: row => row.points.toFixed(1),
  },
  {
    name: 'Nghỉ có phép',
    selector: row => row.permittedLeaves.toFixed(1),
  },
  {
    name: 'Nghỉ không phép',
    selector: row => row.unpermittedLeaves.toFixed(1),
  },
  {
    name: 'Tổng công',
    selector: row => +(row.points + row.permittedLeaves).toFixed(1),
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
      setState({ departments: [{ name: 'Tất cả' }, ...departments], loadingDepartments: false });
    })()
  }, []);

  const proceed = async () => {
    try {
      const { startDate, endDate, idDepartment } = state;
      if (!startDate || !endDate) return;
      setState({ proceeded: true, loading: true });
      try {
        const data = await cancellable(apiService.getPayroll(startDate, endDate, idDepartment));
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
        {/* <div className="button-text my-button active-btn">Tải về</div> */}
        <div className="title">Bộ phận</div>
        <div style={{ marginLeft: "20px" }}>
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
        <div className="border-spacing"></div>
        <div className="title">Thời gian</div>
        <div style={{ margin: "0 20px", width: "80px" }}>
          <DatePicker
            value={state.startDate}
            onChange={(date) => setState({ startDate: date })}
            format="dd/MM/yyyy"
            variant="inline"
          />
        </div>
        <span className=" ti ti-arrow-right"></span>
        <div style={{ marginLeft: "20px", width: "80px" }}>
          <DatePicker
            value={state.endDate}
            onChange={(date) => setState({ endDate: date })}
            format="dd/MM/yyyy"
            variant="inline"
            maxDate={new Date()}
          />
        </div>
        <div className="border-spacing"></div>
        <div className="button-text my-button active-btn" onClick={() => proceed()} disabled={!state.startDate || !state.endDate}>Tính công</div>
      </div>
      <div style={{ marginTop: "40px", borderRadius: "10px", padding: "10px 20px", background: state.loading ? "#00000000" : "#fff" }}>
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
    </div>
  )
}

export default withRouter(PayrollPage);
