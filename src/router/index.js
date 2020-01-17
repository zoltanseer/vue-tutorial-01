import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import AddSmoothie from "../views/AddSmoothie.vue";
import EditSmoothie from "../views/EditSmoothie.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index
  },
  {
    path: "/add-smoothie",
    name: "addSmoothie",
    component: AddSmoothie
  },
  {
    path: "/edit-smoothie/:slug",
    name: "editSmoothie",
    component: EditSmoothie
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
