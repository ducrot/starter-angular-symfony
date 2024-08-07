// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --ddev` replaces `environment.ts` with `environment.ddev.ts`.
// `ng build --development` replaces `environment.ts` with `environment.development.ts`.
// The list of file replacements can be found in `angular.json`.

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
    tailwind: '^3.4.4', // packageJson.devDependencies.tailwindcss is not available in prod
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome: packageJson.dependencies['@fortawesome/free-solid-svg-icons'],
    proto: packageJson.devDependencies['ts-proto'],
    typescript: packageJson.devDependencies.typescript,
  }
};
