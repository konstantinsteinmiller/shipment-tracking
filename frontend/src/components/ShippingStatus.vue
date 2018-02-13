<template>
  <v-container fluid="fluid" class="text-xs-center">
    <v-layout row wrap>
      <v-flex xs12 sm6><span>Raised Light Theme</span>
        <v-card height="185px" flat color="white">
          <v-card-text>
            <div>
              <v-btn color="primary">Primary</v-btn>
            </div>
            <div>
              <v-btn color="error">Error</v-btn>
            </div>
            <div>
              <v-btn light disabled>Disabled</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6><span>Raised Dark Theme</span>
        <v-card height="185px" flat color="secondary">
          <v-card-text>
            <div>
              <v-btn color="primary" dark>Primary</v-btn>
            </div>
            <div>
              <v-btn color="error" dark>Error</v-btn>
            </div>
            <div>
              <v-btn color="primary" dark disabled>Disabled</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Api, { handleError } from '../libraries/api'
import appConfig from '../../config/appConfig'
const api = new Api(appConfig.apiEndpoint)

export default {
  name: 'shipping status',
  data() {
    return {
      title: 'Welcome to the shipment tracking',
      trackingNumber: ''
    }
  },
  mounted() {
    document.title = 'Shipment tracking'
    this.getStatus()
  },
  computed: {
    validateTrackingNumber(){
      const n = this.trackingNumber;
      return n && typeof n === 'string' && n.length > 0 && /[^\dA-Za-z]{1,}/.test(n)
    }
  },
  created() {},
  methods: {
    getStatus(){
      api.getStatus()
        .then((response) => {
          console.log('response: ', response);
        })
        .catch(handleError);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  .tracking-number
    &__logo
      margin-top 2em
    &__panel
      margin 2em auto
      background #f8f8f8
      width 20em
      height auto
      box-shadow 0 0 1em 1px lightgrey
    &__input
      width 100%
      min-height 1em
      padding 1em 0
      margin .5em 0
      font-size 16px
      > *
        float left
        clear both
      input
        width calc(100% - 2.5em)
        margin .5em
        padding .5em
        font-size 16px
        &::placeholder
          color lightgrey
    &__search-button
      button
        font-size 16px
        min-width 10em
        width 100%
        padding .75em
        background #706c14
        border none
        color white
        font-weight bold
        cursor pointer
        outline-color #ff5050
      &-icon
        padding-left .5em
    &__label
      margin .5em
    &__validation-message
      color #ff5050
      text-align left
      padding .25em .5em
      font-size 12px

</style>
