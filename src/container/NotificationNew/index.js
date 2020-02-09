import React from "react";
import { withRouter } from "react-router-dom";
import BorderedContainer from "./../../components/BorderedContainer";
import BorderBottomInput from "./../../components/BorderBottomInput";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import './style.less'

class StaffCheckingNewPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className = "StaffNew">
        <h1 style={{ marginBottom: "10px" }}>Thông báo / Mới</h1>
        <div style={{ display: "flex" }}>
          <div className="my-button active-btn">Lưu</div>
          <div className="my-button">Hủy</div>
        </div>
        <BorderedContainer>
          <h3>Mới</h3>
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
            <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
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
                />
        </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(StaffCheckingNewPage);
