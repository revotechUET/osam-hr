import React from 'react';
import {withRouter} from 'react-router-dom';
import DataTable from 'react-data-table-component';
import apiService from '../../service/api.service';
import './style.less';

const columns = [
    {
      name: 'Ngày',
      selector: 'date',
      sortable: true
    },
    {
      name: 'Nhân viên',
      selector: 'name',
      sortable: true
    },
    {
        name: 'Giờ check in',
        selector: 'checkinTime',
        sortable: true
    },
    {
        name: 'Giờ check out',
        selector: 'checkoutTime',
        sortable: true
    },
    {
        name: 'Tổng công',
        selector: 'sum',
        sortable: true
    },
    {
        name: 'Ghi chú',
        selector: 'note',
        sortable: true
    },
  ];
class StaffChecking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staffChecking : []
        }
    }

    async componentDidMount(){
        let check = await apiService.listChecking();
        this.setState({staffChecking : check})
    }
    render() {
        let { staffChecking } = this.state;
        return (<div >
            <h1 style={{marginBottom: "10px"}}>Chấm công</h1>
            <button className="my-button active-btn" onClick={()=>this.props.history.push("/checking/new")}>Tạo mới</button>
            <DataTable
            noHeader
            noDataComponent='...'
            columns={columns}
            data={staffChecking}
      />
        </div>)
    }
}

export default withRouter(StaffChecking);