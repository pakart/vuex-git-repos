<template>
 <div>
   <h1>Repos List</h1>
   <div class="row">
     <form action.prevent="submit" class="col s12">
       <div class="input-field col s6">
          <input id="repo_name" type="text">
          <label for="repo_name">Repo's name</label>
        </div>
        <button class="btn" type="submit">Search</button>
     </form>
   </div>
   <hr>
   <div>
     <table>
       <thead>
        <tr>
          <th>#</th>
          <th>Repo's name</th>
          <th>Stars</th>
          <th>Last commit date</th>
          <th>Link</th>
        </tr>
       </thead>
       <tbody>
      <tr v-for="(repo, idx) of this.repos"
      :key="repo.id">
        <td>{{idx + 1}}</td>
        <td>{{repo.name}}</td>
        <td>{{repo.stargazers_count}}</td>
        <td>{{repo.updated_at}}</td>
        <td>
          <a :href="repo.html_url">
            {{repo.html_url}}
          </a>
        </td>
      </tr>
       </tbody>
     </table>
   </div>
 </div>
</template>

<script>
export default {
  name: 'list',
  data: () => ({
    repos: [],
  }),

  components: {

  },
  mounted() {
    fetch('https://api.github.com/search/code?q=addClass+user:mozilla&page=2', { method: 'HEAD' })
      .then((response) => console.log(response.headers.get('Link')));
    fetch('https://api.github.com/search/repositories?q=followers:%3E1&sort=followers&per_page=3&page=3', {})
      .then((response) => response.json())
      .then(
        (json) => {
          console.log(json);
          this.repos = json.items;
          console.log(this.repos);
        },
      );
  },
};
</script>
