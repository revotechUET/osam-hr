import { googleUser, userInfo, removeAccent } from "../utils";
import { getService } from '../services';
import config from '../../../config';

global.createGroup = createGroup;
global.listGroups = listGroups;
global.deleteGroup = deleteGroup;

export function deleteGroup(groupKey){
  AdminDirectory.Groups.remove("01mrcu090oub2w0");
  return true ;
}

function listGroups(email){
  let user = googleUser(email);
  let customerId = user.customerId;
  var service = getService();
  var requestBody = JSON.stringify({customer : customerId});
  if(service.hasAccess()){
    var url = "https://www.googleapis.com/admin/directory/v1/groups";
    var response = UrlFetchApp.fetch(url, {
      method : 'get',
      contentType : "application/json",
      payload : requestBody,
      headers : {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });

    return JSON.parse(response.getContentText()) ;
  }
  return "Bug in list groups";
}

export function createGroup(name) {
  const service = getService(config.serviceAccount.adminEmail);
  const email = Session.getActiveUser().getEmail();
  const groupEmail = removeAccent(name) + "@" + email.split('@')[1];
  const requestBody = JSON.stringify({ email: groupEmail, name: name });
  if (service.hasAccess()) {
    const url = 'https://www.googleapis.com/admin/directory/v1/groups';
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: "application/json",
      payload: requestBody,
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    return JSON.parse(response.getContentText());
  } else {
    throw service.getLastError();
  }
}


