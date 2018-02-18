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
                                    :rules="[rules.required, rules.trackingNumber]"
                                    @keyup.enter="(rules.trackingNumber && trackingNumber.length === trackingNumberMaxLength) && searchForTrackingNumber()"/>
                    </div>
                  </v-flex>

                  <v-btn :disabled="typeof rules.trackingNumber === 'string' || trackingNumber.length !== trackingNumberMaxLength"
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
                    <v-card style="border-radius: 0; background-color: #626262">

                      <v-container
                        fluid
                        style="min-height: 0;"
                        grid-list-lg
                      >
                        <v-layout row wrap>
                          <v-flex xs12 >
                            <v-container fluid grid-list-lg >
                              <v-layout row>
                                <v-flex xs12 class="text-xs-left" style="min-height: 28em; max-width: 30em;">

                                  <div>Receiver: {{ trackingItem.targetAdress.name }}</div>
                                  <div>Tracking number: {{ trackingItem.trackingNumber }}</div>
                                  <div>Shipment registration: {{ new Date(trackingItem.states[0].time).toLocaleString() }}</div>
                                  <div>Last update: {{ new Date(lastRecentShipmentState.time).toLocaleString() }}</div>
                                  <div>Last shipment state: {{ lastRecentShipmentState.notice }}</div>
                                  <div>&nbsp;</div>
                                  <div style="font-size: 12px">Notice: The globe mark the locations, where the shipment will</div>
                                  <div style="font-size: 12px">be at given times.</div>
                                  <globe :states="trackingItem.states"></globe>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </v-flex>
                  <v-flex xs12 sm4 md2 :offset-md1="index === 0"
                          v-for="(state, index) in trackingItem.states"
                          :key="'item_' + index"
                          class="tracking__history-item">
                    <div>
                      <div class="tracking__history">

                        <div id="e3"
                             style=" margin: auto;"
                             class="grey lighten-3"
                        >
                          <v-toolbar color="inspire"><span>{{ state.name }}</span></v-toolbar>
                          <v-card style="border-radius: 0; ; background-color: #626262" :class="{'tracking__history-item--active': state.scanned}">

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
                  <v-flex xs12 >
                    <div>
                      <v-subheader>Shipment history details</v-subheader>
                      <v-data-table :headers="tableHeaders"
                                    :items="tableItems"
                                    hide-actions
                                    class="elevation-1 tracking__history-table" style="background-color: #626262!important" >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.date }}</td>
                          <td class="text-xs-left">{{ props.item.time }}</td>
                          <td class="text-xs-left">{{ props.item.notice }}</td>
                        </template>
                      </v-data-table>
                    </div>
                  </v-flex>


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
import Globe from './Globe.vue'
import Api, { handleError } from '../libraries/api'
const api = new Api()

export default {
  name: 'tracking',
  components: { Globe },
  data() {
    return {
      title: 'Shipment tracking',
      subTitle: 'Track the status of your shipment',
      tableHeaders: [
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Time', value: 'time', sortable: false, align: 'left' },
        { text: 'State', value: 'notice', sortable: false, align: 'left' },
      ],
      tableItems: [],
      trackingItem: { trackingNumber: 'LA123456789DE', states: [] },
      lastRecentShipmentState: null,
      trackingNumberMaxLength: 13,
      trackingNumber: 'LA123456789DE',
      valid: true,
      alert: null,
      rules: {
        required: (value) => !!value || 'Required.',
        trackingNumber: (value) => {
          /* tracking number must be exactly 13 characters long, be a string,
           * and not contains any other character then a-z, A-Z and 0-9 */
          const n = value;
          const condition = n && typeof n === 'string' && n.length > 0 && (/[A-Za-z]{2}[\d]{9}[A-Za-z]{2}/.test(n) && (n.length === this.trackingNumberMaxLength))
          return !!condition || `A tracking number starts with 2 letters, is then followed by 9 alphanumerical numbers and ends with 2 additional letters. Its always ${ this.trackingNumberMaxLength } characters long`
        }
      },
      filteredData() {
        // const x = this.selectedFilter,
        //   filter = new RegExp(this.filteredText, 'i')
        return []/*this.speakerData.filter(el => {
          if (el[x] !== undefined) { return el[x].match(filter) }
          else return true;
        })*/
      }
    }
  },
  computed: {
    id(){
      return (this.$route && this.$route.query && this.$route.query.id) ? this.$route.query.id : '';
    },
    teamsArr() {
      //create it as an object first because that's more efficient than an array
      var endUnit = {};
      this.filteredData.forEach(function(index) {
        //we'll need to get the year from the end of the string
        let lat = index.latitude,
          long = index.longitude,
          key = lat + ", " + long,
          magBase = 0.1,
          val = 'Microsoft CDAs';
        if (lat === undefined || long === undefined) return;
        if (val in endUnit) {
          //if we already have this location (stored together as key) let's increment it
          if (key in endUnit[val]) {
            endUnit[val][key][2] += magBase;
          } else {
            endUnit[val][key] = [lat, long, magBase];
          }
        } else {
          let y = {};
          y[key] = [lat, long, magBase];
          endUnit[val] = y;
        }
      });
      let x = Object.entries(endUnit);
      let area = [],
        places,
        all;
      for (let i = 0; i < x.length; i++) {
        [all, places] = x[i];
        area.push([all, [].concat(...Object.values(places))]);
      }
      return area;
    }
  },
  beforeRouteUpdate(to, from, next){
    if(to.query && to.query.id) { this.trackingNumber = to.query.id; } //initialize from URL params if page is updated
    this.onInit(); //re-call the onInit method to trigger fetching status for tracking number
  },
  created() {},
  mounted() {
    document.title = 'Shipment tracking'
    this.trackingNumber = this.id; //initialize from URL params
    this.onInit();
  },
  methods: {
    onInit(){
      /* if a tracking number is set, fetch the status for this shioment tracking item */
      this.trackingNumber && this.trackingNumber !== '' && api.getStatus(this.trackingNumber)
        .then((response) => {
          if(response && response.error) {
            /* if error occured, clean up the data so that no false data is shown in tracking history */
            this.alert = { type: 'error', text: `An error occured: ${response.error}` }
            this.trackingItem = null
            this.tableItems= []
            return
          }else{
            this.alert = { type: 'success', text: `Successfully fetched tracking information for ${response.trackingNumber}` }
          }

          this.trackingItem = response

          /* set the last scanned state, so that we know which one to display as current */
          let scannedStates = response.states.filter( state => state.scanned === true )
          this.tableItems = scannedStates
                            .map((state) => {
                              return {
                                        date: new Date(state.time).toLocaleDateString("de-DE"),
                                        time: new Date(state.time).toLocaleTimeString("de-DE"),
                                        notice: state.notice
                                     }
                            })
                            .reverse()/* reverse so that latest state is showed at top of history table */

          /* pick out the last in the array to know which one to display at the top for current details */
          this.lastRecentShipmentState = (scannedStates && scannedStates.length) ? scannedStates.pop() : null

        })
        .catch(handleError);
    },
    searchForTrackingNumber(){
      /* convert to tracking number to uppercase letters for user convinience, so he can type lower and uppercase */
      const id = this.trackingNumber.toUpperCase();
      /* update the route which will trigger an page update and then the onInit method
       * which will fetch status by tracking number */
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
        background-color: #4CAF50!important
        border-color: transparent !important;
      margin-top 2em
    &__history-table table.datatable
        background-color: #626262
        border-color: transparent !important;

</style>
