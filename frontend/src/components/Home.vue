<template>
  <div>

    <v-layout row>
      <v-flex sm12 sm12>
        <v-card>
          <v-alert v-if="alert" :type="alert.type" dismissible v-model="alert">
            {{ alert.text }}
          </v-alert>
          <v-toolbar color="inspire" dark>
            <v-flex ms12 sm12 column  class="text-lg-left">
              <v-toolbar-title>{{title}}</v-toolbar-title>
              <span class="text-lg-right">{{subTitle}}</span>
            </v-flex>
          </v-toolbar>
          <v-list two-line>
            <v-container grid-list-xl >
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex xs12>
                    <div>
                      <v-subheader >Source adress</v-subheader>
                      <v-text-field label="Tracking Number"
                                    v-model="trackingNumber"
                                    placeholder="XX123456789YY"
                                    @keyup.enter="(validateTrackingNumber || trackingNumber.length !== trackingNumberMaxLength) && searchForTrackingNumber()"/>
                      <div v-if="validateTrackingNumber"
                           class="tracking__validation-message">A tracking number can only contain alphanumerical numbers and letters. Its always {{ trackingNumberMaxLength }} characters long
                      </div>
                    </div>
                  </v-flex>

                  <v-btn :disabled="validateTrackingNumber || trackingNumber.length !== trackingNumberMaxLength"
                         block @click="searchForTrackingNumber" color="primary">Find shipment&nbsp;<v-icon>search</v-icon></v-btn>

                </v-layout>
              </v-form>
            </v-container>

          </v-list>
        </v-card>

        <v-card class="tracking__history-panel" v-if="trackingItem && trackingItem.states && trackingItem.states.length">

          <v-toolbar color="inspire" dark>
            <v-flex ms12 sm12 column  class="text-lg-left">
              <v-toolbar-title>Status</v-toolbar-title>
            </v-flex>
          </v-toolbar>
          <v-list two-line>
            <v-container grid-list-xl >
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex xs12>
                    <div>
                      <v-subheader >Status for tracking number {{trackingNumber}}</v-subheader>
                      <div class="tracking__history">
                        <div v-for="(state, index) in trackingItem.states"
                            :key="'item_' + index"
                            :class="{'tracking__history-item--active': trackingItem.states && trackingItem.states[index] && trackingItem.states[index].done}"
                            class="tracking__history-item">

                        </div>
                      </div>
                    </div>
                  </v-flex>

                  <!--<v-btn block @click="createTrackingId" color="primary">submit</v-btn>-->

                </v-layout>
              </v-form>
            </v-container>

          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <!--<div class="tracking-number">-->
      <!--&lt;!&ndash;<div class="tracking__header">&ndash;&gt;-->
        <!--&lt;!&ndash;<h1>{{title}}</h1>&ndash;&gt;-->
        <!--&lt;!&ndash;<h4>{{subTitle}}</h4>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--<div class="tracking__panel">-->
        <!--<div class="tracking__input">-->
          <!--<div class="tracking__label">-->
            <!--Enter tracking number of your shipment-->
          <!--</div>-->
          <!--<input id="tracking-number" type="text"-->
                 <!--v-model="trackingNumber"-->
                 <!--placeholder="XX123456789YY"-->
                 <!--@keyup.enter="searchForTrackingNumber()">-->
          <!--<div v-if="validateTrackingNumber"-->
               <!--class="tracking__validation-message">A tracking number can only contain alphanumerical numbers and letters. Its always {{ trackingNumberMaxLength }} characters long-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="tracking__search-button">-->
          <!--<button type="text"-->
                  <!--@click="searchForTrackingNumber()"-->
                  <!--&gt;Find shipment-->
                  <!--<i class="fa fa-search tracking__search-button-icon"></i>-->
          <!--</button>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="tracking__history">-->
        <!--<h3>Status for tracking number {{trackingNumber}}</h3>-->
        <!--<div v-for="(state, index) in trackingItem.states"-->
             <!--:key="'item_' + state"-->
             <!--:class="{'tracking__history-item&#45;&#45;active': trackingItem.states && trackingItem.states[index] && trackingItem.states[index].done}"-->
             <!--class="tracking__history-item">-->

        <!--</div>-->
      <!--</div>-->

    <!--</div>-->
  </div>
</template>

<script>
import Api, { handleError } from '../libraries/api'
import appConfig from '../../config/appConfig'
const api = new Api(appConfig.apiEndpoint)

export default {
  name: 'home',
  data() {
    return {
      title: 'Shipment tracking',
      subTitle: 'Track the status of your shipment',
      trackingItem: { trackingNumber: 'LA123456789DE', states: [] },
      trackingNumberMaxLength: 13,
      trackingNumber: 'LA123456789DE',
      valid: true,
      alert: null
    }
  },
  computed: {
    validateTrackingNumber(){
      const n = this.trackingNumber;
      console.log('n.length: ', n && typeof n === 'string' && n.length > 0 && (n.length < this.trackingNumberMaxLength),  n.length,  /[^\dA-Za-z]{1,}/.test(n));
      return n && typeof n === 'string' && n.length > 0 && (/[^\dA-Za-z]{1,}/.test(n) || (n.length > this.trackingNumberMaxLength))
    },
    id(){
      return (this.$route && this.$route.query && this.$route.query.id) ? this.$route.query.id : '';
    }
  },
  created() {},
  mounted() {
    document.title = 'Shipment tracking'
    this.trackingNumber = this.id; //initialize from URL params
//    this.searchForTrackingNumber()
    this.onInit();
  },
  methods: {
    onInit(){
      this.trackingNumber && this.trackingNumber !== '' && api.getStatus(this.trackingNumber)
        .then((response) => {
          this.trackingItem = response
          if(response && response.error) {
            this.alert = { type: 'error', text: `An error occured: ${response.error}` }
          }else{
            this.alert = { type: 'success', text: `Successfully fetched tracking information for ${response.trackingNumber}` }
          }
          console.log('response: ' + JSON.stringify(response, undefined, 2))
        })
        .catch(handleError);
    },
    searchForTrackingNumber(){
      const id = this.trackingNumber.toUpperCase();
      this.$route.params.id = id
      this.$router.replace({ name: 'Home', query: { id: id} })
    }
  }
}
</script>


<style lang="stylus">
  .tracking
    &__header
      background #706c14
      padding .25em 1em
      text-align left
      color white
    &__history-panel
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
    &__history
      background #d0d0d0
      text-align left
      padding .5em 1em
      width calc(100% - 2em)
      &-item
        background white
</style>
