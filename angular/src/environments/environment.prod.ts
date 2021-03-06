const packageJson = require('../../package.json');

export const environment = {
  production: true,
  apiEndpoint: '/api',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    material: packageJson.dependencies['@angular/material'],
    flexLayout: packageJson.dependencies['@angular/flex-layout'],
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome: packageJson.dependencies['@fortawesome/free-solid-svg-icons'],
    proto: packageJson.devDependencies['ts-proto'],
    typescript: packageJson.devDependencies.typescript,
  }
};
