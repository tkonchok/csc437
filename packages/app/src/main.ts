import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";

import { Model, init } from "./model";
import update from "./update";

import { DraHeader } from "./components/dra-header";
import { HomeView } from "./views/home-view";
import { ProfileView } from "./views/profile-view";
import { LoginView } from "./views/login-view";
import { SignupView } from "./views/signup-view";
import { UploadView } from "./views/upload-view";
import { MessagesView } from "./views/messages-view";

define({
  "dra-header": DraHeader,
  "home-view": HomeView,
  "profile-view": ProfileView,
  "login-view": LoginView,
  "signup-view": SignupView,
  "upload-view": UploadView,
  "messages-view": MessagesView
});

// Routes
const routes = [
  { path: "/app/home", view: () => html`<home-view></home-view>` },
  { path: "/app/login", view: () => html`<login-view></login-view>` },
  { path: "/app/signup", view: () => html`<signup-view></signup-view>` },
  { path: "/app/upload", view: () => html`<upload-view></upload-view>` },
  { path: "/app/messages", view: () => html`<messages-view></messages-view>` },

  {
    path: "/app/profile/:username",
    view: (params) =>
      html`<profile-view username="${params.username}"></profile-view>`
  },

  { path: "/app", redirect: "/app/home" },
  { path: "/", redirect: "/app/home" }
];

define({
  "mu-history": History.Provider,
  "mu-auth": Auth.Provider,

  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "wave:history", "wave:auth");
    }
  },

  "mu-store": class AppStore extends Store.Provider<Model> {
    constructor() {
      super(update, init, "wave:auth");
    }
  }
});