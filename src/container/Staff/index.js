import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import './style.less';
import apiService from '../../service/api.service';
import Loading from '../../components/Loading';

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
    selector: user => user.departments.map(d => d.name).join(", "),
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
      loading: true,
    })
  }

  async loadUsers() {
    let users = await apiService.listUsers({ full: true });
    this.setState({ data: users, loading: false });
  }

  goToUserDetail(user) {
    //console.log(user);
    this.props.history.push({
      pathname: '/staffs/' + user.id,
      state: {user: user}
    });
  }

  render() {
    const { data, loading } = this.state;
    return (<div style={{marginTop: "40px", borderRadius: "20px", padding: "10px 20px", borderRadius: "20px", background: this.state.loading?"#00000000":"#fff"}}>
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-plus" onClick={() => { this.props.history.push("/staffs/new") }}></div>
        <div className="title">Nhân viên</div>
      </div>
      <DataTable 
        noHeader
        noDataComponent='Không có nhân viên'
        progressPending={loading}
        progressComponent={<Loading/>}
        columns={columns}
        data={data}
        pointerOnHover
        highlightOnHover
        onRowClicked={(row, event) => {this.goToUserDetail(row)}}
      />
    </div>)
  }
}

export default withRouter(StaffPage);
