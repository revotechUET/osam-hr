import React from 'react';
import ResizableTable from './../ResizableTable';
import {DelayInput} from 'react-delay-input';

import './style.less';

/*
    props.items: required. list item
    props.displayFields: required. list of field u want to render from item
        displayFields[n]: - header: what we want to show in header (string) (required)
                          - field: name of field we need to extract from item (required)
                          - width: width init of column, all in displayFields need to be add up to 1 (required)
                          - valueFnMap: a function(item[field]) return value you want to map to (optional)
                          - sortMethod(x,y): return number. decide what should we do when we try to sort (optional) we will use a native sort when this is null
    props.cellRender: optional. a component receive value in cell then render it
    props.headerCellRender: optional. a component receive header value then render it
    props.onHeaderClick(e): optional. emit when header get clicked
    props.onRowClick(e): option. emit when row get clicked
    props.isSelected(item): optional. function. return true if this element is selected
*/

export default class PaginationTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemPerPage: 5,
            currentPage: 1,
            searchText: "",
            sortMap: {}
        };
    }

    componentDidMount() {
        this.setState({
            itemPerPage: 5,
            currentPage: 1,
            searchText: "",
            sortMap: {}
        });
    }

    stringifyObject(object) {
        return Object.values(object).join(";").toLowerCase();
    }

    filterBySearchBar(items) {
        return items.filter((e)=>this.stringifyObject(e).includes(this.state.searchText.toLowerCase()));
    }

    filterByPage(items) {
        //recount to make sure current page is valid
        return items.filter((e, idx)=> (idx >= this.state.itemPerPage*(this.state.currentPage-1) && idx < this.state.itemPerPage*(this.state.currentPage)));
    }

    nextPage() {
        if ((this.state.currentPage)*this.state.itemPerPage + 1 > this.props.items.length) return;
        this.setState({
            currentPage: this.state.currentPage + 1
        });
    }

    prevPage() {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            });
        }
    }

    onHeaderClick(e) {
        //console.log(e);
        //check in sort map
        let sort = this.state.sortMap[e.field] || 0;

        //change sort state
        if (sort == 0) sort = 1;
        else if (sort == 1) sort = 2;
        else if (sort == 2) sort = 1;
        
        this.setState((state)=>{
            state.sortMap[e.field] = sort;
            let keys = Object.keys(state.sortMap);
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] == e.field) {
                    //do nothing
                } else {
                    state.sortMap[keys[i]] = 0;
                }
            }
            return {
                sortMap: state.sortMap
            }
        });
    }

    nativeSort(x, y) {
        //my native sort based on string comparing
        return ((x || "").toString()).localeCompare((y || "").toString());
    }

    sortByHeader(items) {
        // return (x)
        let isSomethingNeedToSort = false;
        let whatNeedSort = null;
        let keys = Object.keys(this.state.sortMap);
        for (let i = 0; i < keys.length; i++) {
            if (this.state.sortMap[keys[i]] > 0) {
                isSomethingNeedToSort = this.state.sortMap[keys[i]];
                whatNeedSort = keys[i];
            }
        }
        if (isSomethingNeedToSort) {
            let direction = isSomethingNeedToSort == 1 ? 1 : -1;
            let index = this.props.displayFields.findIndex(e=>e.field.toString() === whatNeedSort.toString());
            let sortMethod = index >= 0 ? (this.props.displayFields[index].sortMethod || this.nativeSort) : this.nativeSort;
            return items.sort((x,y)=>direction*(sortMethod(x[whatNeedSort],y[whatNeedSort])));
        }
        return items;
    }

    render() {
        let cloneProps = Object.assign({}, this.props);
        cloneProps.items = this.filterByPage(this.sortByHeader(this.filterBySearchBar(cloneProps.items.map((e, idx)=>Object.assign(e, {listIndex: idx})))));
        return (
            <div className="PaginationTable" style={{ width: "100%" }}>
                <div className="tool-bar">
                    <div className = "tool-bar-item">
                        <DelayInput delayTimeout = {300} onChange={e=>{this.setState({searchText: e.target.value, currentPage: 1});}} value={this.state.searchText} />
                    </div>
                    <div className = "tool-bar-item" style={{display: "flex"}}>
                        <div>Item per page: </div>
                        <select onChange={(e)=>this.setState({itemPerPage: e.target.value, currentPage: 1})} value={this.state.itemPerPage}>
                            {
                                pagingOptions.map((e,idx)=><option key={idx} value={e.value}>{e.display}</option>)
                            }
                        </select>
                    </div>
                    <button className = "tool-bar-item" onClick={()=>{this.prevPage();}}>
                        Pre
                    </button>
                    <button className = "tool-bar-item" onClick={()=>{this.nextPage();}}>
                        Next
                    </button>
                    <div className="page-counter tool-bar-item-last">
                        {this.state.currentPage}/{Math.ceil(this.props.items.length/(this.state.itemPerPage))}
                    </div>
                </div>
                <ResizableTable {...cloneProps} onHeaderClick={(e)=>this.onHeaderClick(e)}/>
            </div>
        )
    }
}

let pagingOptions = [
    {
        value: 5,
        display: "5"
    },
    {
        value: 10,
        display: "10"
    },
    {
        value: 15,
        display: "15"
    },
    {
        value: 20,
        display: "20"
    },
    {
        value: 30,
        display: "30"
    }
]