<!-- компонент-список репозиториев с поисковой строкой и постраничной навигацией -->
<template>
 <div>
   <div class="col s6 offset-s3">
     <!-- форма для поиска -->
     <form @submit.prevent="submitHandler" class="col s12">
       <div class="input-field col s6">
          <input v-model="repo_name" id="repo_name" type="text">
          <label for="repo_name">Repo name</label>
        </div>
        <button class="btn" type="submit">Search for repos</button>
     </form>
   </div>
   <hr>
   <!-- Таблица с результатами поискового запроса -->
   <Table />
   <!-- элемент постраничной навигации -->
   <div v-if="moreThanOnePage === true">
    <ul class="pagination">
      <li class="waves-effect" v-on:click="moveToPage(paginationParams.prevPage)">
        <a href="#!"><i class="material-icons" >chevron_left</i></a></li>
      <!-- генерация страниц в эелементе происходит по правилам, описанным в вызываемом методе -->
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
import Table from '@/components/Table.vue';

export default {
  data: () => ({
    repo_name: '',
    isActive: false,
    moreThanOnePage: true,
    paginationParams: {},
  }),
  components: { Table },
  computed: mapGetters(['allRepos', 'searchParams']),

  async mounted() {
    this.repo_name = this.$store.getters.searchParams.repo_name;

    this.searchRepos();
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      M.updateTextFields();
    }, 0);
  },

  methods: {
    // поиск репозиториев
    searchRepos() {
      // запрос к api для получения данных для постраничной навигации
      fetch(this.$store.getters.searchParams.requestUrlString, { method: 'HEAD' })
        .then((response) => {
          const linkHeader = response.headers.get('Link');
          // если данные получены, количество репозиториев не поместятся на одну страницу =>
          // необходимо сгенерировать элемент навигации
          if (linkHeader !== null) {
            this.moreThanOnePage = true;
            this.paginationParams = parser(linkHeader,
              this.$store.getters.searchParams.requestUrlString);
            this.$store.dispatch('fetchRepos', this.$store.getters.searchParams.requestUrlString);
            this.makePaginationArray(this.paginationParams.currentPage);
          } else {
            // в противном случае, элемент не нужен, генерация не происходит
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
    // обработчик для навигации по страницам, аналогичен методу searchRepos,
    // но к базовой строке добавляется параметр "номер страницы"
    moveToPage(pageNumber) {
      const newUrl = pageReq(this.$store.getters.searchParams.requestUrlString, pageNumber);

      fetch(newUrl, { method: 'HEAD' })
        .then((response) => {
          const linkHeader = response.headers.get('Link');
          this.moreThanOnePage = true;
          this.paginationParams = parser(linkHeader, newUrl);
          this.$store.dispatch('fetchRepos', newUrl);
          this.makePaginationArray(this.paginationParams.currentPage);
        });
    },

    // метод генерации постраничной навигации
    makePaginationArray(currentPage, lastPage) {
      const pagesArray = [];

      // проверка, если меньше 10 страниц в запросе, то генерируем n элементов
      if (lastPage <= 10) {
        for (let i = 1; i <= lastPage; i += 1) {
          pagesArray.push(i);
        }
        return pagesArray;
      }
      // проверка с пограничными значениями слева
      if (currentPage < 4) {
        for (let i = 1; i <= 10; i += 1) {
          pagesArray.push(i);
        }
        return pagesArray;
      }
      // проверка с пограничными значениями справа
      if (currentPage > lastPage - 5) {
        for (let i = 10; i >= 0; i -= 1) {
          pagesArray.push(lastPage - i);
        }
        return pagesArray;
      }
      // выбранная страница находится в середине интервала страниц
      for (let i = currentPage - 5 > 0 ? currentPage - 5 : 1; i <= currentPage + 5; i += 1) {
        pagesArray.push(i);
      }
      return pagesArray;
    },
  },
};
</script>
