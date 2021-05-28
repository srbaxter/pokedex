import { flushPromises, shallowMount } from "@vue/test-utils";
import Search from "@/components/Search.vue";

const pURL = "https://pokeapi.co/api/v2/";

const fakeGenerations = {
  results: [
    { name: "generation-i", url: `${pURL}generation/1/` },
    { name: "generation-ii", url: `${pURL}generation/2/` },
  ],
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeGenerations),
  })
);

describe("Search.vue", () => {
  it("retrieves generation list", async () => {
    const c = shallowMount(Search, {
      props: {
        pokeURL: pURL,
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${pURL}generation`);

    await flushPromises();

    const gens = c.vm.generations;
    expect(gens.length).toBe(2);
    expect(gens[0]).toHaveProperty("readableName");
    expect(gens[0].name).toBe("generation-i");
    expect(gens[0].readableName).toBe("Generation 1");
    expect(gens[1]).toHaveProperty("readableName");
    expect(gens[1].name).toBe("generation-ii");
    expect(gens[1].readableName).toBe("Generation 2");
    expect(c.findAll("select > option").length).toBe(3);
  });

  it("use prop with localStorage to select generation in list", async () => {
    localStorage.setItem(
      "generation-list",
      JSON.stringify(fakeGenerations.results)
    );

    const c = shallowMount(Search, {
      props: {
        pokeURL: pURL,
        loadedGeneration: "generation-i",
      },
    });

    expect(c.vm.generation).toBe("generation-i");
    expect(c.vm.generations.length).toBe(2);
    expect(c.findAll("select > option").length).toBe(3);

    localStorage.removeItem("generation-list");
  });

  it("check for emit loaded by picking a generation", async () => {
    localStorage.setItem(
      "generation-list",
      JSON.stringify(fakeGenerations.results)
    );

    const c = shallowMount(Search, {
      props: {
        pokeURL: pURL,
      },
    });

    expect(c.vm.generations.length).toBe(2);
    expect(c.findAll("select > option").length).toBe(3);

    await c.find("select").setValue("");
    expect(c.find("select").element.value).toBe("");
    expect(c.vm.generation).toBe("");
    expect(c.emitted()).not.toHaveProperty("loaded");

    await c.find("select").setValue("generation-i");
    expect(c.find("select").element.value).toBe("generation-i");
    expect(c.vm.generation).toBe("generation-i");
    expect(c.emitted()).toHaveProperty("loaded");

    localStorage.removeItem("generation-list");
  });
});
