import React from 'react';
require('./style.less');
import { withRouter } from 'react-router-dom';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <h1>Hello REACT APP</h1>
            </div>
        );
    }
}

export default withRouter(HomePage);
