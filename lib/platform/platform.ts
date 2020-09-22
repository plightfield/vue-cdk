import { InjectionKey } from "vue";

let hasV8BreakIterator: boolean;

try {
  hasV8BreakIterator = (typeof Intl !== 'undefined' && (Intl as any).v8BreakIterator);
} catch (e) {
  hasV8BreakIterator = false;
}

export class Platform {

  static key: InjectionKey<Platform> = Symbol('cdk-platform');

  readonly NEW_EDGE: boolean = this.isBrowser && /(Edg)/u.test(navigator.userAgent);

  readonly EDGE: boolean = this.isBrowser && /(edge)/i.test(navigator.userAgent);

  readonly TRIDENT: boolean = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);

  readonly BLINK: boolean = this.isBrowser && !!((window as any).chrome || hasV8BreakIterator) && typeof CSS !== 'undefined' && !this.EDGE && !this.TRIDENT;

  readonly WEBKIT: boolean = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;

  readonly IOS: boolean = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

  readonly FIREFOX: boolean = this.isBrowser && /firefox|minefield/i.test(navigator.userAgent);

  readonly ANDROID: boolean = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;

  readonly SAFARI: boolean = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;

  constructor(private readonly isBrowser: boolean) { }
}
