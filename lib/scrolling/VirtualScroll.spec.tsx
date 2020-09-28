import { defineComponent } from "vue";
import VirtualContainer from "./VirtualContainer";
import VirtualScroll from "./virtualScroll";

export default defineComponent({
  name: "virtual-scroll-spec",
  setup() {
    const arr: any[] = [];
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
              height: el._itemHeight || el._defaultHeight,
            }}
          >
            {el.name}
          </div>
        ))}
      </VirtualContainer>
    );
  },
});
