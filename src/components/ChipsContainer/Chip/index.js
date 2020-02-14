import React from 'react';
import './style.less';

export default function Chip(props) {
    return (
        <div className = "Chip">
            <div className = "content">{props.content}</div>
            <div className="cancel-svg" onClick = {()=>{onClick(props.item)}}></div>
        </div>
    );
}