import { Contract } from "../@types/contract";
import { db } from "../db";
import { uuid } from "../utils";


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

global.getContracts = getContracts;
global.getContractById = getContractById;
global.insertContract = insertContract;
