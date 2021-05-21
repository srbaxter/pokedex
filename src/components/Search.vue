<template>
  <div id="search">
    <label>Select a generation to search for Pokémon</label>
    <select v-model="generation" name="generation" @change="genChange">
      <option value="" :selected="generation">Select One</option>
      <option v-for="gen in generations" :key="gen.name" :value="gen.name">
        {{ gen.readableName }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive, watch } from "vue";
export default {
  name: "Search",
  emits: ["loaded"],
  setup(props, { emit }) {
    const generation = ref("");
    const allGenerations = reactive([]);
    async function fetchGenerations() {
      return await fetch("https://pokeapi.co/api/v2/generation")
        .then((res) => res.json())
        .then((data) => allGenerations.push(...data.results))
        .catch((err) => console.log(err));
    }
    onMounted(fetchGenerations);
    const generations = computed(() => {
      const gens = [...allGenerations];
      return gens.map((gen, index) => {
        gen.readableName = `Generation ${index + 1}`;
        return gen;
      });
    });

    watch(generation, (newGen) => {
      emit("loaded", newGen);
    });
    // const genChange = (event) => emit("loaded", event.target.value);

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
select {
  font-size: 16px;
  padding: 0.5em;
  width: 20%;
  max-width: 20%;
  margin: 15px auto 50px auto;
  border: 1px solid #aaa;
  border-radius: 0.5em;
}
label {
  font-weight: bolder;
}
</style>
