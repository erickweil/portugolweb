import * as index from "./app.js";
import { declararClipboardPolyfill } from "./ace_editor/clipboard_polyfill.js";

window.index = index;
declararClipboardPolyfill();