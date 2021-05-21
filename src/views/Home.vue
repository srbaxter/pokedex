<template>
  <div class="home">
    <div class="header">
      <img
        alt="Pokeball"
        src="../assets/pokeball.png"
        id="Pokeball"
        width="100"
        height="100"
      />
      <h1>Pokédex</h1>
    </div>
    <Search @loaded="getSelectedGeneration" />
  </div>
  <SearchList v-if="generation !== ''" :selectedGeneration="generation" />
</template>

<script>
import { ref } from "vue";
import Search from "@/components/Search.vue";
import SearchList from "@/components/SearchList.vue";

export default {
  name: "Home",
  components: {
    Search,
    SearchList,
  },
  setup() {
    let generation = ref("");

    function getSelectedGeneration(gen) {
      generation.value = gen;
    }

    return { generation, getSelectedGeneration };
  },
};
</script>

<style scoped>
.home {
  border: 1px solid black;
  border-radius: 10%;
  background: #ffe;
  width: 60%;
  margin: 0 auto;
  box-shadow: 25px 25px lightgreen;
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
}
.header img {
  margin: 10px;
}
</style>
