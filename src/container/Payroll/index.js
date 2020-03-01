import { DatePicker } from "@material-ui/pickers";
import { useSnackbar } from "notistack";
import React, { useEffect, useReducer } from 'react';
import DataTable from "react-data-table-component";
import { withRouter } from 'react-router-dom';
import XLSX from 'xlsx/dist/xlsx.mini.min';
import Autocomplete from "../../components/Autocomplete";
import Loading from "../../components/Loading";
import apiService from "../../service/api.service";
import { dateFormat } from "../../utils/date";
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
      startDate: new Date(),
      endDate: new Date(),
      idDepartment: null,
      departments: null,
      loadingFilter: true,
      proceeded: false,
      loading: false,
      data: [],
    });
  const cancellable = apiService.useCancellable();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    (async () => {
      const departmentsPromise = cancellable(apiService.listDepartment());
      const monthIntervalPromise = cancellable(apiService.getMonthInterval());
      const departments = await departmentsPromise;
      const { start } = await monthIntervalPromise;
      setState({ departments: [{ name: 'Tất cả' }, ...departments], startDate: start, loadingFilter: false });
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
  const download = () => {

    const name = `tinhcong_${dateFormat(state.startDate, 'yyyyMMdd')}_${dateFormat(state.endDate, 'yyyyMMdd')}.xlsx`;
    const data = state.data.map(d => ({
      'Tên nhân viên': d.name,
      'Email': d.email,
      'Bộ phận': d.departments.map(dep => dep.name).join(', '),
      'Công trong tháng': d.points,
      'Nghỉ có phép': d.permittedLeaves,
      'Nghỉ không phép': d.unpermittedLeaves,
      'Tổng công': d.points + d.permittedLeaves,
      'Buổi ăn trưa': d.lunches,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), name);
    XLSX.writeFile(wb, name);
  }

  if (state.loadingFilter) return <Loading />
  return (
    <div className="Payroll">
      <div className="title-vs-btn">
        <div className="title">Bộ phận</div>
        <div style={{ marginLeft: "20px" }}>
          <Autocomplete
            style={{ flex: 1 }}
            filterSelectedOptions
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
        {state.data && state.data.length ? <div className="button-text my-button active-btn" onClick={() => download()}>Tải về</div> : null}
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
