import DateFnsUtils from '@date-io/date-fns';
import { IconButton } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { SnackbarProvider } from 'notistack';
import React, { Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import SideBar from './../container/RouteSideBar';
import TopBar from './../container/TopBar';
import './App.less';
import PrivateRoute from './PrivateRoute';
import routerConfig from './router.config.js';
import { Close } from '@material-ui/icons'

const notistackRef = React.createRef();
const onClickDismiss = key => () => {
  notistackRef.current.closeSnackbar(key);
}
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="slim-scroller" style={{ display: "flex", height:"100%", background: "rgb(245, 245, 245)" }}>
        <BrowserRouter>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <SnackbarProvider
              ref={notistackRef}
              dense preventDuplicate
              action={(key) => (
                <IconButton onClick={onClickDismiss(key)}>
                  <Close />
                </IconButton>
              )}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <div style={{ minWidth: "300px", maxWidth: "300px" }}>
                <SideBar />
              </div>
              <div style={{ width: "100%", padding: "40px", background: "transparent", position: "relative" }}>
                <TopBar />
                <Suspense fallback={<div>Loading...</div>}>
                  <Switch>
                    {getRouter(routerConfig)}
                    <Redirect to="/staffs" />
                  </Switch>
                </Suspense>
              </div>
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </BrowserRouter>
      </div>
    );
  }
}


function getRouter(routerConfig) {
  return routerConfig.map((router, idx) => {
    if (router.type === "private") {
      return <PrivateRoute path={router.path} exact={typeof router.exact === 'boolean' ? router.exact : true} key={idx}
        component={router.Component} valid={router.validFn} redirect={router.redirectUrl} />
    } else {
      return <Route path={router.path} exact={typeof router.exact === 'boolean' ? router.exact : true} component={router.component} key={idx} />
    }
  });
}

export default App;
