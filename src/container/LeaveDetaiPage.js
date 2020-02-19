import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import apiService from '../service/api.service';
import BorderedContainer from '../components/BorderedContainer';
import { leaveStatus, leaveReason } from '../utils/enums';
import { dateFormat } from '../utils/date';
import Confirm from '../components/Confirm';

export default function LeaveDetailPage({ history }) {
  const { id } = useParams();
  const cancellable = apiService.useCancellable();
  const [leave, setLeave] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const leave = await cancellable(apiService.leaveDetail({ id }));
      setLeave(leave);
      setLoading(false);
    })()
  }, [id]);
  if (loading) return <Loading />;
  return (
    <div>
      <h1 style={{ marginBottom: "10px" }}>Yêu cầu nghỉ / <span className="uppercase">{id}</span></h1>
      <div style={{ display: "flex" }}>
        <Link className="my-button active-btn" to={`/leaves/${id}/edit`}>Sửa</Link>
        <div className="my-button">Từ chối</div>
        <div className="my-button active-btn">Phê duyệt</div>
      </div>
      <BorderedContainer>
        <h3 className="uppercase">{id}</h3>
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
