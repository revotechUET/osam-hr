import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';
import CenteredModal from './../../components/CenteredModal';
import apis from './../../service/api.service';
import DataTable from 'react-data-table-component';

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
            contracts: []
        };
    }

    componentDidMount() {
        this.setState({
            modalActive: false,
            newContractName: "",
            newContractType: "fulltime",
            newContractLunch: false,
            newContractSabbatical: false,
            contracts: []
        });
        this.load();
    }

    async load() {
        let rs = await apis.getContracts();
        this.setState({
            contracts: rs
        })
    }

    clearModal() {
        this.setState({
            modalActive: false,
            newContractName: "",
            newContractType: "fulltime",
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
        return (<div className="ContractManagement" style={{marginTop: "40px", borderRadius: "20px", padding: "10px 20px", background: "#fff"}}>
             <div className="title-vs-btn">
                <div className="my-button active-btn ti ti-plus" onClick={()=>this.setState({modalActive: true})}></div>
                <div className="title">Hợp đồng</div>
            </div>
            <DataTable
                noHeader
                fixedHeader
                fixedHeaderScrollHeight="calc(100vh - 333px)"
                persistTableHead
                pagination
                noDataComponent='Không có hợp đồng'
                columns={displays}
                data={this.state.contracts}
            />
            <CenteredModal active = {this.state.modalActive} onCancel={() => {this.clearModal()}}>
                <div className="contract-svg"></div>
                <div className="content-modal">
                    <div style={{display: "flex", marginBottom: "20px"}}>
                        <div style={{flexBasis: "120px", fontWeight: "bold"}}>Tên hợp đồng mới</div>

                    </div>
                    <div style={{display: "flex", marginBottom: "20px"}}>
                        <div style={{flexBasis: "60%"}}>
                            <input className="input" placeholder="Nhập tên hợp đồng" name="contractName" value={this.state.newContractName} onChange={(e)=>this.handleChange(e)}/>
                        </div>
                    </div>
                    <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                        <div style={{flexBasis: "120px", fontWeight: "bold"}}>Cách tính công</div>
                        <div style={{flex: 1}}>
                            <select className="input" name="contractType" value={this.state.newContractType} onChange={(e)=>this.handleChange(e)}>
                                <option value="fulltime">Full time</option>
                                <option value="parttime">Part time</option>
                            </select>
                        </div>
                    </div>
                    <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                        <div style={{flexBasis: "120px", fontWeight: "bold"}}>Ăn trưa</div>
                        <div style={{flex: 1}}>
                             <input className = "input checkbox" type="checkbox" name="contractLunch" checked={this.state.newContractLunch}
                                onChange={(e)=>this.handleChange(e)}/>
                        </div>
                    </div>
                    <div style={{display: "flex", marginBottom: "10px", alignItems: "center"}}>
                        <div style={{flexBasis: "120px", fontWeight: "bold"}}>Nghỉ phép</div>
                        <div style={{flex: 1}}>
                            <input className = "input checkbox" name="contractSabbatical" checked={this.state.newContractSabbatical}
                            type="checkbox" onChange={(e)=>this.handleChange(e)}/>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="my-button-cancel" onClick={()=>{this.clearModal()}}>Hủy</div>
                        <div className="my-button-ok" onClick={()=>{this.saveContract();}}>Lưu</div>
                    </div>
                </div>

            </CenteredModal>
        </div>)
    }
}

export default withRouter(ContractManagementPage);
