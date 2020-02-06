import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import routerConfig from './router.config.js';
import SideBar from './../container/RouteSideBar';
import TopBar from './../container/TopBar';

// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';

import './App.less';


//import AsyncPrivateRoute from './AsyncPrivateRoute';
import PrivateRoute from './PrivateRoute';

// toast.configure({
//     autoClose: 3000,
//     draggable: false,
//     position: toast.POSITION.TOP_RIGHT,
//     style: {
//         fontSize: "15px"
//     }
// });


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{display: "flex"}}>
                <BrowserRouter>
                    <div style={{width: "20%"}}>
                        <SideBar />
                    </div>
                    <div style={{width: "100%", marginLeft: "20px", marginRight: "20px"}}>
                        <TopBar />
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>
                                {getRouter(routerConfig)}
                                <Redirect to="/staffs" />
                            </Switch>
                        </Suspense>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}


function getRouter(routerConfig) {
    return routerConfig.map((router, idx)=>{
        if (router.type == "private") {
            return <PrivateRoute path = {router.path} exact = {router.exact || true} key = {idx}
                    component = {router.Component} valid = {router.validFn} redirect = {router.redirectUrl} />
        } else if (router.type = "normal") {
            return <Route path = {router.path} exact = {router.exact || true} component = {router.component} key = {idx} />
        } else return <div>Unknown route type</div>
    });
}


export default App;