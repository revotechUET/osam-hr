import React,{ useReducer, useEffect, useCallback } from 'react';
import {withRouter} from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { dateFormat } from '../../utils/date';
import apiService from '../../service/api.service';
import './style.less';

const columns = [
    {
        name: 'Mã',
        selector: 'id',
        style: { textTransform: 'uppercase' },
      },
      {
        name: 'Nhân viên',
        selector: 'requester.name',
      },
      {
        name: "Giờ check in",
        // selector: 'checkinTime'
        selector: row => dateFormat(row.checkinTime, 'hh:mm')
      },
      {
        name: "Giờ check out",
        // selector: 'checkoutTime'
        selector: row => dateFormat(row.checkoutTime, 'hh:mm')
      },
      // {
      //   name: "Tổng công"
      // },
      {
        name: "Ghi chú",
        selector: 'note'
      }
  ];
class StaffChecking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staffChecking : [],
            loading : false
        }
    }

    async componentDidMount(){
        this.setState({loading : true});
        let check = await apiService.listCheck({});
        this.setState({loading: false , staffChecking : check})
    }
    render() {
        let {staffChecking} = this.state;
        return (<div >
            <h1 style={{marginBottom: "10px"}}>Chấm công</h1>
            <button className="my-button active-btn" onClick={()=>this.props.history.push("/checking/new")}>Tạo mới</button>
            <DataTable
            noHeader
            progressPending={this.state.loading}
            noDataComponent='Loading'
            persistTableHead
            columns={columns}
            data={staffChecking}
      />
        </div>)
    }
}

// function StaffChecking({ history }) {
//     const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }),
//       {
//         list: [],
//         loading: false,
//       });
//     const cancellable = apiService.useCancellable();
  
//     useEffect(() => {
//       (async () => {
//         setState({ loading: true })
//         const list = await cancellable(apiService.listCheck({}));
//         setState({ list, loading: false });
//       })();
//     }, []);
//     const onRowClicked = useCallback(() => {
  
//     });
//     const { list, loading } = state;
//     return (
//       <div >
//         <h1 style={{ marginBottom: "10px" }}>Chấm công</h1>
//         <button className="my-button active-btn" onClick={() => history.push("/checking/new")}>Tạo mới</button>
//         <div>
//           <DataTable
//             noHeader
//             noDataComponent='........'
//             progressPending={loading}
//             persistTableHead
//             columns={columns}
//             data={list}
//           />
//         </div>
//       </div>
//     )
//   }

export default withRouter(StaffChecking);