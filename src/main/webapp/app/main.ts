import { createApp } from 'vue';
import AppVue from './AppVue.vue';
import router from './router';
import { provideForAuth } from '@/auth/application/AuthProvider';
import { setupAxiosInterceptors } from '@/shared/http/infrastructure/secondary/AxiosAuthInterceptor';
import Keycloak from 'keycloak-js';
// jhipster-needle-main-ts-import

const app = createApp(AppVue);

const keycloak = new Keycloak({
  url: 'https://localhost:9443',
  realm: 'jhipster',
  clientId: 'web_app'
});

provideForAuth(keycloak);

setupAxiosInterceptors();

app.use(router);
// jhipster-needle-main-ts-provider
app.mount('#app');
