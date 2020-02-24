import React, { useCallback, useEffect, useReducer } from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/Loading';
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
  const onRowClicked = useCallback((row, event) => {
    history.push(`/leaves/${row.id}`);
  });
  const { list, loading } = state;
  return (
    <div style={{marginTop: "40px", borderRadius: "10px", padding: "10px 20px", background: "#fff"}}>
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-plus" onClick={() => history.push("/leaves/new")}></div>
        <div className="title">Yêu cầu nghỉ</div>
      </div>
      <DataTable
        noHeader
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 333px)"
        noDataComponent='Không có yêu cầu nghỉ'
        progressPending={loading}
        progressComponent={<Loading />}
        persistTableHead
        columns={columns}
        data={list}
        onRowClicked={onRowClicked}
        pointerOnHover
        highlightOnHover
        pagination
      />
    </div>
  )
}

export default withRouter(StaffLeavePage);
