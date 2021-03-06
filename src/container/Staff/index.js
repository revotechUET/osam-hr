import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import './style.less';
import apiService from '../../service/api.service';
import Loading from '../../components/Loading';
import { DataTableFilter } from '../../components/DataTableFilter';
import { Checkbox, MenuItem, Select, ListItemText } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import Autocomplete from '../../components/Autocomplete';

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
      data: [{"role":"admin","contract":{"name":"CTV","leaveRequest":false,"lunch":false,"id":"k71qrl3f","type":"parttime"},"idContract":"k71qrl3f","name":"Le Van Thinh","active":true,"id":"111162821854229823178","departments":[],"email":"user8@rvtcompany.page"},{"role":"user","contract":{"name":"CTV","leaveRequest":false,"lunch":false,"id":"k71qrl3f","type":"parttime"},"idContract":"k71qrl3f","name":"Boooo","active":true,"id":"108826265259234244326","departments":[{"name":"Security","active":true,"idManager":"111162821854229823178","id":"k779j0s3","idApprovers":"[\"108826265259234244326\"]"}],"email":"user2@rvtcompany.page"},{"role":"manager","contract":{"name":"CTV","leaveRequest":false,"lunch":false,"id":"k71qrl3f","type":"parttime"},"idContract":"k71qrl3f","name":"NAM PRO hehe","active":true,"departments":[{"name":"Security","active":true,"idManager":"111162821854229823178","id":"k779j0s3","idApprovers":"[\"108826265259234244326\"]"}],"id":"110714449735001419856","email":"user1@rvtcompany.page"},{"role":"user","contract":{"name":"CTV","leaveRequest":false,"lunch":false,"id":"k71qrl3f","type":"parttime"},"idContract":"k71qrl3f","name":"dgdgdfdfd","active":true,"id":"112033124304597707450","departments":[{"name":"HR","active":true,"idManager":"111348398142083650098","id":"k78xkb4v","idApprovers":"[\"111162821854229823178\"]"},{"name":"Security","active":true,"idManager":"111162821854229823178","id":"k779j0s3","idApprovers":"[\"108826265259234244326\"]"}],"email":"user10@rvtcompany.page"},{"role":"admin","contract":{"name":"Chính thức","leaveRequest":true,"lunch":true,"id":"k71qps8l","type":"fulltime"},"idContract":"k71qps8l","name":"NAM PHAN","active":true,"id":"111348398142083650098","departments":[{"name":"Security","active":true,"idManager":"111162821854229823178","id":"k779j0s3","idApprovers":"[\"108826265259234244326\"]"}],"email":"quangln@rvtcompany.page"}],
      loading: false,
      resetPagination: false,
      filterText: '',
      departments: [{"name":"Security","active":true,"idManager":"111162821854229823178","id":"k779j0s3","idApprovers":"[\"108826265259234244326\"]"},{"name":"HR","active":true,"idManager":"111348398142083650098","id":"k78xkb4v","idApprovers":"[\"111162821854229823178\"]"}],
      contracts: [{"name":"Chính thức","leaveRequest":true,"lunch":true,"id":"k71qps8l","type":"fulltime"},{"name":"CTV","leaveRequest":false,"lunch":false,"id":"k71qrl3f","type":"parttime"}],
      departmentFilters: [],
      contractFilters: [],
      //data: [],
      //contracts: [],
      //departments: []
    }
  }

  componentDidMount() {
    this.clear();
    this.loadAll();
  }

  loadAll() {
    /*let promises = [];
    promises.push(this.loadDepartments());
    promises.push(this.loadUsers());
    promises.push(this.loadContracts());*/
    this.setState({loading: true});
    Promise.all([
      apiService.listDepartment(),
      apiService.getContracts(),
      apiService.listUsers({ full: true })
    ]).then(results => {
      let [departments, contracts, users] = results;
      this.setState({
        data: users,
        departments, contracts,
        loading: false
      });
    }).catch(e => {
      this.props.enqueueSnackbar(e.message, {variant: "error"});
      this.setState({loading: false});
    });
    /*
    try {
      await Promise.all(promises);
      this.setState({
        loading: false
      })
    } catch (e) {
      this.props.enqueueSnackbar(e.message, {variant: "error"});
    }
    */
  }

  clear() {
    this.setState({
      data: [],
      filterText: '',
      departmentFilters: [],
      contractFilters: []
    });
  }

  // async loadDepartments() {
  //   return new Promise(async (res, rej) => {
  //     let rs = await apiService.listDepartment();
  //     rs.push({id: "ALL", name: "All"});
  //     this.setState({
  //       departments: rs
  //     }, res(true));
  //   });
  // }

  // async loadContracts() {
  //   return new Promise(async (res, rej) => {
  //     let rs = await apiService.getContracts();
  //     rs.push({id: "ALL", name: "All"});
  //     this.setState({
  //       contracts: rs
  //     }, res(true));
  //   });
  // }

  // async loadUsers() {
  //   return new Promise(async (res, rej)=>{
  //     let users = await apiService.listUsers({ full: true });
  //     this.setState({ data: users }, res(true));
  //   });
  // }

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
    return data.filter((e)=>{
      //filter by contracts
      if (this.state.contractFilters.length > 0) {
        return this.state.contractFilters.includes(e.idContract);
      }
      return true;
    })
    .filter((e)=>{
      //filter by departments
      if (this.state.departmentFilters.length > 0) {
        let deps = e.departments.map(de=>de.id);
        return !this.state.departmentFilters.some((d)=>!deps.includes(d));
      }
      return true;
    });
  }

  // contractFilterHandle(values) {
  //   //
  //   this.setState((state)=>{
  //     //check if all state has all in ?
  //     let allIdxBefore = state.contractFilters.findIndex((e)=>e == "ALL");
  //     let allIdxAfter = values.findIndex((e) => e == "ALL");

  //     //case 1: uncheck All:
  //     if (allIdxBefore > -1 && allIdxAfter < 0) {
  //       return {
  //         contractFilters: []
  //       };
  //     }
  //     //case 2: check all
  //     else if (allIdxBefore < 0 && allIdxAfter > -1) {
  //       return {
  //         contractFilters: this.state.contracts.map((e) => e.id)
  //       }
  //     }
  //     //normal case
  //     return {
  //       contractFilters: values
  //     }
  //   });
  // }

  // departmentFilterHandle(values) {
  //   this.setState((state)=>{
  //     //check if all state has all in ?
  //     let allIdxBefore = state.departmentFilters.findIndex((e)=>e == "ALL");
  //     let allIdxAfter = values.findIndex((e) => e == "ALL");

  //     //case 1: uncheck All:
  //     if (allIdxBefore > -1 && allIdxAfter < 0) {
  //       return {
  //         departmentFilters: []
  //       };
  //     }
  //     //case 2: check all
  //     else if (allIdxBefore < 0 && allIdxAfter > -1) {
  //       return {
  //         departmentFilters: this.state.departments.map((e) => e.id)
  //       }
  //     }
  //     //normal case
  //     return {
  //       departmentFilters: values
  //     }
  //   });
  // }

  render() {
    //console.log(this.state.departments);
    const { data, loading, filterText } = this.state;
    if (loading) return <Loading />
    const filteredData = this.filterByContractAndDepartment(data.filter(d => (d.name.toLowerCase() + ";" +d.email.toLowerCase()).includes(filterText.toLowerCase())));
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
            <div style={{display: "flex"}}>
              <div style={{marginRight: "20px"}}>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  options={this.state.contracts}
                  value={this.state.contracts.filter(c => this.state.contractFilters.includes(c.id))}
                  keyProp="id"
                  labelProp="name"
                  label = "Hợp đồng"
                  onChange={(e, values) => {
                    this.setState(state => {
                      return {
                        contractFilters: values.map(v => v.id)
                      }
                    })
                  }}
                />
              </div>
              <div style={{marginRight: "20px"}}>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  options={this.state.departments}
                  value={this.state.departments.filter(d => this.state.departmentFilters.includes(d.id))}
                  keyProp="id"
                  labelProp="name"
                  label = "Bộ phận"
                  onChange={(e, values) => {
                    this.setState(state => {
                      return {
                        departmentFilters: values.map(v => v.id)
                      }
                    })
                  }}
                />

              </div>

              {/* <Select onChange={(e) => {
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
              </Select> */}
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
