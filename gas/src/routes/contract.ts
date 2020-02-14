import { googleUser, userInfo, dateString, isValid, uuid } from "../utils";
import { db } from "../db";
import { Contract, ContractType } from "../@types/contract";


function getContracts() {
    return db.from<Contract>('contract').getDataJSON();
}

function getContractById(id) {
    return db.from<Contract>('contract').query.where('id', id).toJSON();
}

function insertContract(contract: Contract) {
    contract.id = uuid();
    return db.from<Contract>('contract').insert(contract);
}