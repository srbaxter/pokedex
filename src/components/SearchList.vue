<template>
  <div id="list">
    <h2>
      <span class="cap">{{ genName }}</span> Pokémon List
    </h2>
    <div class="filterSection">
      <label for="pokeSearch">Filter Results:</label>
      <input v-model="pokeSearch" type="text" name="pokeSearch" />
    </div>

    <div class="pokeList" v-if="!loading">
      <div
        v-for="pokemon in filteredPokemon"
        :key="pokemon.name"
        @click="emitPokemon(pokemon)"
        class="pokeGrid"
      >
        <img
          :src="pokemon.sprite"
          :alt="pokemon.name"
          width="100"
          height="100"
        />
        {{ pokemon.name }}
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { watch, onMounted, toRefs, ref, reactive, computed } from "vue";
export default {
  name: "SearchList",
  props: {
    selectedGeneration: {
      type: String,
      required: true,
    },
    pokeURL: {
      type: String,
      required: true,
    },
    spriteURL: {
      type: String,
      required: true,
    },
  },
  emits: ["selected"],
  setup(props, { emit }) {
    const { selectedGeneration, pokeURL, spriteURL } = toRefs(props);
    const genName = ref("");
    const loading = ref(true);
    const pokeSearch = ref("");

    const state = reactive({
      allPokemon: [],

      // watch the filter results search box for user input
      // if empty, use the async results we fetched
      // if input, filter down to Pokemon names that include the input
      filteredPokemon: computed(() => {
        if (pokeSearch.value !== "") {
          return state.allPokemon.filter((pick) =>
            pick.name.toLowerCase().includes(pokeSearch.value.toLowerCase())
          );
        } else {
          return state.allPokemon;
        }
      }),
    });

    // async function that gets the list of Pokemon for the selected generation
    // creates variables for the region name, Pokedex ID, sprite, and sorted list of Pokemon
    async function fetchGenList() {
      pokeSearch.value = "";
      return await fetch(
        `${pokeURL.value}generation/${selectedGeneration.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          genName.value = data.main_region.name;
          const tempPoke = [...data.pokemon_species].map((p) => {
            let pokeID = p.url
              .split("/")
              .filter((part) => part !== "")
              .pop();
            p.pokeID = pokeID;
            p.sprite = `${spriteURL.value}${pokeID}.png`;
            return p;
          });

          state.allPokemon = tempPoke.sort((a, b) => a.pokeID - b.pokeID);
          loading.value = false;
        })
        .catch((err) => console.log(err));
    }

    // run async function when component is mounted
    onMounted(fetchGenList);
    // run async function when selected generation is changed
    watch(selectedGeneration, fetchGenList);

    // emit function for selected generation
    function emitPokemon(pokemon) {
      emit("selected", pokemon);
    }

    return { genName, loading, emitPokemon, pokeSearch, ...toRefs(state) };
  },
};
</script>

<style scoped>
#list {
  border: 1px solid black;
  border-radius: 50px;
  background: #ffe;
  width: 90%;
  margin: 50px auto;
  box-shadow: 25px 25px darkred;
}
.cap {
  text-transform: capitalize;
}
h2 {
  margin-top: 50px;
}
.pokeList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 10px;
  width: 95%;
  max-width: 95%;
  margin: 20px auto;
}
.pokeList img {
  max-width: 100%;
}
.pokeGrid {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bolder;
  border-radius: 10px;
  border: 1px solid black;
  background-color: white;
  padding: 10px;
  text-transform: capitalize;
  cursor: pointer;
  max-width: 150px;
}
.filterSection label {
  margin: 0 10px;
  font-size: 1em;
}
.filterSection input {
  padding: 5px;
  font-size: 1em;
}
</style>
