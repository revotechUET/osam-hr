import React from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import './style.less';


const displays = [
  {
    header: "Tên nhân viên",
    field: "name",
    width: 0.3
  },
  {
    header: "Email",
    field: "email",
    width: 0.3
  },
  {
    header: "Bo phan",
    field: "department",
    width: 0.1
  },
  {
    header: "Job type",
    field: "jobtype",
    width: 0.3
  }
]

class StaffPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      data: [],
    }
  }

  async componentDidMount() {

  }

  render() {
    const { data } = this.state;
    return (<div>
      <h1 style={{ marginBottom: "10px" }}>Nhân viên</h1>
      <button onClick={() => { this.props.history.push("/staffs/new") }}>Tạo mới</button>
      <DataTable
        noHeader
        noDataComponent='Không có nhân viên'

        data={data}
      />
      {/* <div>
        <StyledPaginationTable items={this.state.data} displays={displays} />
      </div> */}
    </div>)
  }
}


export default withRouter(StaffPage);

