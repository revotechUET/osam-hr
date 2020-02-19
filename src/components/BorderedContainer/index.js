import React from 'react';
import './style.less';

export default class BorderedContainer extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className = "BorderedContainer">
                <div style={{margin: "15px"}}>
                {this.props.children}
                </div>
            </div>
        );
    }
}

