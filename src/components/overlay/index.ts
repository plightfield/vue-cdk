
import { App, provide } from "vue";
import { OverlayService } from "./overlay_service";


export * from './overlay_config';
export * from './overlay_props';
export * from './overlay_service';
export * from './overlay_state';
export * from './use_overlay';

export const overlay = {
  install(app: App, ...options: any[]) {
    // only once
    if (!OverlayService.overlayContainer) {
      const div = document.createElement('div');
      div.id = 'vue-cdk-overlay';
      div.className = 'vue-cdk-overlay-container';
      document.body.append(div);
      OverlayService.overlayContainer = div;
    }
    provide(OverlayService.key, new OverlayService());
  }
}
