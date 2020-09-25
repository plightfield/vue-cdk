
import { defineComponent, ref, inject } from "vue";
import { overlayToken } from '.';
import { FlexiblePositionStrategy } from "./position/flexible_position_strategy";
import { GlobalPositionStrategy } from "./position/global_position_strategy";

const ButtonWidget = defineComponent({
  name: 'button-widget',
  props: ['onClick'],
  setup(props, context) {
    return () => (
      <>
        <button onClick={() => props.onClick?.()}>click component</button>
      </>
    )
  }
});

export default defineComponent({
  name: 'overlay-test',
  setup(_, ctx) {
    const service = inject(overlayToken)!;
    const target = ref<Element>();
    const buttonWidget = ref();

    const globalOverlayState = service.create({ 
      strategy: service.createPositionStrategy('global').centerHorizontally().centerVertically() 
    });
    const GlobalOverlay = globalOverlayState.element;

    const click = () => {
      globalOverlayState.attach();
    }

    const flexibleOverlayState1 = service.create({
      strategy: service.createPositionStrategy('flexible', target),
    });
    const FlexibleOverlay1 = flexibleOverlayState1.element;

    const clickFlexiblePosition1 = () => {
      flexibleOverlayState1.attach();
    };

    const flexibleOverlayState2 = service.create({
      strategy: service.createPositionStrategy('flexible', buttonWidget),
    });
    const FlexibleOverlay2 = flexibleOverlayState2.element;

    const clickFlexiblePosition2 = () => {
      flexibleOverlayState2.attach();
    };

    return () => (
      <>
        <button onClick={click} style="display: block;" class="">click me</button>
        <div style="position:absolute; top:300px; left:300px; height:150vh;">
          <button
            ref={target}
            onClick={clickFlexiblePosition1}
            style="display: block; position: absolute; top: 300px; left: 300px; width: 200px;"
          >click flexible position</button>
        </div>
        <ButtonWidget 
          ref={buttonWidget}
          onClick={clickFlexiblePosition2}
        ></ButtonWidget>
        <GlobalOverlay>
          <div>'this is test'</div>
        </GlobalOverlay>
        <FlexibleOverlay1>
           <div style="background: red; position: absolute;height: 100px; width:100px;">'this is flexible test 1'</div>
        </FlexibleOverlay1>
        <FlexibleOverlay2>
          <div style="background: red; position: absolute;height: 100px; width:100px;">'this is flexible test 2'</div>
        </FlexibleOverlay2>
      </>
    );
  }
});