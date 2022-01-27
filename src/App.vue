<template>
  <div id="app" class="container">
    <div class="cell cell-map">
      <map-container 
        :geojson="geojson"
        :baseLayerSelected="baseLayerPreview"
        @selectedFeature="selectedFeatureCallback" >
      </map-container>
    </div>
    <div class="cell cell-url">
      <url 
        @wfsResponse="wfsResponseCallback" 
        @baseChanged="baseurlCallback" >
      </url>
    </div>

    <div class="cell cell-chart">
      <chart 
        :selectedFeature="selectedFeature" >
      </chart>
    </div>
  </div>
</template>

<script>
  import MapContainer from './components/MapContainer'
  import Url from './components/Url'
  import Chart from './components/Chart'

  export default {
    name: 'App',
    components: {
      MapContainer,
      Url,
      Chart
    },
    data: () => ({
      geojson: undefined,
      baseLayerPreview: false,
      selectedFeature: undefined
    }),
    methods:
    {
      baseurlCallback: function(value){
        this.baseLayerPreview = value;
      },
      wfsResponseCallback: function(value){
        this.geojson = value;
      },
      selectedFeatureCallback: function(value){
        this.selectedFeature = value;
      }
    }
  }
</script>

<style>
  *{
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    margin: 0;
    background-color: #f0f0f0;
  }

  .container{
    width: 100%;
    padding-right: var(--bs-gutter-x,.75rem);
    padding-left: var(--bs-gutter-x,.75rem);
    margin-right: auto;
    margin-left: auto;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    height: 100%;
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 1rem;
    padding: 1rem;
  }

  .cell {
    border-radius: 4px;
    background-color: white;
  }

  .cell-map {
    grid-column: 1 / 7;
    grid-row: 1 / 9;
  }

  .cell-url {
    grid-column: 6 / 9;
    grid-row: 1 / 4;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 20px;
    justify-self: right;
  }

  .cell-chart {
    grid-column:  6 / 9;
    grid-row: 4 / 9;
    justify-self: right;
  }

</style>