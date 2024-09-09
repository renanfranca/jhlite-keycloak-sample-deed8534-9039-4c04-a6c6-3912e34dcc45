import { createApp } from 'vue';
import AppVue from './AppVue.vue';
import router from './router';
import { provideForAuth } from '@/auth/application/AuthProvider';
import { setupAxiosInterceptors } from '@/shared/http/infrastructure/secondary/AxiosAuthInterceptor';
// jhipster-needle-main-ts-import

const app = createApp(AppVue);

provideForAuth();

setupAxiosInterceptors();

app.use(router);
// jhipster-needle-main-ts-provider
app.mount('#app');
