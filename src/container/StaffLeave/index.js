import React, { useReducer, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import apiService from '../../service/api.service';
import { dateFormat } from '../../utils/date';
import { leaveReason, leaveStatus } from '../../utils/enums';
import './style.less';

const columns = [
  {
    name: 'Mã',
    selector: 'id',
    style: { textTransform: 'uppercase' },
  },
  {
    name: 'Nhân viên',
    selector: 'requester.name',
  },
  {
    name: 'Lý do nghỉ',
    selector: row => leaveReason[row.reason],
  },
  {
    name: 'Thời gian bắt đầu',
    selector: row => dateFormat(row.startTime, 'dd/MM/yyyy hh:mm'),
  },
  {
    name: 'Thời gian kết thúc',
    selector: row => dateFormat(row.endTime, 'dd/MM/yyyy hh:mm'),
  },
  {
    name: 'Trạng thái',
    selector: row => leaveStatus[row.status],
  },
]

function StaffLeavePage({ history }) {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      list: [],
      loading: false,
    });
  const cancellable = apiService.useCancellable();

  useEffect(() => {
    (async () => {
      setState({ loading: true })
      const list = await cancellable(apiService.listLeaves({}));
      setState({ list, loading: false });
    })();
  }, []);

  const { list, loading } = state;
  return (
    <div >
      <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ</h1>
      <button className="my-button active-btn" onClick={() => history.push("/leaves/new")}>Tạo mới</button>
      <div>
        <DataTable
          noHeader
          noDataComponent='Không có yêu cầu nghỉ'
          progressPending={loading}
          persistTableHead
          columns={columns}
          data={list}
        />
      </div>
    </div>
  )
}

export default withRouter(StaffLeavePage);
