import React from 'react';
import PaginationTable from './../PaginationTable';
import './style.less';


export default function StyledPaginationTable({ items, displays }) {
    return <PaginationTable items={items} displayFields={displays}
        headerCellRender={HeaderCellRender} cellRender={CellRender} />
}


function CellRender(props) {
    return <div style={{ border: "black solid 1px", height: "30px" }} onClick={(e) => { console.log(props); }}>
        {props.value}
    </div>
}

function HeaderCellRender(props) {
    return <div style={{ border: "blue solid 1px", height: "30px" }}>
        <div onClick={props.onClick} style={{
            position: "relative", top: "50%", left: "50%", float: "left",
            transform: "translate(-50%, -50%)", userSelect: "none", cursor: "pointer",
            overflow: "hidden", whiteSpace: "nowrap"
        }}>
            {props.value}
        </div>
    </div>
}

function ResizerRender(props) {
    return <div className={props.isResizing ? "my-resizer my-resizing" : "my-resizer"}>

    </div>
}

var exs = [
    {
        username: 'Pham thi nguyen',
        age: 19,
        birthday: "12/11/2000",
        jobtype: "Developer"
    },
    {
        username: 'Phan Phuong Nam',
        age: 20,
        birthday: "20/1/2000",
        jobtype: "Developer"
    },
    {
        username: 'Pham Quoc Hoan',
        age: 17,
        birthday: "16/6/2000",
        jobtype: "Developer"
    },
    {
        username: 'Dinh thi Huyen',
        age: 33,
        birthday: "8/11/2000",
        jobtype: "Developer"
    },
    {
        username: 'Pham Nhu Quynh',
        age: 12,
        birthday: "20/3/2000",
        jobtype: "Developer"
    },
    {
        username: 'Tran Manh Tuong',
        age: 13,
        birthday: "22/9/2000",
        jobtype: "Developer"
    },
    {
        username: 'Nguyen Van Tien',
        age: 16,
        birthday: "6/12/2000",
        jobtype: "Developer"
    },
    {
        username: 'Thanh Thao',
        age: 16,
        birthday: "4/3/2000",
        jobtype: "Developer"
    },
    {
        username: 'Hoang Quoc Viet',
        age: 17,
        birthday: "28/2/2000",
        jobtype: "Developer"
    },
    {
        username: 'Ngoc',
        age: 12,
        birthday: "7/11/2000",
        jobtype: "Developer"
    },
    {
        username: 'Liem',
        age: 13,
        birthday: "8/11/2000",
        jobtype: "Developer"
    },
    {
        username: 'The Anh',
        age: 18,
        birthday: "29/8/2000",
        jobtype: "Developer"
    },
    {
        username: 'Minh Hung',
        age: 22,
        birthday: "30/4/2000",
        jobtype: "Developer"
    },
    {
        username: 'Viet Hung',
        age: 28,
        birthday: "2/3/2000",
        jobtype: "Developer"
    },
    {
        username: 'Hoang Pro',
        age: 25,
        birthday: "12/3/2000",
        jobtype: "Developer"
    },
    {
        username: 'Hoang Xuan Tung',
        age: 40,
        birthday: "7/10/2000",
        jobtype: "Developer"
    }
];