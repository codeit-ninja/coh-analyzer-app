import { vue, registerAuthProvider, router } from './modules/core.module';
import { AuthUser } from '@/modules/authentication/AuthUser';

import './assets/style.scss';
import { getStorageItem } from './functions/helpers';

(async() => {
    vue.use(router);
    vue.mount('#app');

    router.beforeEach((to, from, next) => {
        if( ! getStorageItem('APP_STEAM_ID') && to.name !== 'Installation' ) {
            next({ name: 'Installation' });
        } else {
            next();
        }
    });

    registerAuthProvider(await AuthUser.startup());
    //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
})();