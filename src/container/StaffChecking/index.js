import React from 'react';
import { withRouter } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { dateFormat } from '../../utils/date';
import apiService from '../../service/api.service';
import Loading from '../../components/Loading';
import { DataTableFilter } from '../../components/DataTableFilter';
import './style.less';

const columns = [
  {
    name: 'Ngày',
    selector: row => dateFormat(row.date),
    sortable: true,
  },
  {
    name: 'Nhân viên',
    selector: 'requester.name',
    sortable: true,
  },
  {
    name: "Giờ check in",
    // selector: 'checkinTime'
    selector: row => dateFormat(row.checkinTime, 'hh:mm')
  },
  {
    name: "Giờ check out",
    // selector: 'checkoutTime'
    selector: row => dateFormat(row.checkoutTime, 'hh:mm')
  },
  // {
  //   name: "Tổng công"
  // },
  {
    name: "Ghi chú",
    selector: 'note'
  }
];
class StaffChecking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffChecking: [],
      loading: false,
      allChecking: [],
      resetPagination: false,
      filterText: '',
    }
  }


  onFilter = (e) => {
    const filterText = e.target.value;
    this.setState({ filterText, filteredData: this.state.staffChecking.filter(d => d.requester.name.toLowerCase().includes(filterText.toLowerCase())) });
  }

  async componentDidMount() {
    this.setState({ loading: true });
    let check = await apiService.listCheck({});
    this.setState({ loading: false, staffChecking: check });
  }
  render() {
    const { staffChecking, filterText, loading } = this.state;
    const filteredData = staffChecking.filter(d => d.requester.name.toLowerCase().includes(filterText.toLowerCase()));
    if (loading) {
      return (
        <Loading />
      )
    }
    return (<div style={{ marginTop: "40px", borderRadius: "10px", padding: "10px 20px", background: "#fff" }}>
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-plus" onClick={() => this.props.history.push("/checking/new")}></div>
        <div className="title">Chấm công</div>
      </div>
      <DataTable
        noHeader
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 333px)"
        pagination
        noDataComponent='Không có chấm công'
        progressPending={this.state.loading}
        progressComponent={<Loading />}
        persistTableHead
        columns={columns}
        data={filteredData}
        pointerOnHover
        highlightOnHover
        onRowClicked={(row, event) => { this.props.history.push(`/checking/${row.id}`); }}
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



export default withRouter(StaffChecking);
