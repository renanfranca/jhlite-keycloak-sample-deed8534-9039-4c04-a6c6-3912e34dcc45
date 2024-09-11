import { createApp } from 'vue';
import AppVue from './AppVue.vue';
import router from './router';
import { provideForAuth } from '@/auth/application/AuthProvider';
import { setupAxiosInterceptors } from '@/shared/http/infrastructure/secondary/AxiosAuthInterceptor';
import { KeycloakHttp } from '@/auth/infrastructure/secondary/KeycloakHttp';
import axios from 'axios';
// jhipster-needle-main-ts-import

const app = createApp(AppVue);

const keycloakHttp = new KeycloakHttp({
  url: 'https://localhost:9443',
  realm: 'jhipster',
  clientId: 'web_app'
});

provideForAuth(keycloakHttp);

setupAxiosInterceptors(axios);

app.use(router);
// jhipster-needle-main-ts-provider
app.mount('#app');
