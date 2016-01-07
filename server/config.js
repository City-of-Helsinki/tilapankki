const hashFile = require('hash-file');
const nconf = require('nconf');

const isProduction = process.env.NODE_ENV === 'production';

// Specifying an env delimiter allows us to override below config when shipping
// to production server.
nconf.env('__');

function getAssetHash(filePath) {
  if (!isProduction) return '';
  try {
    return hashFile.sync(filePath);
  } catch (error) {
    return '';
  }
}

const config = {
  assetsSources: {
    appCss: isProduction ? `/_assets/app.css?${getAssetHash('dist/app.css')}` : '',
    appJs: isProduction ? `/_assets/app.js?${getAssetHash('dist/app.js')}` : '/app.js',
  },
  isProduction: isProduction,
  port: isProduction ? 8080 : 3000,
  ip: 'localhost',
  webpackStylesExtensions: ['css', 'less'],
};

nconf.defaults(config);

module.exports = nconf.get();
