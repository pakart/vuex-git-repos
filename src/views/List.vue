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
      .then((response) => {
        // console.log('slice', response.headers.get('Link')
        // .slice(response.headers.get('Link').indexOf('page='),
        // response.headers.get('Link').indexOf('>; rel="last"')));
        // TODO
        // *сделать динамическую сборку строки запроса для пагера
        // *сделать массив состояния последнего запроса в локал сторадже
        // *сделать сам пагер
        // *сделать довести до ума поиск и чистку мусора
        // *сделать страницу с инфой
        // *повыносить лишний функционал в отдельные файлики (сборка пагера, сборка запроса)
        //
        // http://localhost:8080/
        // https://developer.github.com/v3/guides/traversing-with-pagination/ - пагинэйшн
        // https://github.com/avito-tech/pro-fe-trainee-task - case
        // https://developer.github.com/v3/search/#search-repositories - git search
        // https://regex101.com/r/tEfwYE/1 - regexp
        //
        console.log('regexp', response.headers.get('Link').match('page=(\\d+)>; rel="last"')[1]);
        console.log('start', response.headers.get('Link'));
      });
    fetch('https://api.github.com/search/repositories?q=followers:%3E1&sort=followers&per_page=3&page=3')
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
