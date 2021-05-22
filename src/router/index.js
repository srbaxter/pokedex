import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ShowDetail from "../views/ShowDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/pokemon/:id",
    name: "ShowDetail",
    component: ShowDetail,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
