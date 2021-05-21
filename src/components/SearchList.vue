<template>
  <div id="list">
    <h2>
      <span class="cap">{{ genName }}</span> Pokémon List
    </h2>
    <div class="pokeList" v-if="!loading">
      <div
        v-for="pokemon in allPokemon"
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
import { watch, onMounted, toRefs, ref } from "vue";
export default {
  name: "SearchList",
  props: {
    selectedGeneration: {
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
    const { selectedGeneration, spriteURL } = toRefs(props);
    const allPokemon = ref([]);
    const genName = ref("");
    const loading = ref(true);

    async function fetchGenList() {
      return await fetch(
        `https://pokeapi.co/api/v2/generation/${selectedGeneration.value}`
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

          allPokemon.value = tempPoke.sort((a, b) => a.pokeID - b.pokeID);

          loading.value = false;
        })
        .catch((err) => console.log(err));
    }

    onMounted(fetchGenList);
    watch(selectedGeneration, fetchGenList);

    function emitPokemon(pokemon) {
      emit("selected", pokemon);
    }

    return { allPokemon, genName, loading, emitPokemon };
  },
};
</script>

<style scoped>
#list {
  border: 1px solid black;
  border-radius: 50px;
  background: #ffe;
  width: 80%;
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 10px;
  width: 95%;
  max-width: 95%;
  margin: 10px auto;
}
.pokeGrid {
  font-weight: bolder;
  border: 1px solid black;
  background-color: white;
  padding: 10px;
  text-transform: capitalize;
  cursor: pointer;
}
</style>
