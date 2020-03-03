import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import { DataTableFilter } from '../../components/DataTableFilter';
import Loading from '../../components/Loading';
import apiService from '../../service/api.service';
import './style.less';


const columns = [
  {
    name: "Tên Bộ Phân",
    selector: "name",
    sortable: true
  },
  {
    name: "Người Quản Lý",
    selector: "manager.name",
    sortable: true
  },
  {
    name: "Người duyệt leave request",
  }

];
class DepartmentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: columns,
      loading: true,
      resetPagination: false,
      filterText: ''
    }
  }

  async componentDidMount() {
    let departments = await apiService.listDepartment({ loadManagers: true });
    const users = await apiService.listUsers();
    columns[2].selector = (dep) => users.filter(u => dep.idApprovers.includes(u.id)).map(u => u.name).join(', ');
    this.setState({ data: departments, loading: false });
  }

  onFilter = (e) => {
    const filterText = e.target.value;
    this.setState({ filterText });
  }

  render() {
    const { data, loading, filterText } = this.state;
    const filteredData = data.filter(d => d.name.toLowerCase().includes(filterText.toLowerCase()));
    if (loading) {
      return (
        <Loading />
      )
    }
    return (<div style={{ marginTop: "40px", borderRadius: "10px", padding: "10px 20px", background: "#fff" }}>
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-plus" onClick={() => this.props.history.push("/departments/new")}></div>
        <div className="title">Bộ phận</div>
      </div>
      <DataTable
        noHeader
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 333px)"
        persistTableHead
        pagination
        noDataComponent='Không có bộ phận'
        columns={this.state.columns}
        data={filteredData}
        pointerOnHover
        highlightOnHover
        onRowClicked={(row, event) => { this.props.history.push(`/departments/${row.id}`); }}
        subHeader
        subHeaderComponent={
          <DataTableFilter
            onFilter={this.onFilter}
            onClear={() => this.setState({ resetPagination: !this.state.resetPagination, filterText: '' })}
            filterText={this.state.filterText}
          />
        }
        paginationResetDefaultPage={this.state.resetPagination}
      />
    </div>)
  }
}

export default withRouter(DepartmentPage);
