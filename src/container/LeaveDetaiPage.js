import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BorderedContainer from '../components/BorderedContainer';
import Confirm from '../components/Confirm';
import Loading from '../components/Loading';
import apiService from '../service/api.service';
import { dateFormat } from '../utils/date';
import { leaveReason, leaveStatus } from '../utils/enums';


export default function LeaveDetailPage({ history }) {
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
    setLoading(true);
    const ok = await apiService.leaveApprove({ id, status });
    setLoading(false);
    if (ok) {
      enqueueSnackbar(leaveStatus[status], { variant: 'success' });
      setLeave({ ...leave, status });
    } else {
      enqueueSnackbar('Không thành công', { variant: 'error' });
    }
  }
  if (loading) return <Loading />;
  return (
    <div>
      <div className="title-vs-btn">
        <Link className="my-button active-btn ti ti-arrow-left" to={"/leaves"} title="Sửa"></Link>
        <Link className="my-button active-btn ti ti-pencil" to={`/leaves/${id}/edit`} title="Sửa"></Link>
        <Confirm buttonProps={{ className: "my-button ti ti-close", style: { background: "#ddd", boxShadow: "none", color: "#888" }, title: "Từ chối" }} onOk={() => approve(false)} title="Từ chối yêu cầu nghỉ?" />
        <Confirm buttonProps={{ className: "my-button active-btn ti ti-check", style: { background: "linear-gradient(120deg, #67dc2c, #38c53e)" }, title: "Phê duyệt" }} onOk={() => approve()} title="Phê duyệt yêu cầu nghỉ?" />
        <div className="title">Yêu cầu nghỉ / <span className="uppercase">{id}</span></div>
      </div>
      <BorderedContainer>
        <div className="item-detail" style={{color: "#fff", background: leave.status==='rejected'?'linear-gradient(120deg, #FFC107, #FF9800)': 'linear-gradient(120deg, rgb(154, 226, 118), rgb(69, 234, 76))'}}>
          {
            leave.status === 'rejected'
              ? <div className="image-reject"></div>
              : leave.status === 'approved' ? <div className="image-accept"></div> : null
          }
          <div className="infor-item-detail">
            <span>Nhân viên</span>
            <div style={{ fontWeight: "bold", fontSize: "150%", marginBottom: "20px" }}>{leave.requester.name}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Trạng thái</div>
                <div style={{ flex: 1 }}>{leaveStatus[leave.status]}</div>
              </div>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Lý do nghỉ</div>
                <div style={{ flex: 1 }}>{leaveReason[leave.reason]}</div>
              </div>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thời gian bắt đầu</div>
                <div style={{ flex: 1 }}>{dateFormat(leave.startTime, 'dd/MM/yyyy hh:mm')}</div>
              </div>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Thời gian kết thúc</div>
                <div style={{ flex: 1 }}>{dateFormat(leave.endTime, 'dd/MM/yyyy hh:mm')}</div>
              </div>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Mô tả</div>
                <div style={{ flex: 1 }}>{leave.description}</div>
              </div>
            </div>
          </div>
        </div>
      </BorderedContainer>
    </div>
  )
}
