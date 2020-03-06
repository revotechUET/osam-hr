import React from 'react';
import { withRouter } from 'react-router-dom';
import apiService from '../service/api.service';
import BorderedContainer from '../components/BorderedContainer';
import Loading from '../components/Loading';
import CenteredModal from '../components/CenteredModal';
import { dateFormat } from '../utils/date'



class CheckingDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            checkDetail: null,
            modalActive : false,
            responseContent : ''
        }
        this.edit = this.edit.bind(this);
        this.response = this.response.bind(this);
        this.goBack = this.goBack.bind(this);
        this.saveResponseContent = this.saveResponseContent.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        let checks = await apiService.checkingDetail({});
        checks.forEach((value, index) => {
            if (value['id'] === id) {
                this.setState({ checkDetail: value });
            }
        });
        this.setState({ loading: false });
    }

    goBack() {
        this.props.history.goBack();
    };

    async saveResponseContent() {
        this.setState({loading : true});
        let id = this.props.match.params.id;
        await apiService.checkingResponse(id, this.state.responseContent);
        this.setState({loading : false});
        this.goBack();
      }

    edit() {
        let id = this.props.match.params.id;
        this.props.history.push(`/checking/${id}/edit`);
    }

    response(evt){
        this.setState({responseContent : evt.target.value});
    }

    render() {
        if (this.state.loading) {
            return (<Loading />)
        }
        return (
            <div className="StaffDetail">
                <div className="title-vs-btn">
                    <div className="my-button active-btn ti ti-pencil" onClick={this.edit}></div>
                    <div className="my-button active-btn ti ti-back-right" style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }} onClick={() => this.setState({modalActive : true})}></div>
                    <div className="title">Chấm công / <span className="uppercase">{dateFormat(this.state.checkDetail.date, 'dd/MM/yyyy')}</span></div>
                </div>

                <BorderedContainer>
                    <div className="item-detail">
                        <div className="infor-item-detail">
                            <span>Nhân viên</span>
                            <div style={{ fontWeight: "bold", fontSize: "150%", marginBottom: "20px" }}>{this.state.checkDetail.requester.name}</div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Ngày</div>
                                    <div style={{ flex: 1 }}>{dateFormat(this.state.checkDetail.date, 'dd/MM/yyyy')}</div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Check in</div>
                                    <div style={{ flex: 1 }}>{dateFormat(this.state.checkDetail.checkinTime, 'hh:mm')}</div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Check out</div>
                                    <div style={{ flex: 1 }}>{dateFormat(this.state.checkDetail.checkoutTime, 'hh:mm')}</div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Ghi chú</div>
                                    <div style={{ flex: 1 }}>{this.state.checkDetail.note}</div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Báo cáo</div>
                                    <div style={{ flex: 1 }}>{this.state.checkDetail.reportContent}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BorderedContainer>

                <CenteredModal active={this.state.modalActive} onCancel={ this.goBack}>
                    <div className="contract-svg"></div>
                    <div className="content-modal">
                        <div style={{ display: "flex", marginBottom: "20px" }}>
                            <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Phản hồi báo cáo</div>
                        </div>
                        <input type="text" value = {this.state.responseContent} onChange = {this.response}></input>
                        <div className="footer">
                            <div className="my-button-cancel" onClick={this.goBack}>Hủy</div>
                            <div className="my-button-ok" onClick={this.saveResponseContent}>Lưu</div>
                        </div>
                    </div>
                </CenteredModal>
            </div>
        );
    }
}


export default withRouter(CheckingDetailPage);
