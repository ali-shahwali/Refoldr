import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./components/Home")
    },
    {
      path: "/snippet/:id",
      name: "SharedSnippet",
      component: () => import("./components/SharedSnippet")
    },
    {
      path: "/not_found",
      name: "NotFound",
      component: () => import("./components/NotFound")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "Home",
      redirect: "/",
      component: () => import("./components/Home")
    }
  ]
});



export default router

