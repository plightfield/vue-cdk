import {
  InjectionKey,
  nextTick,
  onMounted,
  provide,
  Ref,
  ref,
  shallowRef,
  watch,
} from "vue";
import Scrollable from "./scrollable";
import { throttle, clone, after, debounce, takeWhile } from "lodash";

// try audit time by data driven
// a frame stack check the items, direction, defaultHeight
// result will be beforeOffset, afterOffset, contentStartIndex, contentEndInect
// all the items should not be reactive

export interface VirtualItemData {
  [key: string]: any;
  virtualHeight?: number;
  active?: boolean;
}

export default class VirtualScroll {
  // inputs
  items: VirtualItemData[] = [];
  bufferSize = 3;
  defaultHeight = 100;
  // outputs
  before = ref(0);
  totalHeight = ref(0);
  // others
  displayItems: VirtualItemData[] = [];
  containerRef = ref<HTMLElement | null>(null);
  private scrollable = new Scrollable();
  scrollTop = 0;
  getHeight(key: number) {
    return (this.items[key].virtualHeight || this.defaultHeight) + "px";
  }
  private handleChange = () => {
    this.scrollTop = this.containerRef.value?.scrollTop!;
    const containerHeight = this.containerRef.value!.clientHeight;
    const buffer = this.bufferSize * this.defaultHeight;
    let beforeHeight = 0;
    let contentHeight = 0;
    let afterHeight = 0;
    for (let item of this.items) {
      const height = item.virtualHeight || this.defaultHeight;
      if (beforeHeight < this.scrollTop - buffer) {
        beforeHeight += height;
        item.active = false;
      } else if (contentHeight < containerHeight + 3 * buffer) {
        // add content
        contentHeight += height;
        item.active = true;
      } else {
        afterHeight += height;
        item.active = false;
      }
    }
    // send result
    this.before.value = beforeHeight;
    this.totalHeight.value = beforeHeight + afterHeight + contentHeight;
    this.displayItems = this.items.filter((el) => el.active);
  };

  constructor(items: VirtualItemData[]) {
    this.items = items;
    onMounted(() => {
      this.handleChange();
    });
    this.scrollable.nodeRef = this.containerRef;
    this.scrollable.scrollCb = this.handleChange;
    provide("cdk-virtual-scroll", this);
  }
}
