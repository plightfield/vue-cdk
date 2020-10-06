import { App } from "vue";
import { OverlayService } from "./overlay_service";
import { getClassToken } from '../tools';

export * from './overlay_config';
export * from './overlay_props';
export * from './overlay_service';
export * from './overlay_state';

export const overlayKey = getClassToken(OverlayService);

export const overlayPlugin = {
  install(app: App) {
    app.provide(overlayKey, new OverlayService(document));
  }
}
