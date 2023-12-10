// TODO find a way to determine the relative path
// to devtools.js
const DEVTOOLS_BACKEND_SCRIPT = "devtools.js";

export const injectReactDevTools = () => {
  return {
    name: "inject-react-devtools",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "module", src: DEVTOOLS_BACKEND_SCRIPT },
        },
      ];
    },
    apply(_config, { mode }) {
      return mode !== "production";
    },
  };
};
