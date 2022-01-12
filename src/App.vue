<template>
  <div id="app" class="container">
    <div class="cell cell-map">
      <map-container :geojson="geojson" ></map-container>
    </div>
    <div class="cell cell-geojson-url">
      <geojson-url @urlChanged="geojson = $event" ></geojson-url>
    </div>
    <div class="cell cell-geojson-editor">
      <geojson-editor :geojson="geojson" @change="geojson = $event"></geojson-editor>
    </div>
    <div class="cell cell-inspector">
      <div class="chart">
      </div>
    </div>
  </div>
</template>

<script>
  import MapContainer from './components/MapContainer'
  import GeojsonUrl from './components/GeojsonUrl'
  import GeojsonEditor from './components/GeojsonEditor'

  // Default Data
  //import DEU from '../public/DEU.json'

  export default {
    name: 'App',
    components: {
      MapContainer,
      GeojsonUrl,
      GeojsonEditor
    },
    data: () => ({
      selected: undefined,
      geojson: null,
    })
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
    box-sizing: border-box;
  }

  .cell {
    border-radius: 4px;
    background-color: white;
  }

  .cell-map {
    grid-column: 1 / 6;
    grid-row-start: 1;
    grid-row-end: 12;
  }

  .cell-geojson-url {
    grid-column: 6;
    grid-row: 1;
  }

  .cell-geojson-editor {
    grid-column: 6;
    grid-row: 2 / 7;
  }

  .cell-inspector {
    grid-column: 6;
    grid-row: 7 / 12;
  }

  .chart{
    width: 100%;
    height: 100%;
    resize: none;
    background: url(../public/images/chart.png) no-repeat -5px bottom;
  }

</style>