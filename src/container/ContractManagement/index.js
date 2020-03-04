import { Checkbox, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import Loading from '../../components/Loading';
import CenteredModal from './../../components/CenteredModal';
import apis from './../../service/api.service';
import './style.less';


const displays = [
  {
    name: 'Tên loại hợp đồng',
    selector: 'name',
    sortable: true
  },
  {
    name: 'Cách tính công',
    selector: contract => contract.type === 'fulltime' ? 'Theo ngày' : 'Theo buổi',
    sortable: true
  },
  {
    name: "Ăn trưa",
    selector: 'lunch',
    sortable: true,
    cell: (row) => <Checkbox defaultChecked={row.lunch} />
  },
  {
    name: "Nghỉ phép",
    selector: 'leaveRequest',
    sortable: true,
    cell: (row) => <Checkbox defaultChecked={row.leaveRequest} />
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
      newContractLeaveRequest: false,
      contracts: [],
      loading: true,
      contract : {}
    };
  }

  componentDidMount() {
    this.setState({
      modalActive: false,
      newContractName: "",
      newContractType: "fulltime",
      newContractLunch: false,
      newContractLeaveRequest: false,
      contracts: [],
      loading: true
    });
    this.load();
    console.log(this.state.contracts);
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
      newContractLeaveRequest: false,
    });
  }

  handleChange(e) {
    switch (e.target.name) {
      case 'contractName':
        this.setState({ newContractName: e.target.value });
        break;
      case 'contractType':
        this.setState({ newContractType: e.target.value });
        break;
      case 'contractLunch':
        this.setState({ newContractLunch: e.target.checked });
        break;
      case 'contractLeaveRequest':
        this.setState({ newContractLeaveRequest: e.target.checked });
        break;
    }
  }

  saveContract() {
    //save contract
    //checkvalid
    if (this.state.newContractName.length === 0) {
      return;
    }

    this.setState({ loading: true });
    //do request
    apis.insertContract({
      name: this.state.newContractName,
      type: this.state.newContractType,
      lunch: this.state.newContractLunch,
      leaveRequest: this.state.newContractLeaveRequest
    }).then(ok => {
      this.clearModal();
      this.setState({ loading: false });
      if (ok) {
        this.props.enqueueSnackbar("Thành công !", { variant: "success" });
        this.load();
      }
      else {
        this.props.enqueueSnackbar("Không thành công !", {variant : "error"});
      }
    }).catch(e => {
      this.setState({ loading: false });
      this.clearModal();
      this.props.enqueueSnackbar(e.message, { variant: "error" });
    });
  }

  goToContractEdit(contract) {
    this.props.history.push({
      pathname: `/contracts/${contract.id}/edit`,
      state: {contract: contract}
    });
  }

  render() {
    return (<div className="ContractManagement" style={{ marginTop: "40px", borderRadius: "10px", padding: "10px 20px", background: "#fff" }}>
      <div className="title-vs-btn">
        <div className="my-button active-btn ti ti-plus" onClick={() => this.setState({ modalActive: true })}></div>
        <div className="title">Hợp đồng</div>
      </div>
      <DataTable
        noHeader
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 333px)"
        persistTableHead
        pagination
        pointerOnHover
        highlightOnHover
        noDataComponent='Không có hợp đồng'
        progressPending={this.state.loading}
        progressComponent={<Loading />}
        columns={displays}
        data={this.state.contracts}
        onRowClicked={(row, event) => this.goToContractEdit(row)}
      />
      <CenteredModal active={this.state.modalActive} onCancel={() => { this.clearModal() }}>
        <div className="contract-svg"></div>
        <div className="content-modal">
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Tên hợp đồng mới</div>

          </div>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ flexBasis: "60%" }}>
              <input className="input" placeholder="Nhập tên hợp đồng" name="contractName" value={this.state.newContractName} onChange={(e) => this.handleChange(e)} />
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
            <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Cách tính công</div>
            <div style={{ flex: 1 }}>
              <Select fullWidth name="contractType" value={this.state.newContractType} onChange={(e) => this.handleChange(e)}>
                <MenuItem value="fulltime">Theo ngày</MenuItem>
                <MenuItem value="parttime">Theo buổi</MenuItem>
              </Select>
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
            <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Ăn trưa</div>
            <div style={{ flex: 1 }}>
              <Checkbox name="contractLunch" checked={this.state.newContractLunch} onChange={(e) => this.handleChange(e)} />
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
            <div style={{ flexBasis: "120px", fontWeight: "bold" }}>Nghỉ phép</div>
            <div style={{ flex: 1 }}>
              <Checkbox name="contractLeaveRequest" checked={this.state.newContractLeaveRequest} onChange={(e) => this.handleChange(e)} />
            </div>
          </div>
          <div className="footer">
            <div className="my-button-cancel" onClick={() => { this.clearModal() }}>Hủy</div>
            <div className="my-button-ok" onClick={() => { this.saveContract(); }}>Lưu</div>
          </div>
        </div>
      </CenteredModal>
    </div>)
  }
}

export default withSnackbar(withRouter(ContractManagementPage));
