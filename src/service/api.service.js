function gscriptrun(fnName, ...args) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
    [fnName](...args);
  })
}

class ApiService {

  // user
  listUsers() {
    return gscriptrun('listUsers');
  }
  getUserInfo() {
    return gscriptrun('getUserInfo');
  }

  // department
  addNewDepartment(data){
    return gscriptrun('addNewDepartment', data);
  }

  // leave
  listLeaves(payload) {
    return gscriptrun('leaveList', payload);
  }

  getSheetData(){
    return gscriptrun('getSheetData');
  }
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
