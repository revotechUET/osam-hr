import React, { useCallback, useEffect, useReducer } from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/Loading';
import apiService from '../../service/api.service';
import { dateFormat } from '../../utils/date';
import { leaveReason, leaveStatus } from '../../utils/enums';
import { DataTableFilter } from '../../components/DataTableFilter';
import Autocomplete from '../../components/Autocomplete';

import './style.less';

const columns = [
  {
    name: 'Mã',
    selector: 'id',
    style: { textTransform: 'uppercase' },
    sortable: true,
  },
  {
    name: 'Nhân viên',
    selector: 'requester.name',
  },
  {
    name: 'Lý do nghỉ',
    selector: row => leaveReason[row.reason],
    sortable: true,
  },
  {
    name: 'Thời gian bắt đầu',
    selector: row => dateFormat(row.startTime, 'dd/MM/yyyy hh:mm'),
    sortable: true,
  },
  {
    name: 'Thời gian kết thúc',
    selector: row => dateFormat(row.endTime, 'dd/MM/yyyy hh:mm'),
    sortable: true,
  },
  {
    name: 'Trạng thái',
    selector: row => leaveStatus[row.status],
    sortable: true,
  },
]

function StaffLeavePage({ history }) {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      list: [],
      loading: false,
      filterText: '',
      statusFilter: [],
      reasonFilter: [],
      resetPagination: false,
      users: [],
      selectedUser: null
    });
  const cancellable = apiService.useCancellable();

  useEffect(() => {
    (async () => {
      setState({ loading: true })
      const list = await cancellable(apiService.listLeaves({}));
      const users = await cancellable(apiService.listUsers());
      setState({ list, users, loading: false });
    })();
  }, []);

  const onRowClicked = useCallback((row, event) => {
    history.push(`/leaves/${row.id}`);
  });
  const { list, loading } = state;
  console.log(state.selectedUser);
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
        data={
          list
          .filter((d)=>{
            return state.selectedUser ?  d.requester.id == state.selectedUser : true
          })
          .filter((d)=>{
            return state.statusFilter.length ? state.statusFilter.includes(d.status) : true
          })
          .filter((d)=>{
            return state.reasonFilter.length ? state.reasonFilter.includes(d.reason) : true
          })
        }
        onRowClicked={onRowClicked}
        pointerOnHover
        highlightOnHover
        pagination
        subHeader
        subHeaderComponent={
          <div>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={statusOptions}
              value={statusOptions.filter(d => state.statusFilter.includes(d.value))}
              keyProp="value"
              labelProp="name"
              onChange={(e, values) => {
                setState({
                  statusFilter: values.map(v => v.value)
                })
              }}
            />
            <Autocomplete
              multiple
              filterSelectedOptions
              options={reasonOptions}
              value={reasonOptions.filter(d => state.reasonFilter.includes(d.value))}
              keyProp="value"
              labelProp="name"
              onChange={(e, values) => {
                setState({
                  reasonFilter: values.map(v => v.value)
                })
              }}
            />
            <Autocomplete
              //filterSelectedOptions
              options={state.users}
              value={state.users.find(e => e.id == state.selectedUser)}
              keyProp="id"
              labelProp="name"
              onChange={(e, value) => {
                //console.log('value: ', value);
                setState({
                  selectedUser: value.id
                })
              }}
            />
            <DataTableFilter
              onFilter={(e)=>{
                setState({
                  filterText: e.target.value
                })
              }}
              onClear={() => setState({ resetPagination: !state.resetPagination, filterText: '' })}
              filterText={state.filterText}
            />
          </div>
        }
      />
    </div>
  )
}

let statusOptions = [
  {
    name: 'Đã phê duyệt',
    value: 'approved'
  },
  {
    name: 'Đang chờ',
    value: 'waiting'
  },
  {
    name: 'Đã từ chối',
    value: 'rejected'
  },
  {
    name: 'Đã hết hạn',
    value: 'expired'
  }
]

let reasonOptions = [
  {
    name: 'Lý do khác',
    value: 0
  },
  {
    name: 'Đi công vụ',
    value: 1
  },
  {
    name: 'Đi công tác',
    value: 2
  }
]




export default withRouter(StaffLeavePage);
