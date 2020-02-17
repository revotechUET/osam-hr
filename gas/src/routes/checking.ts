import {Checking} from '../@types/checking';
import {db} from '../db';

global.listCheck = listCheck;

function listCheck(){
    return db.from<Checking>('checking').getDataJSON();
}
  