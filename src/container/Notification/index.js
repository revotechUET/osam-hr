import React from 'react';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/Loading';
import DataTable from 'react-data-table-component';
import { DataTableFilter } from '../../components/DataTableFilter';
import DateRangePicker from '../../components/DateRangePicker';
import Autocomplete from '../../components/Autocomplete';
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
    selector: notification => ( isNaN(Date.parse(notification.date))? '<Not set>' : new Date(notification.date).toLocaleString() ),
    sortable: true
  },
  {
    name: 'Tổng số người nhận',
    selector: notification => {
      let receipient = JSON.parse(notification.receipient);
      return receipient.selected.length + ' ' + receipient.type
    },
    sortable: true
  },
  {
    name: 'Trạng thái',
    selector: "status",
    sortable: true
  },
  {
    name: 'Ngày gửi',
    selector: notification => ( isNaN(Date.parse(notification.sendDate))? '<Not set>' : new Date(notification.sendDate).toLocaleString() ),
    sortable: true
  }
];
const notifications = []
class NotifyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: notifications,
      loading: false,
      filterText: "",
      statusFilter: [],
      resetPagination: false,
      createdDayFilter: {
        start: new Date(2000,0,0),
        end: new Date(2099,0,0)
      },
      active: false,
      propName: 'date'
    }
  }

  doFilter = (e) => {
    const filterText = e.target.value;
    //console.log(filterText, this.state.data, this.state.filteredData);
    this.setState({
      filterText,
      // filteredData: this.state.data.filter(d => d.title.toLowerCase().includes(filterText.toLowerCase()))
    });
  }


  filter(data) {
    let newData = data.filter(d => d.title.toLowerCase().includes(this.state.filterText.toLowerCase()))
    .filter((d)=>{
      return this.state.statusFilter.length ? this.state.statusFilter.includes(d.status) : true
    });
    if (this.state.active) {
      let propName = this.state.propName;
      return newData.filter((d)=>{
        let date = new Date(d[propName]);
        return (date < new Date(this.state.createdDayFilter.end)) && (date > new Date(this.state.createdDayFilter.start));
      });
    }

    return newData;
  }

  doGet() {
    //this.setState({loading: true});
    apiService.getNotifications().then(notifications => {
      this.setState({
        data: notifications,
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
    const { data, loading } = this.state;
    let filteredData = this.filter(data);
    return (<div className = "NotiPage">
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-plus" onClick={()=>this.props.history.push("/notifies/new")}></div>
        <div className="title">Thông báo</div>
      </div>
      <div style={{ marginTop: "40px", borderRadius: "10px", padding: "10px 20px", background: "#fff" }}>
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
            <div style={{display: "flex"}}>
              <DateRangePicker value = {this.state.createdDayFilter} active = {this.state.active} style={{marginRight: "20px"}} onChange={(e, active) => {
                 this.setState({
                    createdDayFilter: e,
                    active: active
                 });
              }}/>
              <div style={{marginRight: "20px"}}>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  options={statusOptions}
                  value={statusOptions.filter(d => this.state.statusFilter.includes(d.value))}
                  keyProp="value"
                  label="Trạng thái"
                  labelProp="name"
                  onChange={(e, values) => {
                    this.setState({
                      statusFilter: values.map(v => v.value)
                    })
                  }}
                />
              </div>

              <DataTableFilter
                onFilter={this.doFilter}
                onClear={() => this.setState({ resetPagination: !this.state.resetPagination, filterText: '' })}
                filterText={this.state.filterText}
              />
            </div>
          } />
        </div>
    </div>)
  }
}

let statusOptions = [
  {
    name: "Nháp",
    value: 'draft'
  },
  {
    name: 'Đã gửi',
    value: 'sent'
  },
  {
    name: 'Chờ gửi',
    value: 'pending'
  }
]

export default withRouter(NotifyPage);
