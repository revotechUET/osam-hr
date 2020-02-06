import React from 'react';
import './style.less';


export default function BorderBottomInput(props) {
    return (
        <div className = "BorderBottomInput">
            <input className = "input" {...props}/>
        </div>
    );
}