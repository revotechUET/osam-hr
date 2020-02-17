import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';
import CenteredModal from './../../components/CenteredModal';
import apis from './../../service/api.service';

import './style.less';

class ContractManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
            newContractName: "",
            newContractType: "",
            newContractLunch: false,
            newContractSabbatical: false
        };
    }

    componentDidMount() {
        this.setState({
            modalActive: false
        });
    }

    clearModal() {
        this.setState({
            modalActive: false,
            newContractName: "",
            newContractType: "",
            newContractLunch: false,
            newContractSabbatical: false
        });
    }

    handleChange(e) {
        switch (e.target.name) {
            case 'contractName':
                this.setState({newContractName: e.target.value});
                break;
            case 'contractType':
                this.setState({newContractType: e.target.value});
                break;
            case 'contractLunch': 
                this.setState({newContractLunch: e.target.checked});
                break;
            case 'contractSabbatical':
                this.setState({newContractSabbatical: e.target.checked});
                break;
        }
    }

    saveContract() {
        //save contract
        //checkvalid
        if (this.state.newContractName.length === 0) {
            return;
        }
        //do request
        apis.insertContract({
            name: this.state.newContractName,
            type: this.state.newContractType,
            lunch: this.state.newContractLunch,
            sabbatical: this.state.newContractSabbatical
        });

        this.clearModal();

    }

    render() {
        return (<div className="ContractManagement">
            <h1 style={{marginBottom: "10px"}}>Hợp đồng</h1>
            <button className="my-button active-btn" onClick={()=>this.setState({modalActive: true})}>Tạo mới</button>
            <CenteredModal active = {this.state.modalActive} onCancel={() => {this.clearModal()}}>
                <div className="header">
                    Loại hợp đồng
                </div>
                <div className="modal-input-container">
                    <div className = "input-field">
                        <div className="label">Tên</div>
                        <input className="input" name="contractName" value={this.state.newContractName} onChange={(e)=>this.handleChange(e)}/>
                    </div>
                    <div className = "input-field">
                        <div className="label">Cách tính công</div>
                        <select className="input" name="contractType" value={this.state.newContractType} onChange={(e)=>this.handleChange(e)}>
                            <option value="fulltime">Full time</option>
                            <option value="parttime">Part time</option>
                        </select>
                    </div>
                    <div className="input-field">
                        <div className="label">Ăn trưa</div>
                        <input className = "input checkbox" type="checkbox" name="contractLunch" checked={this.state.newContractLunch}
                            onChange={(e)=>this.handleChange(e)}/>
                    </div>
                    <div className="input-field">
                        <div className="label">Nghỉ phép</div>
                        <input className = "input checkbox" name="contractSabbatical" checked={this.state.newContractSabbatical}
                            type="checkbox" onChange={(e)=>this.handleChange(e)}/>
                    </div>
                </div>
                <div className="footer">
                    <div className="my-button" onClick={()=>{this.clearModal()}}>Hủy</div>
                    <div className="my-button active-btn" onClick={()=>{this.saveContract();}}>Lưu</div>
                </div>
            </CenteredModal>
        </div>)
    }
}

export default withRouter(ContractManagementPage);