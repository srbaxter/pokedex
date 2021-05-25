import { flushPromises, shallowMount } from "@vue/test-utils";
import Search from "@/components/Search.vue";

const pURL = "https://pokeapi.co/api/v2/";

const fakeGenerations = {
  results: [
    { name: "generation-i", url: "https://pokeapi.co/api/v2/generation/1/" },
    { name: "generation-ii", url: "https://pokeapi.co/api/v2/generation/2/" },
  ],
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeGenerations),
  })
);

describe("Search.vue", () => {
  it("retrieves generation list", async () => {
    const wrapper = shallowMount(Search, {
      props: {
        pokeURL: pURL,
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/generation");

    await flushPromises();

    const gens = wrapper.vm.generations;
    expect(gens.length).toBe(2);
    expect(gens[0]).toHaveProperty("readableName");
    expect(gens[0].name).toBe("generation-i");
    expect(gens[0].readableName).toBe("Generation 1");
    expect(gens[1]).toHaveProperty("readableName");
    expect(gens[1].name).toBe("generation-ii");
    expect(gens[1].readableName).toBe("Generation 2");
    expect(wrapper.findAll("select > option").length).toBe(3);
  });

  it("use prop to select generation in list", async () => {
    localStorage.setItem(
      "generation-list",
      JSON.stringify(fakeGenerations.results)
    );

    const wrapper = shallowMount(Search, {
      props: {
        pokeURL: pURL,
        loadedGeneration: "1",
      },
    });

    expect(wrapper.vm.generation).toBe("1");
    expect(wrapper.vm.generations.length).toBe(2);
    expect(wrapper.findAll("select > option").length).toBe(3);
  });
});
