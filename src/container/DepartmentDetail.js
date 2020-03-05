import React from 'react';
import { withRouter } from 'react-router-dom';
import {withSnackbar} from 'notistack';
import apiService from '../service/api.service';
import Loading from '../components/Loading';

import BorderedContainer from '../components/BorderedContainer';
import DataTable from 'react-data-table-component';
import ConfirmDialog from "../dialogs/ConfirmDialog";

import { Checkbox } from '@material-ui/core';


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
            departmentDetail: {},
            manager: {},
            approvers: [],
            staff    : []
        }
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    async componentDidMount() {
        this.setState({loading: true});
        try {
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
                }
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
        } catch (e) {
            this.props.enqueueSnackbar(e.message, {variant: "error"});
        } finally {
            this.setState({ loading: false });
        }
    }
    confirmIt(message) {
      return new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
        this.setState({
          confirmMessage: message,
          confirmActive: true
        });
      })
    }
    edit() {
        let departmentId = this.props.match.params.id;
        this.props.history.push({
            pathname : `/departments/${departmentId}/edit`,
            state: {department: this.state.departmentDetail}
        });
    }

    delete() {
        this.setState({loading : true});
        apiService.deleteDepartment(this.state.departmentDetail.id, this.state.departmentDetail.idGroup).then((res) => {
            this.setState({loading : false});
            this.props.enqueueSnackbar("Xóa bộ phận thành công",{variant : 'success'});
            this.props.history.push('/departments');
        }).catch(e => {
            this.setState({loading : false});
            this.props.enqueueSnackbar(e.message,{variant : 'error'});
        });
    }

    goBack(){
        this.props.history.push('/departments');
    }
    render() {
        if (this.state.loading){
            return (
                <Loading />
            )
        }
        return (
            <div className="StaffDetail">
                <div className="title-vs-btn">
                    <div className="my-button ti ti-arrow-left" onClick={this.goBack}  style={{background: "transparent", boxShadow: "none", color: "#888", fontSize: "20px"}}></div>
                    <div className="my-button active-btn ti ti-pencil" onClick={this.edit}></div>
              <div className="my-button ti ti-trash" style={{ background: "#ddd", boxShadow: "none", color: "#888" }} onClick={() => {
                this.confirmIt(`Các nhân viên sẽ được xóa khỏi bộ phận này. Xác nhận xóa bộ phận ${this.state.departmentDetail.name}`).then(() => this.delete()).catch(e => { });
              }}></div>

                    <div className="title">Bộ phận / <span>{(this.state.departmentDetail||{}).name || "No name"}</span></div>
                </div>
                <BorderedContainer>
                <div className="item-detail" style={{ width: "100%", marginBottom: "40px" }}>
                  <div className="infor-item-detail">
                    <span>Người quản lý</span>
                    <div style={{fontWeight: "bold", fontSize: "150%", marginBottom: "20px"}}>{(this.state.manager||{}).name || "empty"}</div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                      <div style={{display: "flex"}}>
                          <div style={{flexBasis: "150px", fontWeight: "bold"}}>Người duyệt y/c nghỉ</div>
                          <div style={{flex: 1}}>{(this.state.approvers || []).map((e) => e).join(", ")}</div>
                      </div>
                      <div style={{display: "flex", alignItems: 'center'}}>
                          <div style={{flexBasis: "150px", fontWeight: "bold"}}>Hoạt động</div>
                          <div style={{ flex: 1 }}>
                            <Checkbox name="contractLunch" defaultChecked={this.state.departmentDetail.active} readOnly disabled />
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                    <div className="item-detail" style={{ flex: 1 }}>
                        <div className="infor-item-detail">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ marginBottom: "10px" }}>
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
                <ConfirmDialog active={this.state.confirmActive} message={this.state.confirmMessage} onClose={(res) => {
                  this.setState({ confirmActive: false });
                  if (res) this._resolve()
                  else this._reject();
                }} />
            </div>
        );
    }
}


export default withSnackbar(withRouter(DepartmentDetailPage));
