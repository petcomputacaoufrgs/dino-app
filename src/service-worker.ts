//#region WB_MANIFEST
interface WBManifest {
  __WB_MANIFEST: any
}

(self as WBManifest & Window & typeof globalThis).__WB_MANIFEST
//#endregion
import Teste from './service_worker/Teste'

export {}