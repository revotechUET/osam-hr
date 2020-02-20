import { useEffect, useRef } from "react";

function gscriptrun(fnName, ...args) {
  if (args.length === 1 && args[0] === undefined) args.length = 0;
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)[fnName](...args);
  })
}

function makeCancelable(promise, isThrow) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val => (isCanceled ? reject({ isCanceled }) : resolve(val)))
      .catch(error => (isCanceled ? reject({ isCanceled }) : reject(error)));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

function useCancellable() {
  const promises = useRef([]);
  useEffect(() => {
    return () => {
      promises.current.forEach(p => p.cancel());
      promises.current = [];
    };
  }, []);
  function cancellablePromise(p) {
    const cPromise = makeCancelable(p);
    promises.current.push(cPromise);
    return cPromise.promise;
  }
  return cancellablePromise;
}

class ApiService {
  constructor() {
    // hooks
    this.useCancellable = useCancellable;
    this.gscriptrun = gscriptrun;
  }

  getUserById(id, option) {
    return gscriptrun('loadUserById', id, option)
  }

  getContracts() {
    return gscriptrun('getContracts');
  }

  insertContract(contract) {
    return gscriptrun('insertContract', contract);
  }
  //#region user
  listUsers(payload) {
    return gscriptrun('listUsers', payload);
  }

  listEmails(maxResult) {
    return gscriptrun('listUsersDomain', maxResult);
  }

  getUserInfo() {
    return gscriptrun('getUserInfo');
  }

  appendUser(data) {
    return gscriptrun('appendUser', data);
  }
  //#endregion

  //#region department
  addNewDepartment(data) {
    return gscriptrun('addNewDepartment', data);
  }

  listDepartment() {
    return gscriptrun('listDepartment');
  }
  //#endregion

  //#region leave
  listLeaves(payload) {
    return gscriptrun('leaveList', payload);
  }
  leaveNew(data) {
    return gscriptrun('leaveNew', data);
  }
  leaveDetail({ id }) {
    return gscriptrun('leaveDetail', { id });
  }
  leaveEdit(data) {
    return gscriptrun('leaveEdit', data);
  }
  leaveApprove(payload) {
    return gscriptrun('leaveApprove', payload)
  }
  //#endregion

  //#region checking
  listCheck(payload) {
    return gscriptrun('listCheck', payload);
  }
  checkingNew(data) {
    return gscriptrun('checkingNew', data);
  }
  verifyCheckingDate(date) {
    return gscriptrun('verifyCheckingDate', date);
  }
  checkingDetail(payload){
    return gscriptrun('checkingDetail',payload);
  }
  //#endregion
}

export default new ApiService();
/*

let config = require('./../config/config');
const Axios = require('axios-observable').Axios;
let Observable = require('rxjs').Observable;

module.exports = {
  get: get,
  post: post
}

function handleGet() {
  return (observable) => new Observable(observer => {
    // this function will called each time this
    // Observable is subscribed to.
    const subscription = observable.subscribe({
      next: function(value) {
        //insert your logic
        observer.next(value);

      },
      error: function(err) {
        //insert your logic
        observer.error(err);
      },
      complete: function() {
        //insert your logic
        observer.complete();
      }
    });
    // the return value is the teardown function,
    // which will be invoked when the new
    // Observable is unsubscribed from.
    return () => {
      subscription.unsubscribe();
    }
  });
}

function handlePost() {
  return (observable) => new Observable(observer => {
    // this function will called each time this
    // Observable is subscribed to.
    const subscription = observable.subscribe({
      next: function(value) {
        //insert your logic
        observer.next(value);

      },
      error: function(err) {
        //insert your logic
        observer.error(err);
      },
      complete: function() {
        //insert your logic
        observer.complete();
      }
    });
    // the return value is the teardown function,
    // which will be invoked when the new
    // Observable is unsubscribed from.
    return () => {
      subscription.unsubscribe();
    }
  });
}



function get(url) {
  // let token = null;
  // let configHeaders = {};
  // if (token) {
  //   configHeaders = {
  //     headers: {
  //       Authorization: token
  //     }
  //   }
  // }
  return Axios.get(url, configHeaders)
    .pipe(handleGet());
}

function post(url, payload) {
  // let token = null;
  // let configHeaders = {};
  // if (token) {
  //   configHeaders = {
  //     headers: {
  //       Authorization: token
  //     }
  //   }
  // }
  return Axios.post(url, payload, configHeaders)
    .pipe(handlePost());
}

*/
