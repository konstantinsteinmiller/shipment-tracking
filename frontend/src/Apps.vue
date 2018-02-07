<template>
  <div id="app">
    <div class="page">
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
  margin-top 60px
  .page
    width 90%
    padding 5em auto
    /*margin 5em auto*/
    margin auto
    height auto
    min-height 90vh
    box-shadow 0 0 1em 3px lightgrey


</style>
