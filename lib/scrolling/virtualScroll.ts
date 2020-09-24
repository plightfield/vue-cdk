import { InjectionKey, provide, Ref, ref, watch } from "vue";
import Scrollable from "./scrollable";

export interface VirtualItemData {
  [key: string]: any;
  virtualHeight?: number;
  active?: boolean;
}

export default class VirtualScroll {
  items: Ref<VirtualItemData[]>;
  bufferSize = ref(0);
  direction = ref<"herizon" | "vertical">("herizon");
  currentIndex = ref(0);
  beforeOffset = ref(0);
  afterOffset = ref(0);
  containerRef = ref<HTMLElement | null>(null);
  get containerProps() {
    return {
      beforeOffset: this.beforeOffset.value,
      afterOffset: this.afterOffset.value,
    };
  }

  private handleLayoutChange = () => {
    // clear all the active
    for (let item of this.items.value) {
      item.active = false;
    }
  };
  private handleScroll = () => {};

  private scrollable = new Scrollable();
  constructor(items: Ref<VirtualItemData[]>) {
    this.items = items;
    // when items,bufferSize,direction,currentIdex change
    // handle that change to mutate active & offset
    watch(
      [this.items, this.bufferSize, this.direction, this.currentIndex],
      () => {
        this.handleLayoutChange();
      },
      { immediate: true }
    );

    // registe scroll management
    this.scrollable.nodeRef = this.containerRef;
    this.scrollable.scrollCb = this.handleScroll;
    provide("cdk-virtual-scroll", this);
  }
}
