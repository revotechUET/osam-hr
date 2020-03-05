import React from 'react';
import { withRouter } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { dateFormat } from '../../utils/date';
import apiService from '../../service/api.service';
import Loading from '../../components/Loading';
import { DataTableFilter } from '../../components/DataTableFilter';
import Autocomplete from '../../components/Autocomplete';
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
    selector: row => dateFormat(row.checkinTime, 'HH:mm')
  },
  {
    name: "Giờ check out",
    // selector: 'checkoutTime'
    selector: row => dateFormat(row.checkoutTime, 'HH:mm')
  },
  // {
  //   name: "Tổng công"
  // },
  {
    name: "Ghi chú",
    selector: 'note'
  }
];

const conditionalRowStyles = [
  {
    when: row => row.reportStatus === "reported",
    style: {
      color: '#ff9800',
    }
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
      selectedUser: null,
      users: []
    }
  }

  onFilter = (e) => {
    const filterText = e.target.value;
    this.setState({ filterText });
  }

  async componentDidMount() {
    this.setState({ loading: true });
    let check = await apiService.listCheck({});
    const users = await apiService.listUsers();
    this.setState({ loading: false, staffChecking: check, users });
  }
  render() {
    const { staffChecking, filterText, loading } = this.state;
    if (loading) {
      return (
        <Loading />
      )
    }

    //console.log(staffChecking);
    const filteredData = staffChecking.filter(d => d.requester.name.toLowerCase().includes(filterText.toLowerCase()))
      .filter(e => {
        return this.state.selectedUser ? e.requester.idUser == this.state.selectedUser : true
      });
    //console.log(filteredData);
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
        conditionalRowStyles={conditionalRowStyles}
        pointerOnHover
        highlightOnHover
        onRowClicked={(row, event) => { this.props.history.push(`/checking/${row.id}`); console.log(row); }}
        subHeader
        subHeaderComponent={
          <div style={{display: 'flex'}}>
            <Autocomplete style={{marginRight:'20px'}}
              filterSelectedOptions
              options={this.state.users}
              value={this.state.users.find(e => e.id == this.state.selectedUser)}
              keyProp="id"
              labelProp="name"
              label="Nhân viên"
              onChange={(e, value) => {
                //console.log('value: ', value);
                this.setState({
                  selectedUser: (value || {}).id
                });
              }}
            />
            <DataTableFilter style={{marginRight: '20px'}}
              onFilter={this.onFilter}
              onClear={() => this.setState({ resetPagination: !this.state.resetPagination, filterText: '' })}
              filterText={this.state.filterText}
            />
          </div>
        }
        paginationResetDefaultPage={this.state.resetPagination}
      />
    </div>)
  }
}



export default withRouter(StaffChecking);
