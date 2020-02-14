import { googleUser, userInfo, dateString, isValid, uuid } from "../utils";
import { db } from "../db";
import { Contract } from "../@types/contract";


function getContracts() {
    return db.from<Contract>('contract')
}