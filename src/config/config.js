let config_DEFAULT = require('./default');
let config_PRODUCTION = require('./default');

function getConfig() {
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
        return config_DEV;
    } else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
        return config_PRODUCTION;
    } else {
        return config_DEFAULT;
    }
}

module.exports = getConfig();