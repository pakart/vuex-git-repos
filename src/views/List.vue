<!-- Короче, обнаружил со свежей головой у себя фатальную сраку,
сейчас буду всю архитектуру переделывать (хз почему сразу так не сделал):
* у меня все запросы из глобального mounted компонента делаются,
 поэтому рендерится всё по несколько раз, а значит и запросы отправляются несколько раз)
 из-за этого ещё бывает падает пагинатор из-за ассинхронности кривые значения достаёт и тд
* куча утечек, destroy() нужно тоже распихать
* ну и в принципе я обосрался и забыл, что как бы на vuex пишу,
 поэтому архитектура полное говно sore вообще не юзал
* так что береги глаза) -->
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
   <!-- paginator тоже надо вынести к хуям и подключать из компонента таблицы по идее
    с ним вообще самый трешовый shit fest происходит, уверен его можно в три строки сделать,
    но у меня вот такая дичь происходит: -->
   <div v-if="moreThanOnePage === true">
    <ul class="pagination">
      <li class="waves-effect" v-on:click="moveToPage(paginationParams.prevPage)">
        <a href="#!"><i class="material-icons" >chevron_left</i></a></li>
        <!-- тут дерьмовая херота тоже, класс активной страницы через функцию,
         которая прогоняется по каждому элементу,
         сравнивая его индекс с текущей страницей из запроса:\
         как это сделать через computed недогнал, либо линтер мозгу ебёт,
         либо просто языком не предусмотренно -->
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
    // дефолтная строка запроса топ репозиториев по популярности, решил по фолловерам сделать
    // requestUrl: 'https://api.github.com/search/repositories?q=followers:%3E1&sort=followers&per_page=10&page=1',
  }),
  computed: mapGetters(['allRepos', 'searchParams']),
  // вот эта дичь, глобальный метод List компонента который делает вообще всё,
  // и несколько раз)
  async mounted() {
    // точнее функция одна, но она вызывает всё остальное)
    this.repo_name = this.$store.getters.searchParams.repo_name;
    console.log('mounted');
    this.searchRepos();
  },

  methods: {
    // поиск репозиториев
    searchRepos() {
      // первый фетч чтобы заголовок получить с данными о количестве страниц
      // тут вроде бы всё из документации к апи
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
      //
      this.$store.dispatch('setSearchParams', searchParams);

      // ну и дёргаем метод выше
      this.searchRepos();
    },
    // обработчик для навигации по страницам, делает по сути то же самое,
    // но к базовой строке идёт параметром номер страницы
    // надо по уму перегрузку метода сделать просто
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

    // дичайший метод
    // короче, задумка была смотреть на то на какой сейчас юзер странице,
    // и как много страниц в целом,
    // типа если ты где то в середине страниц то в пагинаторе было бы 5 предыдущих страниц
    // и 5 следующих, а по краям статичные массивы от 1 до 10 и n-10 до n соответственно
    // но кривизна реализации потрясающая, делал уже ближе к ночи
    makePaginationArray(currentPage, lastPage) {
      const pagesArray = [];
      // ща if-ы пойдут)
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
