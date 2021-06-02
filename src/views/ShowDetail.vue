<template>
  <button @click="goBack" class="backButton">&lt; Back to List</button>
  <div id="detail">
    <div v-if="!loading">
      <div v-if="thisPokemon">
        <div class="heading">
          <img
            :src="thisPokemon.sprites.front_default"
            :alt="thisPokemon.name"
            width="200"
          />
          <h1>
            <span class="cap">{{ thisPokemon.name }}</span> (#{{
              $route.params.id
            }})
          </h1>
        </div>
        <div class="typesSection">
          <div
            v-for="type in thisPokemon.types"
            :key="type.type.name"
            class="pokeTypes"
          >
            {{ type.type.name }}
          </div>
        </div>
        <div class="statsSection">
          <div
            v-for="stat in thisPokemon.stats"
            :key="stat.stat.name"
            class="pokeStats"
          >
            <div class="statName">{{ stat.stat.name }}</div>
            <div class="statValue">{{ stat.base_stat }}</div>
          </div>
        </div>
      </div>
      <div v-else>No Pokémon found with this ID!</div>
    </div>
    <div v-else>Loading..</div>
  </div>
</template>

<script>
import { toRefs, onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "ShowDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
    generation: {
      type: String,
      required: true,
    },
    pokeURL: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { generation, pokeURL } = toRefs(props);
    const router = useRouter();
    const route = useRoute();
    const loading = ref(true);
    const state = reactive({
      thisPokemon: {},
    });

    // async function that gets the details for the selected Pokemon
    async function fetchPokemon() {
      return await fetch(`${pokeURL.value}pokemon/${route.params.id}`)
        .then((res) => res.json())
        .then((data) => {
          state.thisPokemon = data;
          loading.value = false;
        })
        .catch((err) => console.log(err));
    }

    // run async function when component is mounted
    onMounted(fetchPokemon);

    // use the Router to go back to the SearchList when the Back button is clicked
    // send along which generation we were on so we can reload that list
    function goBack() {
      router.push({
        name: "Generation",
        params: { gen: generation.value },
      });
    }

    return { loading, goBack, ...toRefs(state) };
  },
};
</script>

<style scoped>
#detail {
  border: 1px solid black;
  border-radius: 50px;
  background: #ffe;
  width: 75%;
  margin: 0 auto;
  box-shadow: 25px 25px darkred;
}
.cap {
  text-transform: capitalize;
}
.backButton {
  background-color: darkred;
  padding: 20px;
  border: 1px solid darkred;
  margin: 5px;
  color: white;
  font-weight: bolder;
  font-size: 1.2em;
  cursor: pointer;
}
.heading img {
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 20px;
  padding: 10px;
  max-width: 100%;
}
.typesSection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
  grid-gap: 10px;
  width: 50%;
  max-width: 300px;
  margin: 20px auto;
}
.pokeTypes {
  background-color: darkslategray;
  border-radius: 10px;
  border: 1px solid darkslategray;
  color: white;
  font-weight: bolder;
  padding: 10px 0;
  max-width: 300px;
}
.statsSection {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  margin: 25px auto;
}
.pokeStats {
  border-bottom: 2px solid black;
  padding: 5px 0;
  width: 80%;
  max-width: 400px;
  margin-bottom: 10px;
}
.statName {
  float: left;
}
.statValue {
  float: right;
}
</style>
