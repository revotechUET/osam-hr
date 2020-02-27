// let storeCaches = {};
// let triggerCache = {};

// function getGgPromise(functionName, ...args) {
//     if (args.length === 1 && args[0] === undefined) args.length = 0;
//     return new Promise((resolve, reject) => {
//         google.script.run
//         .withSuccessHandler(resolve)
//         .withFailureHandler(reject)[fnName](...args);
//     });
// }

// function assignListener(functionName, callback, ...args) {
//     if (storeCaches[functionName]) {

//     } else {
//         //init caches
//         storeCaches[functionName] = {};
//         let newChaches = storeCaches[functionName];
//         newChaches.data = {};
//         newChaches.callbacks = [];
//         newChaches.callbacks.push(callback);
//         trigger(functionName);
//     }

//     return {
//         trigger: function() {return trigger(functionName)},
//         unSubcribe: function() {

//         }
//     }
// }

// async function trigger(functionName) {
//     //when I do a trigger :v
//     getGgPromise(functionName)
//     .then((rs)=>{

//     })
//     .catch(e=>{
//         //do nothing currently
//     });
// }