import React from 'react';
import { withRouter } from 'react-router-dom';
import apiService from '../service/api.service';
import BorderedContainer from '../components/BorderedContainer';
import Loading from '../components/Loading';
import {dateFormat} from '../utils/date'



class StaffDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            checkDetail: null
        }
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
        console.log(this.state.checkDetail);
    }

    render() {
        if(this.state.loading){
            return ( <Loading />)
        }
        return (
            <div className="StaffDetail">
                <div className="title-vs-btn">
                    <div className="my-button active-btn ti ti-check" style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
                    <div className="my-button ti ti-close" style={{ background: "#ddd", boxShadow: "none", color: "#888" }}></div>
                    <div className="title">Chấm công / <span className="uppercase">{dateFormat(this.state.checkDetail.date, 'dd/MM/yyyy')}</span></div>
                </div>

                <BorderedContainer>
                    <span>Nhân viên</span>
                    <div>{this.state.checkDetail.requester.name}</div>
                    <span>Ngày</span>
                    <div>{dateFormat(this.state.checkDetail.date, 'dd/MM/yyyy')}</div>
                    <span>Check in</span>
                    <div>{dateFormat(this.state.checkDetail.checkinTime, 'hh:mm')}</div>
                    <span>Check out</span>
                    <div>{dateFormat(this.state.checkDetail.checkoutTime, 'hh:mm')}</div>
                    <span>Ghi chú</span>
                    <div>{this.state.checkDetail.note}</div>
                    <span>Báo cáo</span>
                    <div>{this.state.checkDetail.reportContent}</div>
                    
                </BorderedContainer>
            </div>
        );
    }
}


export default withRouter(StaffDetailPage);