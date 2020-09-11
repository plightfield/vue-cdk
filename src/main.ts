import { createApp } from "vue";
import App from "./App.vue";
import lib from "../lib/index";
const app = createApp(App);
app.use(lib);
app.mount("#app");
