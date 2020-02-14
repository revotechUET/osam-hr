import React from 'react';
import './style.less';
import Chip from './Chip';

export default function ChipsContainer(props) {
    return (
        <div className = "ChipsContainer">
            {
                props.items.map((e, idx)=>
                    <Chip key={idx} content = {props.getContent(e)} item = {e} onClick={props.onClick  || (()=>{})}/>
                )
            }
        </div>
    );
}