import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import './style.less';
import apiService from '../../service/api.service';

const columns = [
  {
    name: 'Tên nhân viên',
    selector: 'name',
    sortable: true
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true
  },
  {
    name: 'Bộ phận',
    selector: user => user.departments.map(d => d.name),
    sortable: true
  },
  {
    name: 'Kiểu hợp đồng',
    selector: user => user.contract && user.contract.name || '',
    sortable: true
  },
  {
    name: 'Trạng thái',
    selector: user => user.active ? 'Hoạt động' : 'Ngừng hoạt động',
    sortable: true
  },
];

class StaffPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    }
    //return nameList.join(", ");
  }

  componentDidMount() {
    this.clear();
    this.loadUsers();
  }

  clear() {
    this.setState({
      data: [],
      loading: false,
    })
  }

  async loadUsers() {
    let users = await apiService.listUsers({ full: true });
    this.setState({ data: users });
  }

  render() {
    const { data, loading } = this.state;
    return (<div>
      <h1 style={{ marginBottom: "10px" }}>Nhân viên</h1>
      <button className="my-button active-btn" onClick={() => { this.props.history.push("/staffs/new") }}>Tạo mới</button>
      <DataTable
        noHeader
        noDataComponent='Không có nhân viên'
        progressPending={loading}
        columns={columns}
        data={data}
      />
    </div>)
  }
}

export default withRouter(StaffPage);
