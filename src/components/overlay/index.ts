
import { App, provide } from "vue";
import { OverlayService } from "./OverlayService";

let overlayContainer: HTMLElement;
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
