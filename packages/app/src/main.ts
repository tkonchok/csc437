import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";

import { html } from "lit";
import { DraHeader } from "./components/dra-header";
import { HomeView } from "./views/home-view";

const routes = [
  {
    path: "/app/home",
    view: () => html`<home-view></home-view>`
  },
  {
    path: "/app",
    redirect: "/app/home"
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "dra-header": DraHeader,
  "home-view": HomeView,

  "mu-history": History.Provider,
  "mu-auth": Auth.Provider,

  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "wave:history", "wave:auth");
    }
  }
});