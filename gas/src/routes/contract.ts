import { Contract } from "../@types/contract";
import { db } from "../db";
import { uuid } from "../utils";

function getContracts() {
  const scriptCache = CacheService.getScriptCache();
  const cached = scriptCache.get('CONTRACT');
  if (cached) return JSON.parse(cached);
  const contracts = db.from<Contract>('contract').getDataJSON();
  scriptCache.put('CONTRACT', JSON.stringify(contracts), 21600);
  return contracts;
}

function getContractById(id) {
  const scriptCache = CacheService.getScriptCache();
  const cached = scriptCache.get('CONTRACT');
  if (cached) {
    const contracts = JSON.parse(cached);
    return contracts.find(c => c.id === id);
  }
  return db.from<Contract>('contract').query.where('id', id).toJSON(1)[0];
}

function insertContract(contract: Contract) {
  contract.id = uuid();
  const ok = db.from<Contract>('contract').insert(contract);
  if (ok) {
    const scriptCache = CacheService.getScriptCache();
    scriptCache.remove('CONTRACT');
  }
  return ok;
}

// function updateContract(contract: Contract) {
//   const ok = db.from<Contract>('contract').update(contract.id, contract);
//   if (ok) {
//     scriptCache.remove('CONTRACT');
//   }
//   return ok;
// }
function updateContract({id, name, type, lunch, leaveRequest}) {
 return  db.from<Contract>('contract').update(id,{name, type, lunch, leaveRequest});
 
}

global.getContracts = getContracts;
global.getContractById = getContractById;
global.insertContract = insertContract;
global.updateContract = updateContract;
