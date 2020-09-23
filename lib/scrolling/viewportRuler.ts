import { inject, onBeforeUnmount } from "vue";
import { platformToken } from "../global";

export interface ViewportScrollPosition {
  top: number;
  left: number;
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
  private viewportSize!: { width: number; height: number };
  private isBrowser: boolean;
  constructor() {
    this.isBrowser = inject(platformToken)!.BROWSER;
    if (!this.isBrowser) return;
    window.addEventListener("resize", this.changeListener.bind(this));
    window.addEventListener(
      "orientationchange",
      this.changeListener.bind(this)
    );

    onBeforeUnmount(() => {
      window.removeEventListener("resize", this.changeListener.bind(this));
      window.removeEventListener(
        "orientationchange",
        this.changeListener.bind(this)
      );
    });
  }

  changeListener() {
    this.updateViewportSize.bind(this)();
  }

  /**
   * get size data
   *
   * @returns
   */
  getViewportSize() {
    if (!this.viewportSize) {
      this.updateViewportSize.bind(this)();
    }
    if (!this.isBrowser) {
      this.viewportSize = null!;
    }

    return { ...this.viewportSize };
  }

  /**
   * get rect data
   *
   * @returns {ClientRect}
   */
  getViewportRect(): ClientRect {
    const scrollPosition = this.getViewportScrollPosition.bind(this)();
    const { width, height } = this.getViewportSize.bind(this)();
    return {
      top: scrollPosition.top,
      left: scrollPosition.left,
      bottom: scrollPosition.top + height,
      right: scrollPosition.left + width,
      height,
      width,
    };
  }

  /**
   * get viewport position by top left corner position
   *
   * @returns {ViewportScrollPosition}
   */
  getViewportScrollPosition(): ViewportScrollPosition {
    if (!this.isBrowser) return { top: 0, left: 0 };
    const body = document.documentElement || document.body;
    const rect = body.getBoundingClientRect();
    const top = -rect.top || body.scrollTop || window.scrollY;
    const left = -rect.left || body.scrollLeft || window.scrollX;
    return { top, left };
  }

  /**
   * update the viewport size
   *
   */
  updateViewportSize() {
    this.viewportSize = this.isBrowser
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 };
  }
}
