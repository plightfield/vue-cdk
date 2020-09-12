
import { defineComponent, ref, inject } from "vue";
import { GlobalPositionStrategy } from "./position/GlobalPositionStrategy";
import {OverlayService} from './OverlayService'
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