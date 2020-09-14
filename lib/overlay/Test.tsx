
import { defineComponent, ref, inject } from "vue";
import { OverlayService } from "./overlay_service";
import { GlobalPositionStrategy } from "./position/global_position_strategy";
const Test = defineComponent({
  setup() {
    const service = inject(OverlayService.key);

    const strategy = new GlobalPositionStrategy().centerHorizontally().centerVertically();
    const overlayRef = service.create({strategy, backdropClose: true});
    const Overlay = overlayRef.overlay;

    const click = () => {
      overlayRef.attach();
    }

    return () => (
      <>
        <button onClick={click}>click me</button>
        <Overlay>
          {() => (<div>'this is test'</div>)}
        </Overlay>
      </>
    );
  }
});

export default Test;