import {h, Teleport, defineComponent} from 'vue';
import { OverlayProps } from './OverlayProps';

export class OverlayState {

  constructor(private config?: OverlayProps) {
  }

  insert(componentConstructor: ReturnType<typeof defineComponent>) {
    const component = new componentConstructor();
  }
}


