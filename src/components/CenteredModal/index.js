import React from "react";
import "./style.less";
import Draggable from "react-draggable";

export default class CenteredModal extends React.Component {
  constructor(props) {
    super(props);
    this.contentRef = React.createRef();
  }

  onBackGroundClick(e) {
    if (this.contentRef.current.contains(e.target)) {
      //donothing
    } else {
      this.props.onCancel();
    }
  }

  render() {
    return (
      <div className="CenteredModal">
        <div
          style={{ display: this.props.active ? "flex" : "none" }}
          className="modal-background"
          onClick={e => {
            this.onBackGroundClick(e);
          }}
        >
          <div ref={this.contentRef} className="modal-center">
            <div className="modal-layer">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
