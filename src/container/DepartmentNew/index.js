import React from 'react';
import {withRouter} from 'react-router-dom';
import StyledPaginationTable from '../../components/StyledPaginationTable';

import './style.less';

class DepartmentNewPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1>This is department new page</h1>
        </div>)
    }
}

export default withRouter(DepartmentNewPage);