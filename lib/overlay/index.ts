import { App } from "vue";
import { OverlayService } from "./overlay_service";
import { CdkAny } from '../types';

export * from './overlay_config';
export * from './overlay_props';
export * from './overlay_service';
export * from './overlay_state';
export * from './use_overlay';


export const overlay = {
  install(app: App, ...options: CdkAny[]) {
    // only once
    let div = document.getElementById('vue-cdk-overlay');
    if (!div) {
      div = document.createElement('div');
      div.id = 'vue-cdk-overlay';
      div.className = 'vue-cdk-overlay-container';
      document.body.append(div);  
    }
    app.provide(OverlayService.key, new OverlayService(div));
  }
}
