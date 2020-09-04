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
          <th>Repo's name</th>
          <th>Stars</th>
          <th>Last commit date</th>
          <th>Link</th>
        </tr>
       </thead>
       <tbody>
      <tr v-for="(repo) of this.repos"
      :key="repo.id">
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
   <div>
    <ul class="pagination">
      <li class="waves-effect" v-on:click="moveToPage(paginationParams.prevPage)">
        <a href="#!"><i class="material-icons" >chevron_left</i></a></li>
      <li v-for="idx in makePaginationArray(paginationParams.currentPage,
      paginationParams.lastPage)"
        :key="idx" class="waves-effect" v-on:click="moveToPage(idx)"
        v-bind:class="{ active: idx === paginationParams.currentPage }">
        <a href="#!">{{idx}}</a>
      </li>
      <li class="waves-effect" v-on:click="moveToPage(paginationParams.nextPage)">
        <a href="#!"><i class="material-icons">chevron_right</i></a></li>
    </ul>
   </div>
 </div>
</template>

<script>
import parser from '@/funcs/parser';
import pageReq from '@/funcs/pageRequestConstructor';

export default {
  name: 'list',
  data: () => ({
    isActive: false,
    repos: [],
    lol: 22,
    paginationParams: {},
    requestUrl: 'https://api.github.com/search/repositories?q=followers:%3E1&sort=followers&per_page=10&page=1',
    paginator: 1,
  }),

  mounted() {
    fetch(this.requestUrl, { method: 'HEAD' })
      .then((response) => {
        const linkHeader = response.headers.get('Link');
        this.paginationParams = parser(linkHeader, this.requestUrl);
      });
    fetch(this.requestUrl)
      .then((response) => response.json())
      .then(
        (json) => {
          this.repos = json.items;
          this.makePaginationArray(this.paginationParams.currentPage);
        },
      );
  },

  methods: {
    moveToPage(pageNumber) {
      const newUrl = pageReq(this.requestUrl, pageNumber);
      fetch(newUrl, { method: 'HEAD' })
        .then((response) => {
          const linkHeader = response.headers.get('Link');
          this.requestUrl = newUrl;
          this.paginationParams = parser(linkHeader, this.requestUrl);
        });

      fetch(newUrl)
        .then((response) => response.json())
        .then(
          (json) => {
            this.repos = json.items;
            this.requestUrl = newUrl;
          },
        );
    },
    makePaginationArray(currentPage, lastPage) {
      const pagesArray = [];
      if (currentPage < 4) {
        for (let i = 1; i <= 10; i += 1) {
          pagesArray.push(i);
        }
        return pagesArray;
      }
      if (currentPage > lastPage - 5) {
        for (let i = 10; i >= 0; i -= 1) {
          pagesArray.push(lastPage - i);
        }
        return pagesArray;
      }
      for (let i = currentPage - 5 > 0 ? currentPage - 5 : 1; i <= currentPage + 5; i += 1) {
        pagesArray.push(i);
      }
      return pagesArray;
    },
  },
};
</script>
