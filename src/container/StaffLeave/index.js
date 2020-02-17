import React from 'react';
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

class StaffLeavePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: false,
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const list = await apiService.listLeaves({});
    this.setState({ list, loading: false });
  }

  render() {
    const { list, loading } = this.state;
    return (<div >
      <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ</h1>
      <button className="my-button active-btn" onClick={() => this.props.history.push("/leaves/new")}>Tạo mới</button>
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
    </div>)
  }
}

export default withRouter(StaffLeavePage);
