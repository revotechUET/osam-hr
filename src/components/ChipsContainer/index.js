import React from 'react';
import './style.less';
import Chip from './Chip';

export default function ChipsContainer() {
    return (
        <div className = "ChipsContainer">
            <Chip content={"Hello"}/>
            <Chip content={"Hello"}/>
            <Chip content={"Hello"}/>
            <Chip content={"Hello"}/>
            <Chip content={"Hello"}/>
        </div>
    );
}