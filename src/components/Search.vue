<template>
  <div id="search">
    <label for="generation">Select a generation to search for Pokémon</label>
    <select v-model="generation" name="generation">
      <option value="" :selected="generation">Select One</option>
      <option
        v-for="gen in generations"
        :key="gen.name"
        :value="gen.name"
        :selected="generation"
      >
        {{ gen.readableName }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive, watch, toRefs } from "vue";
export default {
  name: "Search",
  emits: ["loaded"],
  props: {
    pokeURL: {
      type: String,
      required: true,
    },
    loadedGeneration: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const { loadedGeneration, pokeURL } = toRefs(props);
    const generation = ref("");
    let allGenerations = reactive([]);

    // if we have the loadedGeneration prop, set the generation search input to this value
    // this means we came from ShowDetail after picking a Pokemon
    if (loadedGeneration) {
      generation.value = loadedGeneration.value;
    }

    // async function that gets the list of generations
    // also sets this list in localStorage so we don't keep requesting from the API
    async function fetchGenerations() {
      return await fetch(`${pokeURL.value}generation`)
        .then((res) => res.json())
        .then((data) => {
          allGenerations.push(...data.results);
          localStorage.setItem(
            "generation-list",
            JSON.stringify(allGenerations)
          );
        })
        .catch((err) => console.log(err));
    }

    // check localStorage to see if we already have the list of generations
    // if so, set it. otherwise, call the async function once this component is mounted
    if (localStorage.getItem("generation-list")) {
      allGenerations = JSON.parse(localStorage.getItem("generation-list"));
    } else {
      onMounted(fetchGenerations);
    }

    // computed function to convert and display generation names to better readable ones
    const generations = computed(() => {
      const gens = [...allGenerations];
      return gens.map((gen, index) => {
        gen.readableName = `Generation ${index + 1}`;
        return gen;
      });
    });

    // if a new generation is selected, grab the change and emit "loaded" with the new generation
    watch(generation, (newGen) => {
      emit("loaded", newGen);
    });

    return { generation, generations };
  },
};
</script>

<style scoped>
#search {
  display: flex;
  align-items: center;
  flex-direction: column;
}
label {
  font-size: 1.5em;
  font-weight: bolder;
}
select {
  font-size: 1em;
  padding: 0.5em;
  width: 60%;
  max-width: 60%;
  margin: 15px auto 50px auto;
  border: 1px solid #aaa;
  border-radius: 0.5em;
}
@media (min-width: 800px) {
  select {
    width: 30%;
  }
}
</style>
