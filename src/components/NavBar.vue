<template>
  <nav class="blue-grey">
    <div class="nav-wrapper">
      <router-link to="/" class="brand-logo">Vuex GitHub repos</router-link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <router-link
          tag='li'
          to='/'
          exact
          active-class="active">
          <a href="sass.html">List</a>
        </router-link>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {

};
</script>

<style lang='scss' scoped>
  nav {
    padding: 0 2rem;
  }
</style>
