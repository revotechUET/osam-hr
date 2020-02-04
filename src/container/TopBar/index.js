import React from 'react';
import { fromEvent } from 'rxjs';
import { withRouter } from 'react-router-dom';

import './style.less';

import userImg from './../../assets/images/17004.svg';

class TopBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      opening: false
    }

    this.contentRef = React.createRef();
    this.bellRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      openning: false
    });
    this.clickStream = fromEvent(document, 'click').subscribe((e)=>{
        if (this.bellRef.current.contains(e.target)) {
          return;
        }
        if (!(this.contentRef).current.contains(e.target)) {
            if (this.state.opening) 
              this.setState({
                  opening: false
              });
        }
    });
  }

  componentWillUnmount() {
    if (this.clickStream) this.clickStream.unsubscribe();
  }

  render() {
    const { opening } = this.state;
    return (
      <React.Fragment>
        <div className="TopBar">
          <div>
            <div ref={this.bellRef} className="bell-svg" onClick={() => this.setState({ opening: !opening })}></div>
            <div ref={this.contentRef}>
            {opening && 
            <div className="drop-down-noti">
              <div>
                <div style={{textAlign: "right"}}>
                  <p style={{marginRight: "10px", fontSize: "65%"}}>Đánh dấu tất cả đã đọc</p>
                </div>
                
              </div>
              <div>
                {/* content for notify */}
                <div style={{display: "flex", padding: "10px", border: "1px solid black"}}>
                  <div className="img-user">
                    
                  </div>
                  <div>
                    Thông báo lịch trực nhật
                    <br />
                    <p style={{fontStyle: "italic", margin: "0px"}}>25/10/2019</p>
                  </div> 
                  
                </div>
              </div>
              <div style={{textAlign: "center", position: "absolute", bottom: "0px", width: "100%", height: "35px"}}>
                <hr style={{margin: "3px"}}/>
                <span className={"see-all"} onClick={()=>{this.setState({opening: false}); this.props.history.push("/my-notifies");}}>Xem tất cả</span>
              </div>
            </div>
            }
            </div>
          </div>
          <div className="user-profile-svg"></div>
        </div>
        <hr />
      </React.Fragment>
    );
  }
}

export default withRouter(TopBar);