import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';
import CenteredModal from './../../components/CenteredModal';
import apis from './../../service/api.service';
import DataTable from 'react-data-table-component';
import Loading from '../../components/Loading';

import './style.less';

const displays = [
    {
        name: 'Tên loại hợp đồng',
        selector: 'name',
        sortable: true
    },
    {
        name: 'Cách tính công',
        selector: 'type',
        sortable: true
    },
    {
        name: "Ăn trưa",
        selector: 'lunch',
        sortable: true,
        cell: (row) => <input defaultChecked = {row.lunch} type="checkbox"/>
    },
    {
        name: "Nghỉ phép",
        selector: 'sabbatical',
        sortable: true,
        cell: (row) => <input defaultChecked = {row.sabbatical} type="checkbox"/>
    }
  ];

class ContractManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
            newContractName: "",
            newContractType: "fulltime",
            newContractLunch: false,
            newContractSabbatical: false,
            contracts: [],
            loading: true
        };
    }

    componentDidMount() {
        this.setState({
            modalActive: false,
            newContractName: "",
            newContractType: "fulltime",
            newContractLunch: false,
            newContractSabbatical: false,
            contracts: [],
            loading: true
        });
        this.load();
    }

    async load() {
        let rs = await apis.getContracts();
        this.setState({
            contracts: rs,
            loading: false
        })
    }

    clearModal() {
        this.setState({
            modalActive: false,
            newContractName: "",
            newContractType: "fulltime",
            newContractLunch: false,
            newContractSabbatical: false,
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
             <div className="title-vs-btn">
                <div className="my-button active-btn ti ti-plus" onClick={()=>this.setState({modalActive: true})}></div>
                <div className="title">Hợp đồng</div>
            </div>
            <DataTable style={{marginTop: "40px", borderRadius: "20px"}}
                noHeader
                noDataComponent='Không có hợp đồng'
                progressPending={this.state.loading}
                progressComponent={<Loading/>}
                columns={displays}
                data={this.state.contracts}
            />
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