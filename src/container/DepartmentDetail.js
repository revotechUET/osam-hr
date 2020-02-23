import React from 'react';
import { withRouter } from 'react-router-dom';
import apiService from '../service/api.service';
import Loading from '../components/Loading';
import { dateFormat } from '../utils/date';
import BorderedContainer from '../components/BorderedContainer';
import DataTable from 'react-data-table-component';


const displays = [
    {
        name: 'Tên Nhân viên',
        selector: 'name',
        sortable: true
    },
    {
        name: 'Email',
        selector: 'email',
        sortable: true
    },
    {
        name: "Kiểu hợp đồng",
        selector: 'contract.name',
        sortable: true,
    }
];
class DepartmentDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            departmentDetail: null,
            manager: null,
            approvers: [],
            staff    : []
        }
        this.edit = this.edit.bind(this);
        this.response = this.response.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        let departmentDetail = await apiService.departmentDetail({});
        let users = await apiService.listUsers({full : true});
        departmentDetail.forEach((value, index) => {
            if (value['id'] === id) {
                this.setState({ departmentDetail: value });
            }
        });
        users.forEach((value, index) => {
            if (value.id.includes(this.state.departmentDetail.idManager)) {
                this.setState({ manager: value })
            };
            value.departments.forEach((val, indx) => {
                if(val.name === this.state.departmentDetail.name){
                    this.state.staff.push(value);
                }
            })
        })
        let idApprovers = this.state.departmentDetail.idApprovers
        users.forEach((value, index) => {
            if (idApprovers.includes(value.id)) {
                this.state.approvers.push(value.name)
            }
        });
        
        console.log(this.state.staff);

        this.setState({ loading: false });
    }

    edit() {
        this.props.history.push('/departments/new');
    }

    response() {
        this.props.history.push('/notifies/new');
    }
    render() {
        if (this.state.loading) {
            return (<Loading />)
        }
        return (
            <div className="StaffDetail">
                <div className="title-vs-btn">
                    <div className="my-button active-btn ti ti-pencil" onClick={this.edit}></div>
                    <div className="my-button active-btn ti ti-check" style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }} onClick={this.response}></div>
                    <div className="title">Bộ phận / <span>{this.state.departmentDetail.name}</span></div>
                </div>
                <BorderedContainer>
                    <div className="item-detail">
                        <div className="infor-item-detail">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Người quản lý</div>
                                    <div style={{ flex: 1 }}>{this.state.manager.name}</div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Người phụ trách duyệt leave request</div>
                                    <div style={{ flex: 1 }}>{(this.state.approvers || []).map((e) => e).join(", ")}</div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Hoạt động</div>
                                    <div style={{ flex: 1}}><input style={{ width : '4%', height:'10px'}} className="input checkbox" type="checkbox" defaultChecked={this.state.departmentDetail.active} /></div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Danh sách nhân viên</div>
                                    <DataTable
                                        noHeader
                                        fixedHeader
                                        fixedHeaderScrollHeight="calc(100vh - 333px)"
                                        persistTableHead
                                        pagination
                                        noDataComponent='Không có nhân viên'
                                        progressPending={this.state.loading}
                                        progressComponent={<Loading />}
                                        columns={displays}
                                        data={this.state.staff}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </BorderedContainer>
            </div>
        );
    }
}


export default withRouter(DepartmentDetailPage);