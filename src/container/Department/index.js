import React from 'react';
import { withRouter } from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';
import DataTable from 'react-data-table-component';
import apiService from '../../service/api.service';
import './style.less';


const columns = [
    {
        name: "STT",
        selector: "STT",
        sortable: true
    },
    {
        name: "Tên Bộ Phân",
        selector: "name",
        sortable: true
    },
    {
        name: "Người Quản Lý",
        selector: "idManager",
        sortable: true
    },
    {
        name: "Người duyệt leave request",
        selector: "idApprovers"
    }

];
class DepartmentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [
            ]
        }
    }

async componentDidMount(){
    let departments = await apiService.listDepartment();
    console.log(departments);
    this.setState({data : departments});
}

    render() {
        const { data } = this.state;
        return (<div >
            <div className="title-vs-btn">
                <div className="my-button active-btn ti ti-plus" onClick={() => this.props.history.push("/departments/new")}></div>
                <div className="title">Bộ phận</div>
            </div>
            <DataTable style={{marginTop: "40px", borderRadius: "20px"}}
                noHeader
                noDataComponent='Không có bộ phận'
                columns={columns}
                data={data}
            />
        </div>)
    }
}

export default withRouter(DepartmentPage);