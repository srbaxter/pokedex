import { shallowMount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
  ],
});

describe("Home.vue", () => {
  it("checks for h1 and img", async () => {
    router.push("/");
    await router.isReady();

    const c = shallowMount(Home, {
      global: {
        plugins: [router],
      },
    });

    expect(c.text()).toContain("Pokédex");
    expect(c.html()).toContain("img");
  });
});
