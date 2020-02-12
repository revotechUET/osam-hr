import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';
import CenteredModal from './../../components/CenteredModal';

import './style.less';

class ContractManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false
        };
    }

    componentDidMount() {
        this.setState({
            modalActive: false
        });
    }

    render() {
        return (<div >
            <h1 style={{marginBottom: "10px"}}>Hợp đồng</h1>
            <button className="my-button active-btn" onClick={()=>this.setState({modalActive: true})}>Tạo mới</button>
            <div>
               {/* <StyledPaginationTable /> */}
            </div>

            <CenteredModal active = {this.state.modalActive} onCancel={()=>this.setState({modalActive: false})}>
                <div style={{backgroundColor: "white", width: "300px", height: "200px"}}>
                    <h1>Loại hợp đồng</h1>
                </div>
            </CenteredModal>
        </div>)
    }
}

export default withRouter(ContractManagementPage);