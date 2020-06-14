// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const packageJson = require('../../package.json');

export const environment = {
  production: false,
  apiEndpoint: 'http://127.0.0.1:8000/api',
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
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
