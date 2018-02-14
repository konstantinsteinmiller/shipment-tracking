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
              <v-toolbar-title>Status for tracking number {{trackingNumber}}</v-toolbar-title>
            </v-flex>
          </v-toolbar>
          <v-list two-line>

            <v-container grid-list-xl >
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex xs12 v-if="lastRecentShipmentState">
                    <v-card style="border-radius: 0; ">

                      <v-container
                        fluid
                        style="min-height: 0;"
                        grid-list-lg
                      >
                        <v-layout row wrap>
                          <v-flex xs12 >
                            <!--<v-card color="transparent" class="black&#45;&#45;text">-->
                            <v-container fluid grid-list-lg >
                              <v-layout row>
                                <v-flex xs12 class="text-xs-left" >

                                  <div>Receiver: {{ trackingItem.targetAdress.name }}</div>
                                  <div>Tracking number: {{ trackingItem.trackingNumber }}</div>
                                  <div>Shipment registration: {{ new Date(trackingItem.states[0].time).toLocaleString() }}</div>
                                  <div>Last update: {{ new Date(lastRecentShipmentState.time).toLocaleString() }}</div>
                                  <div>Last shipment state: {{ lastRecentShipmentState.notice }}</div>

                                </v-flex>
                              </v-layout>
                            </v-container>
                            <!--</v-card>-->
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </v-flex>
                  <v-flex xs12 sm4 md2 v-for="(state, index) in trackingItem.states"
                          :key="'item_' + index"
                          class="tracking__history-item">
                    <div>
                      <div class="tracking__history">

                        <div id="e3"
                             style=" margin: auto;"
                             class="grey lighten-3"
                        >
                          <v-toolbar color="inspire"><span>{{ state.name }}</span></v-toolbar>
                          <v-card style="border-radius: 0;" :class="{'tracking__history-item--active': state.scanned}">

                            <v-container
                              fluid
                              style="min-height: 0;"
                              grid-list-lg
                            >
                              <v-layout row wrap>
                                <v-flex xs12 >
                                  <!--<v-card color="transparent" class="black&#45;&#45;text">-->
                                    <v-container fluid grid-list-lg>
                                      <v-layout row>
                                        <v-flex xs12>
                                          <v-tooltip bottom :disabled="!state.scanned && !state.notice">
                                            <v-card-media
                                              slot="activator"

                                              :src="'/static/' + state.image"
                                              height="80px"
                                              contain
                                            />
                                            <span v-if="state.scanned && state.notice">{{ state.notice }}</span>

                                          </v-tooltip>
                                        </v-flex>
                                      </v-layout>
                                    </v-container>
                                  <!--</v-card>-->
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-card>
                        </div>

                      </div>
                    </div>
                  </v-flex>

                  <div><v-subheader>Shipment history details</v-subheader>
                  <v-data-table :headers="tableHeaders"
                                :items="tableItems"
                                hide-actions
                                class="elevation-1" >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.date }}</td>
                    <td class="text-xs-center">{{ props.item.time }}</td>
                    <td class="text-xs-left">{{ props.item.notice }}</td>
                  </template>
                  </v-data-table>
                  </div>

                </v-layout>
              </v-form>
            </v-container>

          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Api, { handleError } from '../libraries/api'
import appConfig from '../../config/appConfig'
const api = new Api(appConfig.apiEndpoint)

export default {
  name: 'tracking',
  data() {
    return {
      title: 'Shipment tracking',
      subTitle: 'Track the status of your shipment',
      tableHeaders: [
        { text: 'Date', value: 'date', sortable: false },
        { text: 'Time', value: 'time', sortable: false },
        { text: 'State', value: 'notice', sortable: false },
      ],
      tableItems: [],
      trackingItem: { trackingNumber: 'LA123456789DE', states: [] },
      lastRecentShipmentState: null,
      trackingNumberMaxLength: 13,
      trackingNumber: 'LA123456789DE',
      valid: true,
      alert: null
    }
  },
  computed: {
    /* tracking number must be exactly 13 characters long, be a string,
     * and not contains any other character then a-z, A-Z and 0-9 */
    validateTrackingNumber(){
      const n = this.trackingNumber;
      // console.log('n.length: ', n && typeof n === 'string' && n.length > 0 && (n.length < this.trackingNumberMaxLength),  n.length,  /[^\dA-Za-z]{1,}/.test(n));
      return n && typeof n === 'string' && n.length > 0 && (/[^\dA-Za-z]{1,}/.test(n) || (n.length > this.trackingNumberMaxLength))
    },
    id(){
      return (this.$route && this.$route.query && this.$route.query.id) ? this.$route.query.id : '';
    }
  },
  beforeRouteUpdate(to, from, next){
    // console.log('to.query', to.query)
    if(to.query && to.query.id) { this.trackingNumber = to.query.id; } //initialize from URL params if page is updated
    this.onInit(); //recall the onInit method to trigger fetching status for tracking number
  },
  created() {},
  mounted() {
    document.title = 'Shipment tracking'
    this.trackingNumber = this.id; //initialize from URL params
    this.onInit();
  },
  methods: {
    onInit(){
      this.trackingNumber && this.trackingNumber !== '' && api.getStatus(this.trackingNumber)
        .then((response) => {
          this.trackingItem = response

          /* set the last scanned state, so that we know which one to display as current */
          let scannedStates = response.states.filter( state => state.scanned === true )
          this.tableItems = scannedStates.map((state) => {
            return {
                      date: new Date(state.time).toLocaleDateString("de-DE"),
                      time: new Date(state.time).toLocaleTimeString("de-DE"),
                      notice: state.notice
                   }
          })

          /* pick out the last in the array */
          this.lastRecentShipmentState = (scannedStates && scannedStates.length) ? scannedStates.pop() : null

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
      this.$router.replace({ name: 'Tracking', query: Object.assign({}, this.$route.query, { id: id }) })
    }
  }
}
</script>


<style lang="stylus">
  .tracking
    &__history-panel
      margin-top 2em
    &__history-item--active
        /*background #b3d4fc*/
        background-color: #63ddfc!important

</style>
