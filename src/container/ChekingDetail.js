import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BorderedContainer from '../components/BorderedContainer';
import Confirm from '../components/Confirm';
import Loading from '../components/Loading';
import apiService from '../service/api.service';
import { dateFormat } from '../utils/date';
import { leaveReason, leaveStatus } from '../utils/enums';


export default function CheckingDetailPage({ history }) {
  const { id } = useParams();
  const cancellable = apiService.useCancellable();
  const { enqueueSnackbar } = useSnackbar();
  const [leave, setLeave] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const leave = await cancellable(apiService.leaveDetail({ id }));
      setLeave(leave);
      setLoading(false);
    })()
  }, [id]);
  const approve = async (approved = true) => {
    const status = approved ? 'approved' : 'rejected';
    const ok = await apiService.leaveApprove({ id, status });
    if (ok) {
      enqueueSnackbar(leaveStatus[status], { variant: 'success' });
      history.goBack();
    } else {
      enqueueSnackbar('Không thành công', { variant: 'error' });
    }
  }
  if (loading) return <Loading />;
  return (
    <div>
       <div className="title-vs-btn">
        <Link className="my-button active-btn ti ti-pencil" to={`/leaves/${id}/edit`}></Link>
        <Confirm buttonProps={{ className: "my-button ti ti-close", style:{background: "#ddd", boxShadow: "none", color: "#888"} }} onOk={() => approve(false)}  title="Từ chối yêu cầu nghỉ?" />
        <Confirm buttonProps={{ className: "my-button active-btn ti ti-check", style:{background: "linear-gradient(120deg, #67dc2c, #38c53e)"} }} onOk={() => approve()} title="Phê duyệt yêu cầu nghỉ?" />
        <div className="title">Yêu cầu nghỉ / <span className="uppercase">{id}</span></div>
      </div>
      <BorderedContainer>
        <div className="info-container">
          <div className="info-row">
            <div className="field">Nhân viên</div>
            <div className="field">{leave.requester.name}</div>
          </div>
          <div className="info-row">
            <div className="field">Trạng thái yêu cầu</div>
            <div className="field">{leaveStatus[leave.status]}</div>
          </div>
          <div className="info-row">
            <div className="field">Lý do nghỉ</div>
            <div className="field">{leaveReason[leave.reason]}</div>
          </div>
          <div className="info-row">
            <div className="field">Thời gian bắt đầu</div>
            <div className="field">{dateFormat(leave.startTime, 'dd/MM/yyyy hh:mm')}</div>
          </div>
          <div className="info-row">
            <div className="field">Thời gian kết thúc</div>
            <div className="field">{dateFormat(leave.endTime, 'dd/MM/yyyy hh:mm')}</div>
          </div>
          <div className="info-row">
            <div className="field">Mô tả</div>
            <div className="field">{leave.description}</div>
          </div>
        </div>
      </BorderedContainer>
    </div>
  )
}
