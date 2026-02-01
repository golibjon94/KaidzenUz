import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { icons } from './icons-provider';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideNzIcons(icons)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
