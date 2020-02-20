import React from 'react';
import './style.less';

export default class BorderedContainer extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className = "BorderedContainer">
                <div style={{display: "flex", flexWrap: "wrap"}}>
                {this.props.children}
                </div>
            </div>
        );
    }
}

