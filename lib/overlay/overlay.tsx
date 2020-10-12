import {
  defineComponent,
  Teleport,
  renderSlot,
  onMounted,
  watch,
  reactive,
  CSSProperties,
  onUnmounted,
  watchEffect, 
  Transition, Ref, computed, inject, provide
} from "vue";
import './overlay_state.scss';
import { GlobalPositionStrategy } from './position/global_position_strategy';
import { PositionStrategy } from './position/position_strategy';


class OverlayProvider {
  div?: Element | null;
  constructor(document: Document) {
    let div = this.div = document.getElementById('vue-cdk-overlay');
    if (!div) {
      div = this.div = document.createElement('div');
      div.id = 'vue-cdk-overlay';
      div.className = 'vue-cdk-overlay-container';
      document.body.append(div);
    }
  }
}
const overlayProvider = new OverlayProvider(document);

/**
 * @description
 * overlay config.
 * 
 * @date 2020-09-14
 * @export
 * @interface OverlayConfig
 */
export interface OverlayConfig {
  readonly strategy: PositionStrategy;
  readonly hasBackdrop?: boolean;
  readonly backdropClose?: boolean;
  readonly backdropClick?: (() => void) | null;
  readonly backgroundBlock?: boolean;
  readonly backgroundClass?: string | string[];
  readonly backgroundColor?: string;
}

export interface OverlayProps {
  containerStyle: CSSProperties;
  positionedStyle: Ref<CSSProperties>;
}

export const Overlay = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: '',
    },
    strategy: {
      type: PositionStrategy,
      default: new GlobalPositionStrategy()
    },
    backgroundClass: {
      type: String,
      default: 'cdk-overlay-container__background'
    },
    hasBackdrop: {
      type: Boolean,
      default: true,
    },
    backdropClose: Boolean,
    backgroundBlock: Boolean,
    backdropClick: Function,
    panelClass: String,
  },
  setup(props, ctx) {
    inject('cdk-overlay-provider', overlayProvider);
    
    const state = reactive<{
      containerStyle: CSSProperties,
      positionedStyle: CSSProperties,
      wrapper?: Element,
    }>({
      containerStyle: {},
      positionedStyle: {}
    });


    const clickBackground = (event: Event) => {
      event.preventDefault();

      props.backdropClick?.();

      if (props.backdropClose ?? true) {
        ctx.emit('update:visible', false);
      }
    }

    const originOverflow = document.body.style.overflow;
    watchEffect((onInvalidate) => {
      if (props.backgroundBlock) {
        document.body.style.overflow = props.visible ? 'hidden' : originOverflow;
      }
      onInvalidate(() => {
        document.body.style.overflow = originOverflow;
      });
    });

    onMounted(() => {
      const overlayProps = props.strategy.setup();
      state.containerStyle = overlayProps!.containerStyle;
      state.positionedStyle = overlayProps!.positionedStyle.value;

      watch(overlayProps!.positionedStyle, (value) => {
        state.positionedStyle = value;
      });
    });

    onUnmounted(() => {
      props.strategy.dispose();
    });

    const containerClass = computed(() => {
      const clazz = ['cdk-overlay-container'];
      if(!props.hasBackdrop) {
        clazz.push('cdk-overlay-container__diabled');
      } else {
        clazz.push(props.backgroundClass);
      }
      return clazz;
    });

    return () => (
      <Teleport to="#vue-cdk-overlay">
        <Transition name="cdk-overlay-fade">
          <div v-show={props.visible}>
            <div
              ref={(ref) => state.wrapper = ref as Element}
              class={containerClass.value}
              style={state.containerStyle}
              onClick={clickBackground}
            >
              <div
                class={props.panelClass}
                style={state.positionedStyle}
                onClick={event => event.cancelBubble = true}
              >
                {renderSlot(ctx.slots, 'default')}
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    )
  }
});
