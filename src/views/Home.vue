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

    <Search
      :pokeURL="pokeURL"
      :loadedGeneration="generation"
      @loaded="getSelectedGeneration"
    />
  </div>

  <SearchList
    v-if="generation !== ''"
    :selectedGeneration="generation"
    :pokeURL="pokeURL"
    :spriteURL="spriteURL"
    @selected="showDetail"
  />
</template>

<script>
import { ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import Search from "@/components/Search.vue";
import SearchList from "@/components/SearchList.vue";

export default {
  name: "Home",
  components: {
    Search,
    SearchList,
  },
  props: {
    gen: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const { gen } = toRefs(props);
    const pokeURL = ref("https://pokeapi.co/api/v2/");
    const spriteURL = ref(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
    );
    let generation = ref("");

    // if we have the gen prop, set the generation search input to this value
    // this means we came from ShowDetail after picking a Pokemon
    // this will let us load up whatever generation was previously selected
    if (gen) {
      generation.value = gen.value;
    }

    // we picked a generation from the search input
    // this comes from an emit function on Search
    function getSelectedGeneration(gen) {
      generation.value = gen;
    }

    // we picked a Pokemon, push information to ShowDetail via Router
    function showDetail(picked) {
      router.push({
        name: "ShowDetail",
        params: {
          id: picked.pokeID,
          generation: generation.value,
          pokeURL: pokeURL.value,
        },
      });
    }

    // return all of our needed variables
    return {
      generation,
      getSelectedGeneration,
      spriteURL,
      showDetail,
      pokeURL,
    };
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
