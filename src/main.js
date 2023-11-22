import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

// bootstrap setting
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const app = createApp(App);

//pinia-plugin-persistedstate 사용을 위함
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);

app.mount("#app");
