import { shallowMount, mount, flushPromises } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import ShowDetail from "@/views/ShowDetail.vue";

const pURL = "https://pokeapi.co/api/v2/";
const sURL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // moving from SearchList to ShowDetail after picking a Pokemon
      path: "/generation/:generation/pokemon/:id",
      name: "ShowDetail",
      component: ShowDetail,
      props: true,
    },
  ],
});

const fakePokemon = {
  name: "bulbasaur",
  sprites: [{ front_default: `${sURL}1.png` }],
  types: [
    {
      type: {
        name: "grass",
      },
    },
    {
      type: {
        name: "poison",
      },
    },
  ],
  stats: [
    {
      base_stat: 45,
      stat: {
        name: "hp",
      },
    },
    {
      base_stat: 49,
      stat: {
        name: "attack",
      },
    },
    {
      base_stat: 49,
      stat: {
        name: "defense",
      },
    },
  ],
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakePokemon),
  })
);

describe("ShowDetail.vue", () => {
  it("checks that all parts of a selected Pokemon have been returned", async () => {
    router.push("/generation/generation-i/pokemon/1");
    await router.isReady();

    const c = mount(ShowDetail, {
      global: {
        plugins: [router],
      },
      props: {
        id: "1",
        generation: "generation-i",
        pokeURL: pURL,
      },
    });

    expect(c.vm.loading).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${pURL}pokemon/1`);
    await flushPromises();
    expect(c.vm.loading).toBe(false);

    const poke = c.vm.thisPokemon;

    expect(poke.name).toBe("bulbasaur");
    expect(poke).toHaveProperty("sprites");
    expect(poke.sprites[0]).toHaveProperty("front_default");
    expect(poke.stats.length).toBe(3);
    expect(poke.types.length).toBe(2);

    expect(poke.stats[0]).toHaveProperty("base_stat");
    expect(poke.stats[0]).toHaveProperty("stat");
    expect(poke.stats[0].stat).toHaveProperty("name");
    expect(poke.stats[0].base_stat).toBe(45);
    expect(poke.stats[0].stat.name).toBe("hp");

    expect(poke.types[0]).toHaveProperty("type");
    expect(poke.types[0].type).toHaveProperty("name");
    expect(poke.types[0].type.name).toBe("grass");
  });

  it("checks for button with text Back to List", async () => {
    router.push("/generation/generation-i/pokemon/1");
    await router.isReady();

    const c = shallowMount(ShowDetail, {
      global: {
        plugins: [router],
      },
      props: {
        id: "1",
        generation: "generation-i",
        pokeURL: pURL,
      },
    });

    await flushPromises();

    expect(c.text()).toContain("Back to List");
    expect(c.html()).toContain("button");
  });
});
