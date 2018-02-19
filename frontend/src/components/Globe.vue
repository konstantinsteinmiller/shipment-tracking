<template>
  <div id="container">
  </div>
</template>

<script>
  import * as THREE from 'three';
  import { globeMixin } from '../mixins/globe';

  export default {
    mixins: [globeMixin],
    props: {
      states: {
        type: Array,
        required: true,
        default: () => []
      },
    },
    computed: {
      teamsArr() {
        //create it as an object first because that's more efficient than an array
        var endUnit = {};
        this.states.forEach((state) => {
          //we'll need to get the year from the end of the string
          let lat = state.location.latitude,
            long = state.location.longitude,
            key = lat + ", " + long,
            magBase = 0.1,
            val = 'Locations of shipment';
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
  }
</script>

<style scoped lang="stylus">
  #container
    width 30em
    height 100%
    position absolute
    float right
    right 0
    top 0
  @media (max-width: 800px)
    #container
      width 100%
      height 30em
      position relative
      canvas
        min-height 20em
        width 100%

</style>
