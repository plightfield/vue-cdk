import { provide } from "vue";
import { getClassToken } from "../tools";
import Breakpoint from "./breakpoint";
import Bidirection from "./bidirection";
import Platform from "./platform";
import Clipboard from "./clipboard";

// provide token
export const platformToken = getClassToken(Platform);
export const breakpointToken = getClassToken(Breakpoint);
export const bidirectionToken = getClassToken(Bidirection);
export const clipboardToken = getClassToken(Clipboard);

/**
 * all the global apis will only have single instace
 * *use in this formation
 * * const xxx = inject(xxxToken)!
 * singleton for performance
 *
 * @export
 */
export default function () {
  provide(platformToken, new Platform());
  // ! order should be manage carefully
  // ! platform first
  provide(breakpointToken, new Breakpoint());
  provide(bidirectionToken, new Bidirection());
  provide(clipboardToken, new Clipboard());  
}
