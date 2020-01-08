import React from 'react';
require('./style.less');
import { withRouter } from 'react-router-dom';

class PrivatePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>I'm a private route</h1>
            </div>
        );
    }
}

export default withRouter(PrivatePage);
