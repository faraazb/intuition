import RefreshRuntime from "/@react-refresh";

if (import.meta.hot && typeof window !== "undefined") {
  try {
    RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;
    window.__vite_plugin_react_preamble_installed__ = true;
  } catch (err) {
    console.log("React referesh:", err);
  }
}
