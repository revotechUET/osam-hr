import React from "react";
import "./style.less";

export default class CenteredModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onBackGroundClick(e) {
    this.props.onCancel();
  }

  render() {
    return (
      <div className="CenteredModal">
        <div style={{ display: this.props.active ? "flex" : "none" }}
          className="modal-background"
        >
          <div style={{ position: 'absolute', top: '-50vh', left: '-50vw', width: '200vh', height: '200vw', }}
            onClick={e => this.onBackGroundClick(e)}
          ></div>
          <div className="modal-center">
            <div className="modal-layer">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
