import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { DraggableCore } from 'react-draggable';

import ReactResizeDetector from 'react-resize-detector';

import './style.less';

/*
    props.items: required. list item
    props.displayFields: required. list of field u want to render from item
        displayFields[n]: - header: what we want to show in header (string) (required)
                          - field: name of field we need to extract from item (required)
                          - width: width init of column, all in displayFields need to be add up to 1 (required)
                          - valueFnMap: a function(item[field]) return value you want to map to (optional)
    props.cellRender: optional. a component receive value in cell then render it
    props.headerCellRender: optional. a component receive header value then render it
    props.onHeaderClick(e): optional. emit when header get clicked
    props.onRowClick(e): optional. emit when row get clicked
    props.isSelected(item): optional. function. return true if this element is selected
*/


export default class ResizableTable extends React.Component {
    constructor(props) {
        super(props);

        this.headerRef = React.createRef();
        this.draggerRef = React.createRef();
        this.headerRefs = [];

        this.handleDrag = this.handleDrag.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);

        this.state = {
            header1: 0.4,
            widths: [],
            isResizing: -1
        };
    }

    componentDidMount() {
        this.setState({
            widths: this.props.displayFields.map(e => e.width)
        });
        this.headerRefs = [];
    }

    handleStart(e, idx) {
        this.setState({
            isResizing: idx
        });
    }

    handleStop(e, idx) {
        //recount everywidth to make sure that minWidth do not effect wrong width percent
        let totalWidth = this.headerRef.current.getBoundingClientRect().width;

        let widthPercentArr = [];

        for (let i = 0; i < this.headerRefs.length; i++) {
            let w = this.headerRefs[i].getBoundingClientRect().width;
            widthPercentArr[i] = w/totalWidth;
        }

        this.setState({
            isResizing: -1,
            widths: widthPercentArr
        });
    }

    handleDrag(e, idx) {
        //check width of header div
        let totalWidth = this.headerRef.current.getBoundingClientRect().width;
        let previousStart = this.headerRef.current.getBoundingClientRect().x;
        
        //checkIfInvalid
        if (e.clientX - 50 < previousStart || e.clientX + 50 > previousStart + totalWidth) return;

        let widthPercent = this.state.widths[idx];
        let widthPerMore = 0;

        //previous:
        for (let i = 0; i < idx; i++) {
            widthPerMore += this.state.widths[i];
        }

        previousStart += (this.headerRef.current.getBoundingClientRect().width) * widthPerMore;

        //count new min width percent
        let positionNow = e.clientX - previousStart;
        let newWidthPercent = positionNow / totalWidth;

        //count scale of these left
        let oldPercentLeft = 1 - widthPercent - widthPerMore;
        let newPercentLeft = 1 - newWidthPercent - widthPerMore;

        let scale = newPercentLeft / oldPercentLeft;

        //recount everything left:
        this.setState((previousState) => {
            previousState.widths[idx] = newWidthPercent;
            //everything > idx must scale
            for (let i = idx + 1; i < previousState.widths.length; i++) {
                previousState.widths[i] = previousState.widths[i] * scale;
            }
            return {
                widths: previousState.widths
            }
        });
    }

    onHeaderClick(e) {
        if (this.props.onHeaderClick) this.props.onHeaderClick(e);
    }

    render() {
        return (
            <div className="ResizableTable">
                <div className="header" ref={this.headerRef}>
                    {
                        this.props.displayFields.map(
                            (e, idx) => {
                                return (
                                    <React.Fragment key={idx}>
                                        <div style={{ width: this.state.widths[idx] * 100 + "%", position:"relative", display: "flex", minWidth: "50px"}} ref = {(ref)=>{this.headerRefs[idx] = ref;}}>
                                            <div style={{width: "100%", height: "100%"}} >
                                                {
                                                    this.props.headerCellRender ? <this.props.headerCellRender onClick={()=>{this.onHeaderClick(e)}} value={e.header} /> : e.header
                                                }
                                            </div>
                                            {idx == this.props.displayFields.length - 1 ? null :
                                                <DraggableCore
                                                    axis="x"
                                                    handle=".dragger"
                                                    onDrag={(e) => this.handleDrag(e, idx)}
                                                    onStart={(e) => this.handleStart(e, idx)}
                                                    onStop={(e) => this.handleStop(e)}
                                                >
                                                    {
                                                        this.props.resizerRender ? 
                                                        <div className = {"dragger"} ref = {this.draggerRef}>
                                                            <this.props.resizerRender isResizing = {this.state.isResizing == idx}/>
                                                        </div>
                                                        :
                                                        <div className={this.state.isResizing==idx ? "dragger resizing" : "dragger"} ref={this.draggerRef} />
                                                    }
                                                </DraggableCore>
                                            }
                                        </div>
                                    </React.Fragment>
                                );
                            }
                        )
                    }
                </div>
                <div className="table-body">
                    {
                        this.props.items.map((e,idx) => 
                            <ResizableRow key={idx} cellRender={this.props.cellRender} onClick = {this.props.onRowClick ? this.props.onRowClick : ()=>{}}
                            value={this.props.items[idx]} fields={this.props.displayFields} widths={this.state.widths} isSelected = {this.props.isSelected}/>
                        )
                    }
                </div>
            </div>
        );
    }
}

ResizableTable.propTypes = {
    items: PropTypes.array.isRequired,
    displayFields: PropTypes.array.isRequired
}

function ResizableRow(props) {
    return (
        <div className={props.isSelected ? (props.isSelected(props.value) ? "rower selected" : "rower") : "rower"} onClick = {()=>{props.onClick(props.value);}}>
            {
                props.fields.map((e,idx) => (
                    <ResizableCell key={idx}  value={e.valueFnMap ? e.valueFnMap(props.value[e.field]) : props.value[e.field]}
                        width={props.widths[idx]} cellRender={props.cellRender} fullValue = {props.value}/>
                ))
            }
        </div>
    );
}

function ResizableCell(props) {
    return (
        <div style={{flexBasis: props.width*100 + "%", overflow: "hidden", whiteSpace: "nowrap", minWidth: "50px"}}>
            {
                props.cellRender ? <props.cellRender value={props.value} fullValue={props.fullValue} /> : props.value
            }
        </div>
    );
}