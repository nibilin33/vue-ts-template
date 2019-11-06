export default [
    {
        path: '/ume/index',
        name: 'pcindex',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "pc" */ '@/views/notice/platform/pc/app.vue'),
        redirect: '/ume/notice',
        children: [
            {
                path: '/ume/notice',
                component: () => import(/* webpackChunkName: "notice" */ '@/views/notice/platform/pc/index.vue'),
            },
        ],
    },
];
