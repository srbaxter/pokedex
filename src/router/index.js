import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ShowDetail from "../views/ShowDetail.vue";

const routes = [
  {
    // main page with everything
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    // moving from ShowDetail back to SearchList by clicking Back button
    path: "/generation/:gen",
    name: "Generation",
    component: Home,
    props: true,
  },
  {
    // moving from SearchList to ShowDetail after picking a Pokemon
    path: "/generation/:generation/pokemon/:id",
    name: "ShowDetail",
    component: ShowDetail,
    props: true,
  },
  {
    // move home for any other URLs and clear URL parameters
    path: "/:pathMatch(.*)*",
    beforeEnter: (to, from, next) => {
      next("/");
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
