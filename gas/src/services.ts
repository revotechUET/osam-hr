import config from '../../config';

export function getService() {
  return OAuth2.createService("Service Account")
    .setTokenUrl(config.serviceAccount.token_uri)
    .setPrivateKey(config.serviceAccount.private_key)
    .setIssuer(config.serviceAccount.client_email)
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setCache(CacheService.getScriptCache())
    .setLock(LockService.getScriptLock())
    .setParam('access_type', 'offline')
    .setScope(config.serviceAccount.scopes.join(' '));
}
