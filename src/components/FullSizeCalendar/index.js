import React from 'react';

import './style.less';

export default class FullSizeCalendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: 0,
            currentYear: 2020
        }
    }

    componentDidMount() {
        //get current month
        let today = new Date();
        this.setState({
            currentMonth: today.getMonth(),
            currentYear: today.getFullYear()
        })
    }

    getArrayOfDaysInMonth() {
        let date = 1;
        let numDayOfMonth = getNumberOfDayInMonth(this.state.currentYear, this.state.currentMonth);
        //count previousMonth
        let previousMonth = this.state.currentMonth - 1;
        let previousYear = this.state.currentYear;
        if (previousMonth < 0) {
            previousMonth = 11;
            previousYear = previousYear - 1;
        }
        let numDayOfPreviousMonth = getNumberOfDayInMonth(previousYear, previousMonth);
        //console.log(numDayOfPreviousMonth);
        let firstDay = new Date(this.state.currentYear, this.state.currentMonth).getDay();
        let result = [];
        //render first row
        let arr = [];
        for (let i = 0; i < 7; i++) {
            if (i < firstDay) {
                arr.push({
                    type: 0,
                    value: numDayOfPreviousMonth - firstDay + i + 1
                });
            }
            else arr.push({
                type: 1,
                value: date++
            });
        }
        result.push(arr);
        while (date < numDayOfMonth) {
            let dateOfNextMonth = 1;
            let arr = [];
            for (let i = 0; i < 7; i++) {
                if (date <= numDayOfMonth) arr.push({
                    type: 1,
                    value: date++
                });
                else {
                    arr.push({
                        type: 0,
                        value: dateOfNextMonth++
                    });
                }
            }
            result.push(arr);
        }
        return result;
    }

    preMonth() {
        if (this.state.currentMonth == 0) {
            this.setState((state)=>{
               return {
                   currentMonth: 11,
                   currentYear: state.currentYear - 1
               };
            }, this.loadDayOffList);
        } else {
            this.setState((state)=>{
                return {
                    currentMonth: state.currentMonth - 1
                };
            }, this.loadDayOffList);
        }
    }

    nextMonth() {
        if (this.state.currentMonth == 11) {
            this.setState((state)=>{
                return {
                    currentMonth: 0,
                    currentYear: state.currentYear + 1
                };
            }, this.loadDayOffList);
        } else {
            this.setState((state)=>{
                return {
                    currentMonth: state.currentMonth + 1
                };
            }, this.loadDayOffList);
        }
    }

    loadDayOffList() {
        //this function help load day off
        //console.log('Loading day off list');
        console.log(this.state);
    }

    render() {
        return (
            <div className={'FullSizeCalendar'}>
                <div className={'header'}>
                    <button onClick={()=>{this.preMonth();}} style={{float: "left"}}>Previous month</button>
                    {monthSymbols[this.state.currentMonth]}/{this.state.currentYear}
                    <button onClick={()=>{this.nextMonth();}} style={{float: "right"}}>Next month</button>
                </div>
                <div className={"calendar-content"}>
                    <table className={"calendar-table"}>
                        <thead>
                            <tr>
                                {
                                    dayInWeekSymbols.map((e, idx)=><th key={idx}>{e}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.getArrayOfDaysInMonth().map((e, idx)=>
                                    <tr key={idx}>
                                        {
                                            e.map((el,ind)=>
                                            <td key={ind} className = {el.type == 0 ? "out-of-month" : ""}>
                                                <div className={"cell-date"}>
                                                    {el.value}
                                                </div>
                                                <div className={"cell-info"}>

                                                </div>
                                            </td>)
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


function getNumberOfDayInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

const monthSymbols = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const dayInWeekSymbols = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];