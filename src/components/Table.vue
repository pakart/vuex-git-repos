<!-- Таблица с результатами поискового запроса -->
<template>
  <div>
     <div v-if="allRepos.length === 0">
       <h3>No results!</h3>
     </div>
     <table v-else>
       <thead>
        <tr>
          <th>Repo's name</th>
          <th>Stars</th>
          <th>Last commit date</th>
          <th>Link</th>
        </tr>
       </thead>
       <tbody>
      <tr v-for="(repo) of allRepos"
      :key="repo.id">
        <td><router-link tag='p' :to="'/repo/' + repo.name">
          <p v-on:click="openDetail(repo)">{{repo.name}}</p>
          </router-link></td>
        <td>{{repo.stargazers_count}}</td>
        <td>{{new Date(repo.updated_at).toLocaleDateString()}}</td>
        <td>
          <a :href="repo.html_url">
            {{repo.html_url}}
          </a>
        </td>
      </tr>
       </tbody>
     </table>
   </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: mapGetters(['allRepos', 'searchParams']),
  methods: {
    openDetail(repo) {
      this.$store.dispatch('openRepoDetails', repo);
    },
  },
};
</script>

<style>

</style>
