import { createApp } from "vue";
import App from "./App";
import lib from "../lib/index";
const app = createApp(App);
app.use(lib);
app.mount("#app");
