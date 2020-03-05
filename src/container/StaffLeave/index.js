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
  {
    name: 'Lý do huỷ',
    selector: 'deletedReason',
    sortable: true
  },
  {
    name: 'eventId',
    selector: 'eventId',
    sortable: true
  }
]

function StaffLeavePage({ history }) {
  const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
    {
      list: [{"requester":{"role":"manager","idContract":"k71qps8l","name":"User 8","active":true,"id":"111162821854229823178","email":"user8@rvtcompany.page"},"reason":0,"description":"Corona","idApprover":"111348398142083650098","startTime":"2020-02-13T14:58:58.630Z","id":"lr-k76b146p","endTime":"2020-02-15T14:00:00.000Z","idRequester":"111162821854229823178","status":"deleted"},{"requester":{"role":"admin","idContract":"k71qps8l","name":"Quang","active":true,"id":"111348398142083650098","email":"quangln@rvtcompany.page"},"reason":0,"description":"111","startTime":"2020-03-02T17:56:23.424Z","idApprover":"111348398142083650098","id":"lr-k7c71r2e","endTime":"2020-03-03T17:56:27.150Z","idRequester":"111348398142083650098","status":"approved"},{"requester":{"role":"admin","idContract":"k71qps8l","name":"Quang","active":true,"id":"111348398142083650098","email":"quangln@rvtcompany.page"},"reason":0,"description":"EM muon","startTime":"2020-03-05T13:00:00.000Z","idApprover":"111348398142083650098","id":"lr-k7ddvw3l","endTime":"2020-03-07T13:00:00.000Z","idRequester":"111348398142083650098","status":"approved"},{"requester":{"role":"admin","idContract":"k71qps8l","name":"Quang","active":true,"id":"111348398142083650098","email":"quangln@rvtcompany.page"},"reason":0,"description":"Test","startTime":"2020-03-10T13:00:00.000Z","idApprover":"111348398142083650098","id":"lr-k7dexnf0","endTime":"2020-03-10T14:00:00.000Z","idRequester":"111348398142083650098","status":"deleted"}],
      loading: false,
      filterText: '',
      statusFilter: [],
      reasonFilter: [],
      resetPagination: false,
      users: [{"role":"manager","idContract":"k71qps8l","name":"User 8","active":true,"id":"111162821854229823178","email":"user8@rvtcompany.page"},{"role":"user","idContract":"k71qrl3f","name":"NAM Phan","active":true,"id":"110714449735001419856","email":"user1@rvtcompany.page"},{"role":"admin","idContract":"k71qps8l","name":"Quang","active":true,"id":"111348398142083650098","email":"quangln@rvtcompany.page"},{"role":"admin","idContract":"k71qps8l","name":"Nguyen Khanh Hung","active":true,"id":"116372198382742977395","email":"user6@rvtcompany.page"}],
      selectedUser: null
    });
  const cancellable = apiService.useCancellable();

  useEffect(() => {
    (async () => {
      setState({ loading: true })
      try {
        const list = await cancellable(apiService.listLeaves({}));
        const users = await cancellable(apiService.listUsers());
        setState({ list, users});
      } catch (e) {
        console.error(e);
      } finally {
        setState({loading: false});
      }
      
    })();
  }, []);

  const onRowClicked = useCallback((row, event) => {
    history.push(`/leaves/${row.id}`);
  });
  const { list, loading } = state;
  //console.log(state.selectedUser);
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
          .filter((d => (d.requester.name.toLowerCase() + ";" + d.id.toLowerCase()).includes(state.filterText.toLowerCase())))
        }
        onRowClicked={onRowClicked}
        pointerOnHover
        highlightOnHover
        pagination
        subHeader
        subHeaderComponent={
          <div style={{display: "flex"}}>
            <div style={{marginRight: "20px"}}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={statusOptions}
              value={statusOptions.filter(d => state.statusFilter.includes(d.value))}
              keyProp="value"
              labelProp="name"
              label = "Trạng thái"
              onChange={(e, values) => {
                setState({
                  statusFilter: values.map(v => v.value)
                })
              }}
            />

            </div>
            <div style={{marginRight: "20px"}}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={reasonOptions}
              value={reasonOptions.filter(d => state.reasonFilter.includes(d.value))}
              keyProp="value"
              labelProp="name"
              label = "Lý do"
              onChange={(e, values) => {
                setState({
                  reasonFilter: values.map(v => v.value)
                })
              }}
            />
            </div>
            <div style={{marginRight: "20px"}}>
            <Autocomplete
              disableClearable={false}
              filterSelectedOptions
              options={state.users}
              value={state.users.find(e => e.id == state.selectedUser)}
              keyProp="id"
              labelProp="name"
              label="Nhân viên"
              onChange={(e, value) => {
                //console.log('value: ', value);
                setState({
                  selectedUser: (value || {}).id
                })
              }}
            />
            </div>
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
