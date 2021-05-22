import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: "Home",
      component: () => import("./components/Home")
    },
    {
      path: '/snippet/:id',
      name: "SharedSnippet",
      component: () => import("./components/SharedSnippet")
    }
  ]
});


export default router

