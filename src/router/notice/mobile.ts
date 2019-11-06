export default [
    {
        path: '/ume/index',
        name: 'mobileindex',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "pc" */ '@/views/notice/platform/mobile/index.vue'),
    },
];
