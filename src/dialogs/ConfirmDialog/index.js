import React from 'react';
import CenteredModal from '../../components/CenteredModal';
import "./style.less";

class ConfirmDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <CenteredModal active={this.props.active} onCancel={() => this.props.onClose(false) }>
          <div className="contract-svg">Xác nhận</div>
          <div className="content-modal">
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ fontWeight: "bold" }}>{this.props.message}</div>
            </div>
            <div className="footer">
              <div className="my-button-cancel" onClick={() => this.props.onClose(false)}>Không đồng ý</div>
              <div className={"my-button-ok"} onClick={() => this.props.onClose(true)}>Đồng ý</div>
            </div>
          </div>
        </CenteredModal>
    );
  }
}

export default ConfirmDialog;
