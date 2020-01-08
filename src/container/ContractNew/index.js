import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class ContractNewPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1>This is Contract new page</h1>
        </div>)
    }
}

export default withRouter(ContractNewPage);