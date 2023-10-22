import pkg from "../package.json";

const sharedManifest = {
  // content_scripts: [
  //   {
  //     js: ["src/contentScript/primary/main.jsx"],
  //     matches: ["*://*/*"],
  //   },
  // ],
  // icons: {
  //   16: "icons/16.png",
  //   19: "icons/19.png",
  //   32: "icons/32.png",
  //   38: "icons/38.png",
  //   48: "icons/48.png",
  //   64: "icons/64.png",
  //   96: "icons/96.png",
  //   128: "icons/128.png",
  //   256: "icons/256.png",
  //   512: "icons/512.png",
  // },
  // options_ui: {
  //   page: "src/options/index.html",
  //   open_in_tab: true,
  // },
  permissions: ["storage", "identity", "cookies", "tabs"],
};

const browserAction = {
  // default_icon: {
  //   16: "icons/16.png",
  //   19: "icons/19.png",
  //   32: "icons/32.png",
  //   38: "icons/38.png",
  // },
  default_popup: "src/ui/popup/index.html",
};


const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  host_permissions: ["*://*.notion.so/"],
};

const chromiumManifest = {
  background: {
    service_worker: "src/scripts/background.js",
  },
}

const firefoxManifest = {
  background: {
    scripts: ["src/scripts/background.js"],
  },
}

const MANIFEST_VERSION = 3;

export function getManifest(browser) {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
  };

  let browserManifest = browser === "firefox" ? firefoxManifest : chromiumManifest;;

  return {
    ...manifest,
    ...ManifestV3,
    ...browserManifest,
    manifest_version: MANIFEST_VERSION,
  };
}
