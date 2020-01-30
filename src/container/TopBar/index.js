import React from 'react';
import { fromEvent } from 'rxjs';

import './style.less';

export default class TopBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      opening: false
    }
  }

  componentDidMount() {
    this.setState({
      edditing: false
    });
    // this.clickStream = fromEvent(document, 'click').subscribe((e)=>{
    //     if (!this.contentRef.current.contains(e.target)) {
    //         if (this.state.edditing) this.setState({
    //             edditing: false
    //         });
    //     }
    // });
  }

  componentWillUnmount() {
    // if (this.clickStream) this.clickStream.unsubscribe();
  }

  render() {
    const { opening } = this.state;
    return (
      <React.Fragment>
        <div className="TopBar">
          <div>
            <div className="bell-svg" onClick={() => this.setState({ opening: !opening })}></div>
            {opening && <div className="drop-down-noti">

            </div>}
          </div>
          <div className="user-profile-svg"></div>
        </div>
        <hr />
      </React.Fragment>
    );
  }
}
