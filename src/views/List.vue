<template>
 <div>
   <h1>Repos List</h1>
   <div class="row">
     <!-- форма для поиска, по тз вроде только по имени репозитория можно искать,
     но мб допилю кастомные фильтры и всяких плюшек -->
     <form @submit.prevent="submitHandler" class="col s12">
       <div class="input-field col s6">
          <input v-model="repo_name" id="repo_name" type="text">
          <label for="repo_name">Repo name</label>
        </div>
        <button class="btn" type="submit">Search for repos</button>
     </form>
   </div>
   <hr>
   <div>
     <!-- вот эту таблицу в отдельный компонент нужно выносить -->
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
        <td><b v-on:click="openDetail(repo)">{{repo.name}}</b></td>
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

   <div v-if="moreThanOnePage === true">
    <ul class="pagination">
      <li class="waves-effect" v-on:click="moveToPage(paginationParams.prevPage)">
        <a href="#!"><i class="material-icons" >chevron_left</i></a></li>

      <li v-for="idx in makePaginationArray(paginationParams.currentPage,
      paginationParams.lastPage)"
        :key="idx" class="waves-effect" v-on:click="moveToPage(idx)"
      v-bind:class="[{ active: idx === paginationParams.currentPage},
      {'blue-grey': idx === paginationParams.currentPage}]">
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
import requestStringBuilder from '@/funcs/requestStringBuilder';
import pageReq from '@/funcs/pageRequestConstructor';
import { mapGetters } from 'vuex';

export default {
  name: 'list',
  data: () => ({
    repo_name: '',
    isActive: false,
    moreThanOnePage: true,
    paginationParams: {},
  }),
  computed: mapGetters(['allRepos', 'searchParams']),
  async mounted() {
    this.repo_name = this.$store.getters.searchParams.repo_name;

    this.searchRepos();
  },

  methods: {
    // поиск репозиториев
    searchRepos() {
      fetch(this.$store.getters.searchParams.requestUrlString, { method: 'HEAD' })
        .then((response) => {
          const linkHeader = response.headers.get('Link');
          if (linkHeader !== null) {
            this.moreThanOnePage = true;
            this.paginationParams = parser(linkHeader,
              this.$store.getters.searchParams.requestUrlString);
            this.$store.dispatch('fetchRepos', this.$store.getters.searchParams.requestUrlString);
            this.makePaginationArray(this.paginationParams.currentPage);
          } else {
            this.moreThanOnePage = false;
            this.$store.dispatch('fetchRepos', this.$store.getters.searchParams.requestUrlString);
          }
        });
    },
    // обработчик нажатия на кнопку поиска
    submitHandler() {
      const searchParams = {
        repo_name: this.repo_name,
        requestUrlString: '',
      };
      // собираем строку для запроса
      const requestString = requestStringBuilder(searchParams);
      searchParams.requestUrlString = requestString;

      this.$store.dispatch('setSearchParams', searchParams);
      this.searchRepos();
    },
    // обработчик для навигации по страницам, делает по сути то же самое,
    // но к базовой строке идёт параметром номер страницы
    moveToPage(pageNumber) {
      const newUrl = pageReq(this.$store.getters.searchParams.requestUrlString, pageNumber);

      fetch(newUrl, { method: 'HEAD' })
        .then((response) => {
          const linkHeader = response.headers.get('Link');
          if (linkHeader !== null) {
            this.moreThanOnePage = true;
            this.paginationParams = parser(linkHeader, newUrl);
            this.$store.dispatch('fetchRepos', newUrl);
            this.makePaginationArray(this.paginationParams.currentPage);
          } else {
            this.moreThanOnePage = false;
            this.$store.dispatch('fetchRepos', newUrl);
          }
        });
    },

    openDetail(repo) {
      this.$store.dispatch('openRepoDetails', repo);
    },

    makePaginationArray(currentPage, lastPage) {
      const pagesArray = [];

      // сначала смотрим если меньше 10 страниц в запросе, то тупо рисуем n элементов
      if (lastPage <= 10) {
        for (let i = 1; i <= lastPage; i += 1) {
          pagesArray.push(i);
        }
        return pagesArray;
      }
      // дальше случай с пограничными значениями слева
      if (currentPage < 4) {
        for (let i = 1; i <= 10; i += 1) {
          pagesArray.push(i);
        }
        return pagesArray;
      }
      // случай с пограничными значениями справа
      if (currentPage > lastPage - 5) {
        for (let i = 10; i >= 0; i -= 1) {
          pagesArray.push(lastPage - i);
        }
        return pagesArray;
      }
      // ну и вариант, если где то посередке
      for (let i = currentPage - 5 > 0 ? currentPage - 5 : 1; i <= currentPage + 5; i += 1) {
        pagesArray.push(i);
      }
      return pagesArray;
    },
  },
};
</script>
