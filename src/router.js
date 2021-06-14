import Vue from "vue";
import Router from "vue-router"
import VueMeta from "vue-meta";

Vue.use(Router);
Vue.use(VueMeta);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./components/pages/Home")
    },
    {
      path: "/snippet/:id",
      name: "SharedSnippet",
      component: () => import("./components/pages/SharedSnippet")
    },
    {
      path: "/not_found",
      name: "NotFound",
      component: () => import("./components/pages/NotFound")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "Home",
      redirect: "/",
      component: () => import("./components/pages/Home")
    }
  ]
});



export default router

