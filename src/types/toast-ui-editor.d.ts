// src/types/toast-ui-editor.d.ts
import "toast-ui-editor";

declare module "toast-ui-editor" {
  interface Editor {
    getCurrentModeEditor(): {
      getRange?: () => [number, number];
      getSelection?: () => string | [number, number];
    };
  }
}
