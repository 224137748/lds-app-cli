const fse = require('fs-extra');
const { configPath } = require('./constance');

const jsonConfig = {
  "name": "lds-app-cli",
  "mirror": "https://zpfz.vercel.app/download/files/frontend/tpl/js-plugin-cli/",
  "rootPath": ""
};


async function generateConfig() {
  try {
    await fse.outputJSON(configPath, jsonConfig);
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = generateConfig;