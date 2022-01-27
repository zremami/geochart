<template>
  <div id="figures-container">
    <div class="figure" v-show="selectedChart === 'pie'">

      <e-chart
        :option="pie"
        :init-options="initOptions"
        ref="pie"
        autoresize
      />
    </div>

    <div class="figure" v-show="selectedChart === 'bar'">

      <e-chart
        :option="bar"
        :init-options="initOptions"
        ref="bar"
        autoresize
      />
    </div>

    <div class="figure" v-show="selectedChart === 'stacked'">

      <e-chart
        :option="stacked"
        :init-options="initOptions"
        ref="stacked"
        autoresize
      />
    </div>

    <select class="chart-view" v-model="selectedChart">
      <option value="bar" >bar</option>
      <option value="pie">pie</option>
      <option value="stacked">stacked</option>
    </select>
    
  </div>

</template>

<script>

import EChart, { THEME_KEY } from 'vue-echarts'

import { CanvasRenderer } from "echarts/renderers";
import { use } from "echarts/core";
import { PieChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent 
} from "echarts/components";

import bar from "./data/bar";
import pie from "./data/pie";
import stacked from "./data/stacked";

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent 
]);

export default {
  name: 'Chart',
  components: {
    EChart
  },
  provide: {
    [THEME_KEY]: "light"
  },
  props: {
    selectedFeature: Object
  },
  data() {
    return {
      pie,
      bar,
      stacked,
      initOptions: {
        renderer: "canvas"
      },
      selectedChart: "stacked"
    }
  },
  mounted() {
    this.startActions();
  },
  watch: {
    selectedFeature: {
      handler: function () {
        this.startActions();
      },
      deep: true
    }
  },
  methods:
  {
    startActions() {
      
      //let dataIndex = -1;
      let pie = this.$refs.pie;
      let bar = this.$refs.bar;
      let stacked = this.$refs.stacked;

      if (!pie && !bar && !stacked)
        return;

      // Make data for chart
      let features = this.selectedFeature;
      
      if(features && features !== undefined)
      {
        ////////////////////////////////////////////////////pie//////////////////////////////////////////////////////
        // Erase old data for pie
        pie.option.legend.data = [];
        pie.option.series[0].data = [];
        pie.setOption(this.pie, true);

        let lastFeature = features[features.length - 1];
        let lastDate = new Date(lastFeature.properties.sample_begin);

        // Make new data for pie
        pie.option.title.text = 
        features[0].properties.local_authority + " : " + 
        features[0].properties.media + " - " + 
        lastDate.toLocaleString();
        pie.option.series[0].name = features[0].properties.unit;

        /* Get uniq nuclids */
        var uniqueNuclide = features.map(e => e.properties.nuclide).filter(this.onlyUnique);

        uniqueNuclide.forEach(e => {
          pie.option.legend.data.push(e);

          let allFeaturesOfNuclide = features.filter(f => f.properties.nuclide === e.toString());
          let lastFeatureOfNuclide = allFeaturesOfNuclide[allFeaturesOfNuclide.length - 1];

          let value = lastFeatureOfNuclide.properties.value;

          pie.option.series[0].data.push({ value: value, name: e });
        });


        ////////////////////////////////////////////////////bar//////////////////////////////////////////////////////
        // Erase old data from bar
        bar.option.legend.data = [];
        bar.option.xAxis.forEach(e => e.data = []);
        bar.option.series = [];
        bar.setOption(this.bar, true);

        // Make new data from bar
        bar.option.title.text = features[0].properties.local_authority + " : " + features[0].properties.media;
        bar.option.yAxis[0].name = features[0].properties.unit;

        /* Get uniq dates */
        var uniqueDates = features.map(e => e.properties.sample_begin).filter(this.onlyUnique);

        // Add Nuclids as series
        uniqueNuclide.forEach(e => {
          let newSerie = {
            name: e,
            type: 'bar',
            barGap: 0,
            label: {
              rotate: 90,
              align: 'left',
              verticalAlign: 'middle',
              position: 'insideBottom',
              distance: 15
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          }

          bar.option.legend.data.push(e);
          bar.option.series.push(newSerie);
        });

        // Add nuclids value in related series
        uniqueDates.forEach(date => {
          
          let d = new Date(date);
          let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

          var xAxisTitle = `${da}${mo}${ye}`;

          // Add Dates as xAxis
          bar.option.xAxis[0].data.push(xAxisTitle);

          let featuresInDate = features.filter(f => f.properties.sample_begin === date);

          // Add values in xAxis
          featuresInDate.forEach(f => {
            bar.option.series.find(e => e.name === f.properties.nuclide.toString()).data
            .push(f.properties.value ? f.properties.value : 0);
          });

        });


        ////////////////////////////////////////////////////stacked//////////////////////////////////////////////////////
        // Erase old data from stacked
        stacked.option.legend.data = [];
        stacked.option.yAxis.data = [];
        stacked.option.series = [];
        stacked.setOption({}, true);

        // Make new data from stacked
        stacked.option.title.text = features[0].properties.local_authority + " : " + features[0].properties.media;
        stacked.option.xAxis.name = features[0].properties.unit;

        // Add Dates as yAxis
        uniqueDates.forEach(f => {
          stacked.option.yAxis.data.push(f);
        });

        // Add Nuclids as series
        uniqueNuclide.forEach(e => {
          let newSerie = {
            name: e,
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          }

          stacked.option.legend.data.push(e);
          stacked.option.series.push(newSerie);
        });

        // Add nuclids value in related series
        stacked.option.yAxis.data.forEach((date, i) => {

          stacked.option.yAxis.data[i] = new Date(date).toLocaleDateString();

          let featuresInDate = features.filter(f => f.properties.sample_begin === date);

          featuresInDate.forEach(f => {
            stacked.option.series.find(e => e.name === f.properties.nuclide.toString()).data
            .push(f.properties.value ? f.properties.value : 0);

          });

        });

      }
    }
    ,
    // Get uniq items
    onlyUnique: function (value, index, self) {
      return self.indexOf(value) === index;
    },
    // Get mean from input array
    getMean: function (values){
      if(values.length === 0) throw new Error("No inputs");

      const average = values.reduce((a,b) => a + b, 0) / values.length;
      return average;
    }
  }
}
</script>

<style scoped>

  #figures-container{
    margin-bottom: -15px;
  }

  .figure {
    margin: 0;
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 8px;
    box-shadow: 0 0 20px rgb(0 0 0 / 25%);
    padding: 0;
    min-width: calc(10vw + 1em);
    min-height: calc(10vh + 1em);

    display: block;
    width: 582px;
    height: 440px;
    bottom: 30px;
    right: 30px;
  }

  .chart-view{
    position: relative;
    bottom: 50px;
    left: 10px;
    z-index: 1000;
  }
</style>