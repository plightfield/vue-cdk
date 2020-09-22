
import { defineComponent, ref, inject, onMounted, ComponentInternalInstance } from "vue";
import { OverlayService } from "./overlay_service";
import { FlexiblePositionStrategy } from "./position/flexible_position_strategy";
import { GlobalPositionStrategy } from "./position/global_position_strategy";
const Test = defineComponent({
  name: 'overlay-test',
  setup() {
    const service = inject(OverlayService.key)!;
    const target = ref<Element>();

    const strategy = new GlobalPositionStrategy().centerHorizontally().centerVertically();
    const globalOverlayRef = service.create({ strategy });
    const GlobalOverlay = globalOverlayRef.overlay;

    const click = () => {
      globalOverlayRef.attach();
    }

    const flexibleOverlayRef = service.create({
      strategy: new FlexiblePositionStrategy(target),
    });
    const FlexibleOverlay = flexibleOverlayRef.overlay;

    const clickFlexiblePosition = () => {
      flexibleOverlayRef.attach();
    };

    return () => (
      <>
        <button onClick={click} style="display: block;">click me</button>
        <div style="position:absolute; top:300px; left:300px; height:150vh;">
          <button
            ref={target}
            onClick={clickFlexiblePosition}
            style="display: block; position:absolute; top: 300px; left: 300px; width: 200px;"
          >click position</button>
        </div>
        <GlobalOverlay>
          <div>'this is test'</div>
        </GlobalOverlay>
        <FlexibleOverlay>
          <div style="background: red; position: absolute;height: 100px;width:100px">'this is flexible test'</div>
        </FlexibleOverlay>
      </>
    );
  }
});

export default Test;