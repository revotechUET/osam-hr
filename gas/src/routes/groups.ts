import { googleUser, userInfo, removeAccent } from "../utils";
import { getService } from '../services';
import config from '../../../config';

global.createGroup = createGroup;
global.listGroups = listGroups;
global.deleteGroup = deleteGroup;

function deleteGroup(groupKey){
  var service = getService();
  var requestBody = JSON.stringify({groupKey : groupKey});
  if(service.hasAccess()){
    var url = "https://www.googleapis.com/admin/directory/v1/groups";
    var response = UrlFetchApp.fetch(url, {
      method : 'delete',
      contentType : "application/json",
      payload : requestBody,
      headers : {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });

    return JSON.parse(response.getContentText()) ;
  }
  return "Bug in delete group";
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

// function getService() {
//   return OAuth2.createService('Google')
//     .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/v2/auth')
//     .setTokenUrl('https://oauth2.googleapis.com/token')
//     .setClientId('662965188559-01aaqnfc5ut6s30s15r2clka6rti7ppc.apps.googleusercontent.com')
//     .setClientSecret('gl8hJEQfE1kmOgsmR0SpV2GJ')
//     .setCallbackFunction('authCallback')
//     .setPropertyStore(PropertiesService.getUserProperties())
//     .setScope('https://www.googleapis.com/auth/admin.directory.group')
//     .setParam('access_type', 'offline')
//     .setParam('approval_prompt', 'force')
//     .setParam('login_hint', Session.getActiveUser().getEmail());
// }


