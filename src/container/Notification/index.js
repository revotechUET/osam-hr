import React from 'react';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/Loading';
import DataTable from 'react-data-table-component';
import { DataTableFilter } from '../../components/DataTableFilter';
import apiService from '../../service/api.service';
import './style.less';

const columns = [
  {
    name: 'STT',
    selector: 'id',
    sortable: true
  },
  {
    name: 'Tiêu đề',
    selector: 'title',
    sortable: true
  },
  {
    name: 'Ngày tạo',
    selector: notification => new Date(notification.date).toLocaleString(),
    sortable: true
  },
  {
    name: 'Tổng số người nhận',
    selector: notification => 1,
    sortable: true
  },
  {
    name: 'Trạng thái',
    selector: "status",
    sortable: true
  },
];
const notifications = [{
  id:1, title: "Bao ngi", content: "Duoc <b>nghi</b> roi", type: "popup", receipient: "all:", status:"draft", date: "2020-02-29T07:26:21.334Z"
}, {
  id:2, title: "Thong b nghi", content: "Duoc <b><u>nghi</u></b> roi 1", type: "normal", receipient: "dep:k70bqifn", status: "sent", date: "2020-02-29T07:26:21.334Z"
}, {
  id:4, title: "Bao nghi", content: "Duoc nghi roi 3", type:"normal", receipient: "staff:111348398142083650098", status: "draft", date: "2020-02-29T07:26:21.334Z"
}]
class NotifyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: notifications,
      filteredData: notifications,
      loading: false,
      filterText: "",
      resetPagination: false
    }
  }

  doFilter = (e) => {
    const filterText = e.target.value;
    console.log(filterText, this.state.data, this.state.filteredData);
    this.setState({ 
      filterText, 
      filteredData: this.state.data.filter(d => d.title.toLowerCase().includes(filterText.toLowerCase())) });
  }
  doGet() {
    this.setState({loading: true});
    apiService.getNotifications().then(notifications => {
      this.setState({
        data: notifications,
        filteredData: notifications.filter(noti => noti.title.toLowerCase().includes(this.state.filterText.toLowerCase())),
        loading: false
      });
    }).catch(e => {
      console.error(e);
      //this.setState({loading: false});
    });
  }
  componentDidMount() {
    this.doGet();
  }
  render() {
    const { data, filteredData, loading } = this.state;
    return (<div className = "NotiPage">
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-plus" onClick={()=>this.props.history.push("/notifies/new")}></div>
        <div className="title">Thông báo</div>
      </div>
      <div style={{marginTop: '40px'}}>
        <DataTable
          noHeader
          fixedHeader
          fixedHeaderScrollHeight="calc(100vh - 333px)"
          persistTableHead
          pagination
          paginationResetDefaultPage={this.state.resetPagination}
          noDataComponent='Không có thông báo'
          progressPending={loading}
          progressComponent={<Loading/>}
          columns={columns}
          data={filteredData}
          pointerOnHover
          highlightOnHover
          subHeader
          onRowClicked={(notification, event) => {
            this.props.history.push('/notifies/details', {notification});
          }}
          subHeaderComponent={
            <DataTableFilter
              onFilter={this.doFilter}
              onClear={() => this.setState({ resetPagination: !this.state.resetPagination, filterText: '' })}
              filterText={this.state.filterText}
            />
          } />
        </div>
    </div>)
  }
}

export default withRouter(NotifyPage);
