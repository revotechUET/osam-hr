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
];

class StaffPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      data: [],
    }
  }

  async componentDidMount() {
    const users = await apiService.listUsers();
    console.log(users);

    this.setState({ data: users });
  }

  render() {
    const { data } = this.state;
    return (<div>
      <h1 style={{ marginBottom: "10px" }}>Nhân viên</h1>
      <button className="my-button active-btn" onClick={() => { this.props.history.push("/staffs/new") }}>Tạo mới</button>
      <DataTable
        noHeader
        noDataComponent='Không có nhân viên'
        columns={columns}
        data={data}
      />
    </div>)
  }
}

export default withRouter(StaffPage);
