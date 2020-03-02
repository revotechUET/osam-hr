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
      newContractSabbatical: false,
      contracts: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({
      newContractName: this.props.history.location.state.contract.name,
      newContractType: this.props.history.location.state.contract.type,
      newContractLunch: this.props.history.location.state.contract.lunch,
      newContractSabbatical: this.props.history.location.state.contract.leaveRequest,
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
      case 'contractSabbatical':
        this.setState({ newContractSabbatical: e.target.checked });
        break;
    }
  }

  async updateContract() {
    //checkvalid
    if (this.state.newContractName.length === 0) {
      return;
    }
    let id = this.props.match.params.id;
    let name = this.state.newContractName;
    let type = this.state.newContractType;
    let lunch = this.state.newContractLunch;
    let sabbatical =  this.state.newContractSabbatical;
    await apis.updateContract({id,name, type, lunch, sabbatical})

    this.goBack();

  }

  render() {
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
              <Checkbox name="contractSabbatical" checked={this.state.newContractSabbatical} onChange={(e) => this.handleChange(e)} />
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
