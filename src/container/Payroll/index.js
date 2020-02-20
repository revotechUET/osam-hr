import React from 'react';
import {withRouter} from 'react-router-dom';

import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class PayrollPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className = "Payroll">
             <div className="title-vs-btn">
                <div className="button-text my-button active-btn ti ti-import"></div>
                <div className="title">Tính công</div>
            </div>
            <div className="count-setting">
                <div style={{display: "flex", alignContent: "center", justifyContent: "center"}}>
                    <div className = "field-member">
                        <div>
                            Chọn thời gian tính công
                        </div>
                        <input type="date" /> đến <input type="date" />
                    </div>
                    <div className = "field-member">
                        <div>
                            Chọn bộ phận
                        </div>
                        <div>
                            <select style={{width: "250px"}}>
                                <option>hello</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: "50px", textAlign: "center"}}>
                    <button>Tính công</button>
                </div>
            </div>
            {/* <StyledPaginationTable /> */}
        </div>
        )
    }
}

export default withRouter(PayrollPage);