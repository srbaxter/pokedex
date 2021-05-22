<template>
  <button @click="$router.back()" class="backButton">&lt; Back to List</button>

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
            <span class="cap">{{ thisPokemon.name }}</span> (#{{ id }})
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
import { toRefs, onMounted, ref } from "vue";
export default {
  name: "ShowDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { id } = toRefs(props);
    const loading = ref(true);
    const thisPokemon = ref({});

    async function fetchPokemon() {
      return await fetch(`https://pokeapi.co/api/v2/pokemon/${id.value}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          thisPokemon.value = data;
          loading.value = false;
        })
        .catch((err) => console.log(err));
    }

    onMounted(fetchPokemon);
    return { thisPokemon, loading };
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
  position: relative;
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
  cursor: pointer;
}
.heading img {
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 20px;
  padding: 10px;
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
