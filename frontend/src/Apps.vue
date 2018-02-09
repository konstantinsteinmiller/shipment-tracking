<template>
  <div id="app">
    <div class="page">
      <div class="page__logo">
        <img src="./assets/logo.png" class="page__logo-image">
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">
#app
  font-family Arial, 'Avenir', Helvetica, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  .page
    width 90%
    padding 0 auto
    /*margin 5em auto*/
    margin auto
    height auto
    min-height 98vh
    box-shadow 0 0 1em 3px lightgrey
    &__logo
      /*margin-top 5em*/
      display: block
      width 100%
      height 72px
      overflow hidden
      &-image
        float left
        width 200px
        text-align left
        display inline-block
        z-index -1


</style>
