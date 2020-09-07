<!-- страница репозитория -->
<template>
  <div>
    <img class='avatar' v-bind:src="repoDetails.owner.avatar_url" />
    <h1>{{repoDetails.name}}</h1>
    <p>
      <b>Stars: </b> {{repoDetails.stargazers_count}}
      <b>Last commit date: </b> {{new Date(repoDetails.updated_at).toLocaleDateString()}}
    </p>
    <hr>
    <p><b>Owner: </b>{{repoDetails.owner.login}}</p>
    <p v-if="repoDetails.language !== null"><b>Langueges:</b> {{repoDetails.language}}</p>
    <p v-if="repoDetails.description !== null"><b>Description: </b>{{repoDetails.description}}</p>
    <div>
      <hr>
      <b>The most active contributors: </b>
      <p v-for="(contributor, idx) in this.contributors" :key="contributor.id">
        #{{idx + 1}} {{contributor.login}}
      </p>
    </div>
    <hr>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    contributors: [],
  }),

  computed: mapGetters(['repoDetails']),

  async mounted() {
    // метод запрашивающий топ-10 контрибьютеров
    const contributorsRequest = `${this.$store.getters.repoDetails.contributors_url}?q=contributions:>1&per_page=10`;
    fetch(contributorsRequest)
      .then((response) => response.json())
      .then(
        (json) => {
          this.contributors = json;
        },
      );
  },
};
</script>

<style scoped>
  .avatar {
    height: 100px;
    width: 100px;
    @media (max-device-width:480px){
      float: left;
    }
    margin-right: 2rem;
  }
</style>
