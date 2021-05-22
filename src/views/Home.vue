<template>
  <div id="home">
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
import { useRouter } from "vue-router";
import Search from "@/components/Search.vue";
import SearchList from "@/components/SearchList.vue";

export default {
  name: "Home",
  components: {
    Search,
    SearchList,
  },
  setup() {
    const router = useRouter();
    let generation = ref("");
    const spriteURL = ref(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
    );

    function getSelectedGeneration(gen) {
      generation.value = gen;
    }

    function showDetail(picked) {
      console.log(picked);
      router.push({ name: "ShowDetail", params: { id: picked.pokeID } });
    }

    return { generation, getSelectedGeneration, spriteURL, showDetail };
  },
};
</script>

<style scoped>
#home {
  border: 1px solid black;
  border-radius: 50px;
  background: #ffe;
  width: 75%;
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
  max-width: 100%;
}
</style>
