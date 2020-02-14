import React from 'react';
import DataTable from 'react-data-table-component';
import Skeleton from 'react-loading-skeleton';
import { withRouter } from 'react-router-dom';
import apiService from '../../service/api.service';
import { leaveReason, leaveStatus } from '../../utils/enums';
import './style.less';

const columns = [
  {
    name: 'Mã',
    selector: 'id',
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
    selector: 'startTime',
  },
  {
    name: 'Thời gian kết thúc',
    selector: 'endTime',
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
      list: null,
    }
  }

  async componentDidMount() {
    const list = await apiService.listLeaves({});
    this.setState({ list });
  }

  render() {
    const { list } = this.state;
    if (!list) return (
      <Skeleton />
    )
    return (<div >
      <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ</h1>
      <button className="my-button active-btn" onClick={() => this.props.history.push("/leaves/new")}>Tạo mới</button>
      <div>
        <DataTable
          noHeader
          noDataComponent='Không có yêu cầu nghỉ'
          columns={columns}
          data={list}
        />
      </div>
    </div>)
  }
}

export default withRouter(StaffLeavePage);
