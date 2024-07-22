import { createJSONStorage, persist } from "zustand/middleware";

import constants from "$/constants";
import { RNMMKVManager, zustand } from "$/deps";

import { LangValues } from "../../lang/defs";

interface LangState {
  values: Record<string, Record<string, string>>;
  lastModified: string | null;
  update: (plugin: keyof LangValues) => Promise<void>;
}

export const useLangStore = zustand.create<
  LangState,
  [
    [
      "zustand/persist",
      { values: LangState["values"]; lastModified: LangState["lastModified"] },
    ],
  ]
>(
  persist(
    (set, get) => ({
      values: {},
      lastModified: null,
      update: async (plugin: keyof LangValues) => {
        if (DEV_LANG)
          return set({
            values: DEV_LANG,
            lastModified: null,
          });

        const res = await fetch(
          `${constants.github.raw}lang/values/${plugin}.json`,
          {
            headers: {
              "if-modified-since": get().lastModified,
            },
          },
        );
        if (!res.ok) return;

        const values = await res.json();
        set({
          lastModified: res.headers.get("last-modified"),
          values,
        });
      },
    }),
    {
      name: "Felocord-lang",
      storage: createJSONStorage(() => RNMMKVManager),
      partialize: (state) => ({
        values: state.values,
        lastModified: state.lastModified,
      }),
      onRehydrateStorage: () => () => RNMMKVManager.removeItem("Felocord-lang"),
    },
  ),
);
