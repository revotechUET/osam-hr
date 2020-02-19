import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import './style.less';
import apiService from '../../service/api.service';

let departments = [];
let contracts = [];


class StaffPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      data: [],
      contracts: [],
      departments: []
    };
    this.getDepartmentListName = this.getDepartmentListName.bind(this);
    this.getDepartmentName = this.getDepartmentName.bind(this);
    this.columns = [
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
        selector: 'departments',
        sortable: false,
        cell: (row) => {console.log(row); console.log(row.getDepartmentNames(row.departments)); return <div></div>}
      },
      {
        name: 'Trạng thái',
        selector: 'active',
        cell: (row) => <input defaultChecked = {row.active} type="checkbox"/>
      }
    ];
  }

  getDepartmentName(idDepartment) {
    let idx = this.state.departments.findIndex((e)=>e.id == idDepartment);
    if (idx < 0) return "";
    return this.state.departments[idx].name;
   }

  getDepartmentListName(departments) {
    let nameList = [];
    for (let i = 0; i < departments.length; i++) {
      nameList.push(this.getDepartmentName(departments[i]))
    }
    return nameList.join(", ");
  }

  componentDidMount() {
    this.clear();
    this.loadUsers();
    this.loadContracts();
    this.loadDepartments();
  }

  clear() {
    this.setState({
      selected: "",
      data: [],
      contracts: [],
      departments: []
    })
  }

  async loadUsers() {
    let users = await apiService.listUsers();
    //console.log(users);
    this.setState({ data: users.map((e)=>{e.getDepartmentNames = this.getDepartmentListName; return e}) });
  }

  async loadContracts() {
    let contracts = await apiService.getContracts();
    this.setState({
      contracts: contracts
    });
  }

  async loadDepartments() {
    let departments = await apiService.listDepartment();
    this.setState({
      departments: departments
    });
  }

  render() {
    const { data } = this.state;

    return (<div>
      <h1 style={{ marginBottom: "10px" }}>Nhân viên</h1>
      <button className="my-button active-btn" onClick={() => { this.props.history.push("/staffs/new") }}>Tạo mới</button>
      <DataTable
        noHeader
        noDataComponent='Không có nhân viên'
        columns={this.columns}
        data={data}
      />
    </div>)
  }
}

export default withRouter(StaffPage);
