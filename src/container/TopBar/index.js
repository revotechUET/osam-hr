import React from 'react';

import './style.less';

export default function TopBar(props) {
    return (
        <React.Fragment>
            <div className="TopBar">
                <div className="bell-svg"></div>
                <div className="user-profile-svg"></div>
            </div>
            <hr />
        </React.Fragment>
    );
}