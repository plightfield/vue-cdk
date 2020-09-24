import { computed, inject, onBeforeUnmount, ref, Ref } from "vue";
import { platformToken } from "../global";

export interface ViewportScrollPosition {
  top: number;
  left: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface ViewportRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}

/**
 * not reactive viewport size
 * cause none reactive run well in performance
 * and shoud be used by other viewport considered component
 * only get size once for default
 *
 * @export
 * @class
 */
export default class {
  viewportSize = ref<ViewportSize>(null!);
  viewportRect: Ref<ViewportRect>;
  private isBrowser: boolean;

  /**
   * change windowSize
   *
   * @private
   */
  updateViewportSize = () => {
    this.viewportSize.value = this.isBrowser
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 };
  };

  /**
   * get viewport position by top left corner position
   *
   * @private
   */
  private getViewportScrollPosition = () => {
    if (!this.isBrowser) return { top: 0, left: 0 };
    const body = document.documentElement || document.body;
    const rect = body.getBoundingClientRect();
    const top = -rect.top || body.scrollTop || window.scrollY;
    const left = -rect.left || body.scrollLeft || window.scrollX;
    return { top, left } as ViewportScrollPosition;
  };
  constructor() {
    this.isBrowser = inject(platformToken)!.BROWSER;
    if (!this.isBrowser) {
      this.viewportRect = ref({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: 0,
        width: 0,
      });
      return;
    }
    // updateOnInit
    this.updateViewportSize();
    this.viewportRect = computed(() => {
      const { top, left } = this.getViewportScrollPosition();
      const { width, height } = this.viewportSize.value;
      return {
        top: top,
        left: left,
        bottom: top + height,
        right: left + width,
        height,
        width,
      };
    });
    window.addEventListener("resize", this.updateViewportSize);
    window.addEventListener("orientationchange", this.updateViewportSize);

    onBeforeUnmount(() => {
      window.removeEventListener("resize", this.updateViewportSize);
      window.removeEventListener("orientationchange", this.updateViewportSize);
    });
  }
}
