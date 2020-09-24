import { VirtualContainer, VirtualItem } from "./VirtualScrollElements";
import VritualScroll from "./virtualScroll";
import { defineComponent, ref } from "vue";
import VirtualScroll, { VirtualItemData } from "./virtualScroll";

export default defineComponent({
  name: "virtual-scroll-spec",
  setup() {
    const arr: VirtualItemData[] = [];
    arr.length = 1000;
    arr.fill({ name: "test" });
    const items = ref(arr);
    new VirtualScroll(items);
    return () => (
      <VirtualContainer>
        {items.value.map((el, key) => (
          <VirtualItem key={key} height={el.virtualHeight} active={el.active}>
            <div>{el.name}</div>
          </VirtualItem>
        ))}
      </VirtualContainer>
    );
  },
});
