import { Checkbox, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/Loading';
import CenteredModal from './../../components/CenteredModal';
import apis from './../../service/api.service';
import './style.less';


class ContractEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalActive: true,
      newContractName: "",
      newContractType: "fulltime",
      newContractLunch: false,
      newContractLeaveRequest: false,
      contracts: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({
      newContractName: this.props.history.location.state.contract.name,
      newContractType: this.props.history.location.state.contract.type,
      newContractLunch: this.props.history.location.state.contract.lunch,
      newContractLeaveRequest: this.props.history.location.state.contract.leaveRequest,
      contracts: [],
      loading: true
    });
  }

  goBack() {
    this.props.history.push('/contracts');
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

  async updateContract() {
    this.setState({loading : true});
    //checkvalid
    if (this.state.newContractName.length === 0) {
      return;
    }
    let id = this.props.match.params.id;
    let name = this.state.newContractName;
    let type = this.state.newContractType;
    let lunch = this.state.newContractLunch;
    let leaveRequest =  this.state.newContractLeaveRequest;
    await apis.updateContract({id,name, type, lunch, leaveRequest})
    this.setState({loading : false});
    this.goBack();

  }

  render() {
    if(this.state.loading){
      return(
        <Loading />
      )
    }
    return (
      <CenteredModal active={true} onCancel={() => { this.clearModal() }}>
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
            <div className="my-button-cancel" onClick={() => { this.goBack() }}>Hủy</div>
            <div className="my-button-ok" onClick={() => { this.updateContract(); }}>Lưu</div>
          </div>
        </div>
      </CenteredModal>
    )
  }
}

export default withRouter(ContractEditPage);
