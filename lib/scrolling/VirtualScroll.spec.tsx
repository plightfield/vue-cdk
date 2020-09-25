import VirtualContainer from "./VirtualContainer";
import { defineComponent } from "vue";
import VirtualScroll, { VirtualItemData } from "./virtualScroll";

export default defineComponent({
  name: "virtual-scroll-spec",
  setup() {
    const arr: VirtualItemData[] = [];
    for (let i = 0; i < 1000000; i++) {
      arr.push({ name: "test" });
    }
    const virtualScroll = new VirtualScroll(arr);
    virtualScroll.defaultHeight = 40;
    return () => (
      <VirtualContainer style='height:200px'>
        {virtualScroll.displayItems.map((el, key) => (
          <div
            key={key}
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "1em",
              height: virtualScroll.getHeight(key),
            }}
          >
            {el.name}
          </div>
        ))}
      </VirtualContainer>
    );
  },
});
