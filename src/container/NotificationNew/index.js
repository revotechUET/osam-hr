import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";

// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import './style.less'

class NotificationNewPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className = "NotificationNew">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" style={{background: "linear-gradient(120deg, #67dc2c, #38c53e)"}}></div>
          <div className="my-button ti ti-close" style={{background: "#ddd", boxShadow: "none", color: "#888"}}></div>
          <div className="title">Thông báo / Mới</div>
        </div>
        <BorderedContainer>
          <div className="input-field">
            <div className = "label">Kiểu thông báo</div>
            <select className = "input">
                <option value="" selected disabled hidden>Choose here</option>
                <option value="1">Kiểu thông báo 1</option>
                <option value="2">Kiểu thông báo 2</option>
                <option value="3">Kiểu thông báo 3</option>
                <option value="4">Kiểu thông báo 4</option>
            </select>
          </div>
          
          <div className="input-field">
            <div className = "label">Tiêu đề</div>
            <input className = "input"/>
          </div>
          
          <div className="input-field">
            <div className = "label">Người nhận</div>
            <select className = "input">
                <option value="" selected disabled hidden>Choose here</option>
                <option value="1">Người nhận 1</option>
                <option value="2">Người nhận 2</option>
                <option value="3">Người nhận 3</option>
                <option value="4">Người nhận 4</option>
            </select>
          </div>

        <div className = "input-field">
            <div className = "label"> Nội dung</div>
            <div className="input">
              {/* <CKEditor
                      editor={ ClassicEditor }
                      data="<p>Please input notification content</p>"
                      onInit={ editor => {
                          // You can store the "editor" and use when it is needed.
                          console.log( 'Editor is ready to use!', editor );
                      } }
                      onChange={ ( event, editor ) => {
                          const data = editor.getData();
                          console.log( { event, editor, data } );
                      } }
                      onBlur={ ( event, editor ) => {
                          console.log( 'Blur.', editor );
                      } }
                      onFocus={ ( event, editor ) => {
                          console.log( 'Focus.', editor );
                      } }
                  /> */}
            </div>
        </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(NotificationNewPage);
