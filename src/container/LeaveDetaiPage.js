import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BorderedContainer from '../components/BorderedContainer';
import Confirm from '../components/Confirm';
import Loading from '../components/Loading';
import apiService from '../service/api.service';
import { dateFormat } from '../utils/date';
import { leaveReason, leaveStatus } from '../utils/enums';
import PromptDialog from '../dialogs/PromptDialog';

export default function LeaveDetailPage({ history }) {
  const { id } = useParams();
  const cancellable = apiService.useCancellable();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [leave, setLeave] = useState({ "requester": { "role": "admin", "idContract": "k71qps8l", "name": "Quang", "active": true, "id": "111348398142083650098", "email": "quangln@rvtcompany.page" }, "reason": 0, "description": "Corona", "startTime": "2020-02-13T14:58:58.630Z", "idApprover": "111348398142083650098", "id": "lr-k76b146p", "endTime": "2020-02-14T14:59:01.759Z", "idRequester": "111348398142083650098", "status": "approved" });
  const [loading, setLoading] = useState(true);
  const [promptActive, setPromptActive] = useState();
  const [resolveFn, setResolveFn] = useState();
  const [rejectFn, setRejectFn] = useState();
  useEffect(() => {
    (async () => {
      const leave = await cancellable(apiService.leaveDetail({ id }));
      setLeave(leave);
      setLoading(false);
    })()
  }, [id]);
  const promptIt = () => {
    console.log("prompt");
    return new Promise((resolve, reject) => {
      setPromptActive(true);
      setTimeout(() => {

        console.log("prompt tiep", promptActive);
      }, 1000);
      setResolveFn(() => resolve);
      setRejectFn(() => reject);
    });
  }
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

  const deleteFn = (reason) => {
    const status = 'deleted';
    setLoading(true);
    let key = enqueueSnackbar('Huỷ yêu cầu nghỉ', { variant: "info" });
    const ok = apiService.leaveDelete({ id, status: "deleted", deletedReason: reason }).then(ok => {
      setLoading(false);
      closeSnackbar(key);
      if (ok) {
        enqueueSnackbar(leaveStatus[status], { variant: 'success' });
        setLeave({ ...leave, status, reason });
      } else {
        enqueueSnackbar('Không thành công', { variant: 'error' });
      }
    }).catch(e => {
      setLoading(false);
      closeSnackbar(key);
      console.error(e);
      enqueueSnackbar(e.message, { variant: 'error' });
    });

  }
  //if (loading) return <Loading />;
  return (
    <div>
      <div className="title-vs-btn">
        <Link className="my-button active-btn ti ti-arrow-left" style={{ background: 'transparent', boxShadow: 'none', color: 'rgb(136, 136, 136)', fontSize: 20 }} to={"/leaves"} title="Quay lại"></Link>
        <Link className="my-button active-btn ti ti-pencil" to={`/leaves/${id}/edit`} title="Sửa"></Link>
        <Confirm buttonProps={{ className: "my-button ti ti-close", style: { background: "#ddd", boxShadow: "none", color: "#888" }, title: "Từ chối" }} onOk={() => approve(false)} title="Từ chối yêu cầu nghỉ?" />
        <Confirm buttonProps={{ className: "my-button active-btn ti ti-check", style: { background: "linear-gradient(120deg, #67dc2c, #38c53e)" }, title: "Phê duyệt" }} onOk={() => approve()} title="Phê duyệt yêu cầu nghỉ?" />
        {(leave.status === "approved") ? (<div className="my-button active-btn ti ti-trash" title="Huỷ" onClick={() => {
          promptIt()
            .then(reason => {
              deleteFn(reason);
            })
            .catch(e => { });
        }} ></div>) : (<></>)}

        <div className="title">Yêu cầu nghỉ / <span className="uppercase">{id}</span></div>
      </div>
      <BorderedContainer>
        <div className="item-detail" style={{ color: "#fff", background: leave.status === 'rejected' ? 'linear-gradient(120deg, #FFC107, #FF9800)' : 'linear-gradient(120deg, rgb(154, 226, 118), rgb(69, 234, 76))' }}>
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
      <PromptDialog active={promptActive} label="Lý do nghỉ" onClose={(reason, isCancel) => {
        setPromptActive(false);
        if (isCancel) rejectFn();
        else resolveFn(reason);
      }} />
    </div>
  )
}
