import { CSSProperties, Ref } from "vue";

export interface OverlayProps {
  containerStyle: CSSProperties;
  positionedStyle: Ref<CSSProperties>;
}
