import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import RadioButton from "primevue/radiobutton";
import Slider from "primevue/slider";
import Checkbox from "primevue/checkbox";

// css
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import "./assets/tailwind.css";

const app = createApp(App);
app.component("Button", Button);
app.component("Dropdown", Dropdown);
app.component("InputNumber", InputNumber);
app.component("RadioButton", RadioButton);
app.component("Slider", Slider);
app.component("Checkbox", Checkbox);
app.use(PrimeVue);
app.mount("#app");
