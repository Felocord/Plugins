import { storage } from "@vendetta/plugin";

import { Lang } from "$/lang";
import migrate from "$/migrate";

import patcher from "./stuff/patcher";

export const pluginsURL =
  "https://vd-plugins.github.io/proxy/plugins-full.json";

export const vstorage = storage as {
  pluginCache: string[];
};

export const lang = new Lang("plugin_browser");

let unpatch;
export default {
  onLoad: () => {
    migrate();
    vstorage.pluginCache ??= [];
    unpatch = patcher();
  },
  onUnload: () => (unpatch?.(), lang.unload()),
};
