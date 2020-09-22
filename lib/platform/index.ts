import { App } from 'vue';
import { Platform } from './platform';

export * from './platform';


export const platformPlugin = {
  install(app: App, ...options: any[]) {
    app.provide(Platform.key, new Platform(true));
  }
}
