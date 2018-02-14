<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-navigation-drawer
        clipped
        fixed
        v-model="drawer"
        app
      >
        <v-list dense>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title><router-link class="app__navigation-link" :to="{ name: 'Tracking' }">Tracking</router-link></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title><router-link class="app__navigation-link" :to="{ name: 'Admin' }">Administration</router-link></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>today</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title><router-link class="app__navigation-link" :to="{ name: 'UpdateStatus' }">Update Shipment Status</router-link></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>ShipTrack</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <!--<v-btn flat>-->
            <div class="page__logo">
              <img src="/static/logo.png" class="page__logo-image">
            </div>
          <!--</v-btn>-->
        </v-toolbar-items>

      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center align-center>
            <v-flex shrink>

              <router-view/>

            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-footer app fixed>
        <span>ShipTrack &copy; 2018</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data: () => ({
      drawer: false
    }),
    props: {
      source: String
    }
  }
</script>

<style lang="stylus">
#app
  font-family Arial, 'Avenir', Helvetica, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  .app__navigation-link
    text-decoration none

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
      height 66px
      overflow hidden
      &-image
        float left
        width 200px
        text-align left
        display inline-block
        z-index -1


</style>
