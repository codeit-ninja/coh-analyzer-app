/* eslint-disable */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module "*.svg" {
    const content: any;
    export default content;
}

declare module 'vue-next-heroicons/*';
declare module 'uuid';
declare module 'steam-web';