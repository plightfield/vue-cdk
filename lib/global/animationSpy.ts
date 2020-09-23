import { inject } from "vue";
import { platformToken } from ".";
type AnimationCallback = (dt: number) => void;

/**
 * spy animation and get result
 *
 * @export
 * @class AnimationSpy
 */
export default class AnimationSpy {
  cbs: { [key: string]: AnimationCallback } = {};
  currentTime = 0;
  constructor() {
    if (!inject(platformToken)!.BROWSER) return;
    this.step.bind(this)();
  }

  step() {
    if (this.currentTime === 0) {
      this.currentTime = Date.now();
      window.requestAnimationFrame(this.step.bind(this));
      return;
    }
    const nowTime = Date.now();
    const dt = nowTime - this.currentTime;
    this.currentTime = nowTime;
    // call all the callbacks
    for (let key in this.cbs) {
      this.cbs[key](dt);
    }
    window.requestAnimationFrame(this.step.bind(this));
  }

  /**
   * add an animation callback
   *
   * @param {AnimationCallback} cb
   * @returns
   * @memberof AnimationSpy
   */
  addCb(cb: AnimationCallback) {
    const key = (Date.now() + Math.random()).toString();
    this.cbs[key] = cb;
    return key;
  }

  /**
   * remove an animation callback
   *
   * @param {string} key
   * @memberof AnimationSpy
   */
  removeCb(key: string) {
    delete this.cbs[key];
  }
}
