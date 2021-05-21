<template>
  <div class="home">
    <div class="header">
      <img
        alt="Pokéball"
        src="../assets/pokeball.png"
        id="Pokeball"
        width="100"
        height="100"
      />
      <h1>Pokédex</h1>
    </div>
    <Search @loaded="getSelectedGeneration" />
  </div>
  <SearchList
    v-if="generation !== ''"
    :selectedGeneration="generation"
    :spriteURL="spriteURL"
    @selected="showDetail"
  />
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
    const spriteURL = ref(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
    );

    function getSelectedGeneration(gen) {
      generation.value = gen;
    }

    function showDetail(picked) {
      console.log(picked);
    }

    return { generation, getSelectedGeneration, spriteURL, showDetail };
  },
};
</script>

<style scoped>
.home {
  border: 1px solid black;
  border-radius: 50px;
  background: #ffe;
  width: 60%;
  margin: 0 auto;
  box-shadow: 25px 25px darkred;
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
