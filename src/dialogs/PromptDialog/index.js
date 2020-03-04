import React from 'react';
import CenteredModal from '../../components/CenteredModal';
import BorderBottomInput from "../../components/BorderBottomInput";
import "./style.less";

class PromptDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.label || "input",
      value: ""
    }
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    console.log(this.props.active);
    return (
        <CenteredModal active={this.props.active} onCancel={() => this.props.onClose(this.state.value, true) }>
          <div className="contract-svg">Nhập</div>
          <div className="content-modal">
            <div style={{ marginBottom: "40px" }}>
              <div style={{ fontWeight: "bold" }}>{this.props.label}</div>
            <BorderBottomInput placeholder="" name="message" value={this.state.value} onChange={(e) => this.handleChange(e)} />
            </div>
            <div className="footer">
              <div className="my-button-cancel" onClick={() => this.props.onClose(this.state.value, true)}>Không đồng ý</div>
              <div className={"my-button-ok"} onClick={() => this.props.onClose(this.state.value, false)}>Đồng ý</div>
            </div>
          </div>
        </CenteredModal>
    );
  }
}

export default PromptDialog;
