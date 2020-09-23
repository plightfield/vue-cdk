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

// provide in single formation
export default function () {
  provide(platformToken, new Platform());
  // ! order should be manage carefully
  // ! platform first
  provide(breakpointToken, new Breakpoint());
  provide(bidirectionToken, new Bidirection());
  provide(clipboardToken, new Clipboard());
}
