<template>
  <div id="app" class="container">
    <div class="cell cell-map">
      <map-container 
        :geojson="geojson"
        :baseLayerSelected="baseLayerPreview"
        @selectedFeature="selectedFeatureCallback" >
      </map-container>
    </div>
    <div class="cell cell-geojson-url">
      <geojson-url 
        @wfsResponse="wfsResponseCallback" 
        @baseChanged="baseurlCallback" ></geojson-url>
    </div>

    <div class="cell cell-chart">
      <geojson-chart 
        :selectedFeature="selectedFeature" >
      </geojson-chart>
    </div>
  </div>
</template>

<script>
  import MapContainer from './components/MapContainer'
  import GeojsonUrl from './components/GeojsonUrl'
  import GeojsonChart from './components/GeojsonChart'

  export default {
    name: 'App',
    components: {
      MapContainer,
      GeojsonUrl,
      //GeojsonEditor,
      GeojsonChart
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
    grid-column: 1 / 4;
    grid-row-start: 1;
    grid-row-end: 12;
  }

  .cell-geojson-url {
    grid-column: 4 / 6;
    grid-row: 1 / 5;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 20px;
    background-color: #f5f5f5;
  }

  .cell-geojson-editor {
    grid-column:  4 / 6;
    grid-row: 2 / 7;
  }

  .cell-chart {
    grid-column:  4 / 6;
    grid-row: 5 / 12;
    justify-self: right;
  }

</style>