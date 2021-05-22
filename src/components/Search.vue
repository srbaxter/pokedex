<template>
  <div id="search">
    <label for="generation">Select a generation to search for Pokémon</label>
    <select v-model="generation" name="generation">
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
    let allGenerations = reactive([]);

    async function fetchGenerations() {
      return await fetch("https://pokeapi.co/api/v2/generation")
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

    if (localStorage.getItem("generation-list")) {
      allGenerations = JSON.parse(localStorage.getItem("generation-list"));
    } else {
      onMounted(fetchGenerations);
    }

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
