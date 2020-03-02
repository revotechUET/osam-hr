import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import './style.less';
import apiService from '../../service/api.service';
import Loading from '../../components/Loading';
import { DataTableFilter } from '../../components/DataTableFilter';
import { Checkbox, MenuItem, Select, ListItemText } from '@material-ui/core';
import { withSnackbar } from 'notistack';

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
      resetPagination: false,
      filterText: '',
      departments: [],
      contracts: [],
      departmentFilters: [],
      contractFilters: []
    }
  }

  componentDidMount() {
    this.clear();
    this.loadAll();
  }

  async loadAll() {
    let promises = [];
    promises.push(this.loadDepartments());
    promises.push(this.loadUsers());
    promises.push(this.loadContracts());
    try {
      await Promise.all(promises);
      this.setState({
        loading: false
      })
    } catch (e) {
      this.props.enqueueSnackbar(e.message, {variant: "error"});
    }
  }

  clear() {
    this.setState({
      data: [],
      loading: true,
      filterText: '',
      departmentFilters: [],
      contractFilters: []
    });
  }

  async loadDepartments() {
    return new Promise(async (res, rej) => {
      let rs = await apiService.listDepartment();
      rs.push({id: "ALL", name: "All"});
      this.setState({
        departments: rs
      }, res(true));
    });
  }

  async loadContracts() {
    return new Promise(async (res, rej) => {
      let rs = await apiService.getContracts();
      rs.push({id: "ALL", name: "All"});
      this.setState({
        contracts: rs
      }, res(true));
    });
  }

  async loadUsers() {
    return new Promise(async (res, rej)=>{
      let users = await apiService.listUsers({ full: true });
      this.setState({ data: users }, res(true));
    });
  }

  goToUserDetail(user) {
    //console.log(user);
    this.props.history.push({
      pathname: '/staffs/' + user.id,
      state: {user: user}
    });
  }

  onFilter = (e) => {
    const filterText = e.target.value;
    this.setState({ filterText });
  }

  filterByContractAndDepartment(data) {
    //return data.filter((d) => {if (this.state.contractFilter == "ALL") return true; return d.idContract == this.state.contractFilter;});
    return data;
  }

  contractFilterHandle(values) {
    //
    this.setState((state)=>{
      //check if all state has all in ?
      let allIdxBefore = state.contractFilters.findIndex((e)=>e == "ALL");
      let allIdxAfter = values.findIndex((e) => e == "ALL");

      //case 1: uncheck All:
      if (allIdxBefore > -1 && allIdxAfter < 0) {
        return {
          contractFilters: []
        };
      }
      //case 2: check all
      else if (allIdxBefore < 0 && allIdxAfter > -1) {
        return {
          contractFilters: this.state.contracts.map((e) => e.id)
        }
      }
      //normal case
      return {
        contractFilters: values
      }
    });
  }

  departmentFilterHandle(values) {
    this.setState((state)=>{
      //check if all state has all in ?
      let allIdxBefore = state.departmentFilters.findIndex((e)=>e == "ALL");
      let allIdxAfter = values.findIndex((e) => e == "ALL");

      //case 1: uncheck All:
      if (allIdxBefore > -1 && allIdxAfter < 0) {
        return {
          departmentFilters: []
        };
      }
      //case 2: check all
      else if (allIdxBefore < 0 && allIdxAfter > -1) {
        return {
          departmentFilters: this.state.departments.map((e) => e.id)
        }
      }
      //normal case
      return {
        departmentFilters: values
      }
    });
  }

  render() {
    const { data, loading, filterText } = this.state;
    if (loading) return <Loading />
    console.log(this.state.departmentFilters);
    console.log(this.state.contractFilters);
    const filteredData = this.filterByContractAndDepartment(data.filter(d => d.name.toLowerCase().includes(filterText.toLowerCase())));
    return (
      <div style={{marginTop: "40px", borderRadius: "10px", padding: "10px 20px", background: "#fff"}}>
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-plus" onClick={() => { this.props.history.push("/staffs/new") }}></div>
          <div className="title">Nhân viên</div>
        </div>
        <DataTable
          noHeader
          fixedHeader
          fixedHeaderScrollHeight="calc(100vh - 333px)"
          persistTableHead
          pagination
          noDataComponent='Không có nhân viên'
          progressPending={loading}
          progressComponent={<Loading/>}
          columns={columns}
          data={filteredData}
          pointerOnHover
          highlightOnHover
          onRowClicked={(row, event) => {this.goToUserDetail(row)}}
          subHeader
          subHeaderComponent={
            <div>
              <Select onChange={(e) => {
                  this.contractFilterHandle(e.target.value);
                  // this.setState({ contractFilters: e.target.value });
                }}
                value = {this.state.contractFilters}
                outlined="true"
                renderValue={selected => selected.join(', ')}
                multiple
              >
                {
                  (this.state.contracts || []).map((e, idx)=>
                    <MenuItem key={idx} value={e.id}>
                      <Checkbox checked={this.state.contractFilters.findIndex((el) => el == e.id) > -1} />
                      <ListItemText primary={e.name} />
                    </MenuItem>
                  )
                }
              </Select>
              <Select onChange={(e) => {
                  this.departmentFilterHandle(e.target.value);
                  //this.setState({ departmentFilters: e.target.value });
                }}
                value = {this.state.departmentFilters}
                outlined="true"
                renderValue={selected => selected.join(', ')}
                multiple
              >
                {
                  (this.state.departments || []).map((e, idx)=>
                    <MenuItem key={idx} value={e.id}>
                      <Checkbox checked={this.state.departmentFilters.findIndex((el) => el == e.id) > -1} />
                      <ListItemText primary={e.name} />
                    </MenuItem>
                  )
                }
              </Select>
              <DataTableFilter
                onFilter={this.onFilter}
                onClear={() => this.setState({ resetPagination: !this.state.resetPagination, filterText: '' })}
                filterText={this.state.filterText}
              />
            </div>
          }
          paginationResetDefaultPage={this.state.resetPagination}
        />
      </div>
    );
  }
}

export default withSnackbar(withRouter(StaffPage));
