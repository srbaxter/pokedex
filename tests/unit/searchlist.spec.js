import { flushPromises, shallowMount } from "@vue/test-utils";
import SearchList from "@/components/SearchList.vue";

const pURL = "https://pokeapi.co/api/v2/";
const sURL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const fakeGeneration = {
  main_region: {
    name: "Kanto",
    region: "https://pokeapi.co/api/v2/region/1/",
  },
  pokemon_species: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon-species/4/" },
    { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon-species/7/" },
  ],
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeGeneration),
  })
);

describe("SearchList.vue", () => {
  it("retrieves list of Pokemon for selected generation", async () => {
    const c = shallowMount(SearchList, {
      props: {
        pokeURL: pURL,
        spriteURL: sURL,
        selectedGeneration: "generation-i",
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/generation/generation-i"
    );

    await flushPromises();

    expect(c.vm.genName).toBe("Kanto");

    const poke = c.vm.filteredPokemon;
    expect(poke.length).toBe(3);

    expect(poke[0]).toHaveProperty("name");
    expect(poke[0]).toHaveProperty("url");
    expect(poke[0]).toHaveProperty("pokeID");
    expect(poke[0]).toHaveProperty("sprite");
    expect(poke[0].name).toBe("bulbasaur");
    expect(poke[0].url).toBe("https://pokeapi.co/api/v2/pokemon-species/1/");
    expect(poke[0].pokeID).toBe("1");
    expect(poke[0].sprite).toBe(`${sURL}${poke[0].pokeID}.png`);

    expect(poke[1]).toHaveProperty("name");
    expect(poke[1]).toHaveProperty("url");
    expect(poke[1]).toHaveProperty("pokeID");
    expect(poke[1]).toHaveProperty("sprite");
    expect(poke[1].name).toBe("charmander");
    expect(poke[1].url).toBe("https://pokeapi.co/api/v2/pokemon-species/4/");
    expect(poke[1].pokeID).toBe("4");
    expect(poke[1].sprite).toBe(`${sURL}${poke[1].pokeID}.png`);

    expect(poke[2]).toHaveProperty("name");
    expect(poke[2]).toHaveProperty("url");
    expect(poke[2]).toHaveProperty("pokeID");
    expect(poke[2]).toHaveProperty("sprite");
    expect(poke[2].name).toBe("squirtle");
    expect(poke[2].url).toBe("https://pokeapi.co/api/v2/pokemon-species/7/");
    expect(poke[2].pokeID).toBe("7");
    expect(poke[2].sprite).toBe(`${sURL}${poke[2].pokeID}.png`);
  });
});
