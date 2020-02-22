import React from 'react';
import { withRouter } from 'react-router-dom';
import apiService from '../service/api.service';
import Loading from '../components/Loading';
import { dateFormat } from '../utils/date';
import BorderedContainer from '../components/BorderedContainer';


class DepartmentDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            departmentDetail: null,
            manager : null,
            approvers : null
        }
        this.edit = this.edit.bind(this);
        this.response = this.response.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        let departmentDetail = await apiService.departmentDetail({});
        let users = await apiService.listUsers();
        departmentDetail.forEach((value, index) => {
            if (value['id'] === id) {
                this.setState({ departmentDetail: value });
            }
        });
        let manager = users.filter((u) => u.id === this.state.departmentDetail.idManager);
        // let approvers = users.filter((u) => this.state.departmentDetail.idApproversu.id);
        console.log( this.state.departmentDetail.idApprovers.include("113258463329157762545"));
        this.setState({ loading: false, manager : manager});
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
                    {/* <div className="image-reject"></div> */}
                    {/* <div className="image-accept"></div> */}
                    <div className="infor-item-detail">
                        <span>Người quản lý</span>
                        <div style={{ fontWeight: "bold", fontSize: "150%", marginBottom: "20px" }}>{this.state.manager[0].name}</div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", marginBottom: "10px" }}>
                                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Người phụ trách duyệt</div>
                                {/* <div style={{ flex: 1 }}>{this.state.manager.idApprovers}</div> */}
                            </div>
                            <div style={{ display: "flex", marginBottom: "10px" }}>
                                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Hoạt động</div>
                                {/* <div style={{ flex: 1 }}>{dateFormat(this.state.checkDetail.checkinTime, 'hh:mm')}</div> */}
                            </div>
                            <div style={{ display: "flex", marginBottom: "10px" }}>
                                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Danh sách nhân viên</div>
                                {/* <div style={{ flex: 1 }}>{dateFormat(this.state.checkDetail.checkoutTime, 'hh:mm')}</div> */}
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