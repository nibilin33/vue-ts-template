// @ts-nocheck
import Vue from 'vue';
import Router from 'vue-router';
{{libs}}
{{plugin}}
Vue.use(Router);
const router = new Router({
    mode: 'history',
    base:__dirname,
    routes: {{routers}}
});
router.beforeEach((to, from, next) => {
    console.log(from.path, to.path)
   if(!to.path.includes('/ume')){
       next(Object.assign({}, to, {
           path: `/ume${to.path}`,
           replace: true
       }))
   }else{
       next();
   }
});
export default router;
    