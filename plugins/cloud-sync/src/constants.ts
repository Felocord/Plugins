import constants from "$/constants";

import { vstorage } from ".";
import { redirectRoute } from "./stuff/api";

export const defaultHost = "https://cloudsync.felo.gg/";
export const defaultClientId = "1264933454768902176";

const api = () =>
  vstorage.custom.host
    ? !vstorage.custom.host.endsWith("/")
      ? `${vstorage.custom.host}/`
      : vstorage.custom.host
    : defaultHost;

export default {
  get api() {
    return api();
  },
  raw: `${constants.github.raw}plugins/cloud-sync/`,
  oauth2: {
    get clientId() {
      return vstorage.custom.clientId || defaultClientId;
    },
    get redirectURL() {
      return `${api()}${redirectRoute}`;
    },
  },
};
