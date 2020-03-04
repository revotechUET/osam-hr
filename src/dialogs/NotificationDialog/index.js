import React from 'react';
import CenteredModal from '../../components/CenteredModal';
import "./style.less";

class NotificationDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <CenteredModal className="NotificationDialog" active={this.props.active} onCancel={() => this.props.onClose() }>
          <div className="contract-svg"></div>
          <div className="content-modal">
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ fontWeight: "bold" }}>Thông báo</div>
            </div>
            <div className="content" dangerouslySetInnerHTML={{__html: this.props.content}}>
            </div>
            <div className="footer">
              <div className={"my-button-ok"} onClick={() => this.props.onClose()}>Đóng</div>
            </div>
          </div>
        </CenteredModal>
    );
  }
}

export default NotificationDialog;
