<template>
  <div id="map-container" ref="map-root" :geojsonBaseLayer="geojsonBaseLayer">
  </div>
  <div id="popup"></div>
</template>

<script>
  import View from 'ol/View'
  import Map from 'ol/Map'
  import Overlay from 'ol/Overlay';
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import 'ol/ol.css'
  
  // Default Data
  import DEU from '../assets/DEU.json'

  //Hovering
  import Fill from 'ol/style/Fill'
  import Stroke from 'ol/style/Stroke'
  import Style from 'ol/style/Style'

  export default {
    name: 'MapContainer',
    emits: ['selectedFeature'],
    components: {},
    props: {
      geojson: { type: Object, require: false},
      baseLayerSelected: { type: Boolean, require: true, default: true}
    },
    data: () => ({
      vectorLayer: null,
      geojsonBaseLayer: DEU
    }),
    mounted() {

      this.vectorLayer = new VectorLayer({
        source: new VectorSource()
      });

      this.olMap = new Map({
        target: this.$refs['map-root'],
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.vectorLayer
        ],
        view: new View({
          zoom: 0,
          center: [0, 0],
          constrainResolution: true
        }),
      });

      this.setFeatures();

      this.updateSource(this.geojson, this.baseLayerSelected);

    },
    watch: {
      geojson: {
        handler: function (value) {
          this.updateSource(value, this.baseLayerSelected)
        },
        deep: true
      },
      baseLayerSelected: {
        handler: function (value) {
          this.updateSource(this.geojson, value)
        },
        deep: true
      }
    },
    methods: {
      updateSource: function(geojson, baseLayerPreview) {

        try
        {
          const view = this.olMap.getView();
          const source = this.vectorLayer.getSource();
          var features = [];

          if(baseLayerPreview !== null && baseLayerPreview)
            features = features.concat(new GeoJSON({featureProjection: 'EPSG:3857'}).readFeatures(this.geojsonBaseLayer));

          if(geojson !== null && geojson)
            features = features.concat(new GeoJSON({featureProjection: 'EPSG:3857'}).readFeatures(geojson));

          source.clear();
          if(features && features.length > 0)
          {
            source.addFeatures(features);
            view.fit(source.getExtent());
          }
          
        }
        catch (error)
        {
          console.log(error);
        }
        
      },
      setFeatures: function() {
        try 
        {
          const self = this;

          // Popup layer
          const popupContainer = document.getElementById('popup');

          const popupOverlay = new Overlay({
            element: popupContainer,
            offset: [10, 10],
          });

          this.olMap.addOverlay(popupOverlay);
          
          let selected = null;

          this.olMap.on('pointermove', function (e) {
            if (selected !== null) {
              selected.setStyle(undefined);
              selected = null;
            }
            
            this.forEachFeatureAtPixel(e.pixel, function (feature) {
              selected = feature;
              
              // Set Style
              const highlightStyle = new Style({
                fill: new Fill({
                  color: 'rgba(0,0,255,0.7)',
                }),
                stroke: new Stroke({
                  color: 'rgba(0,0,0,1.0)',
                  width: 2,
                }),
              });
              feature.setStyle(highlightStyle);

              // Get List of nuclids in hover feature
              var featuresArray = [];
              var nuclidesArray = [];
              var datesArray = [];
              var sampleTypesArray = [];
              var valuesArray = [];
              var totalFeatures = 0;
              self.geojson.features.forEach(f => {
                if(f.properties.local_authority === feature.get('local_authority'))
                {
                  nuclidesArray.push(f.properties.nuclide);
                  datesArray.push(new Date(f.properties.sample_begin));
                  sampleTypesArray.push(f.properties.sample_type);
                  valuesArray.push(f.properties.value);
                  featuresArray.push(f);
                  totalFeatures++;
                }
              });

                    
              /* Get uniq nuclids */
              var uniqueNuclides = nuclidesArray.filter(self.onlyUnique);

              // Add popup
              let id = feature.get('id');
              let local_authority = feature.get('local_authority');
              let media = feature.get('media');
              let mst_name = feature.get('mst_name');
              let unit = feature.get('unit');
              let nuclides = uniqueNuclides.join(',');
              let featuresDetails = datesArray.map((date, i) => 
                '<tr><td>' + 
                date.toLocaleString() + '</td><td>' + 
                sampleTypesArray[i] + '</td><td>' + 
                valuesArray[i] +
                '</td></tr>')
                .join('');
              let total = totalFeatures;

              var content = 
                '<ul class="popup-ul">' +
                  '<li><b>id:</b> ' + id + '</li>' +
                  '<li><b>local_authority:</b> ' + local_authority + '</li>' +
                  '<li><b>media:</b> ' + media + '</li>' +
                  '<li><b>mst_name:</b> ' + mst_name + '</li>' +
                  '<li><b>unit:</b> ' + unit + '</li>' +
                  '<li>-----------------</li>' +
                  '<li><b>nuclides:</b> ' + nuclides + '</li>' +
                  '<li><b>features Details:</b> '
                    + '<table style="width:100%"><tr><th>date</th><th>type</th><th>value</th></tr>'
                    +  featuresDetails + '</table>' + '</li>' +
                  '<li><b>Total Features:</b> ' + total + '</li>' +
                '</ul>';

              popupContainer.innerHTML = content;
              popupOverlay.setPosition(e.coordinate);

              return true;
            });

            // Hide the popup
            if (selected === null) {
              document.getElementById('popup').innerHTML = '';
              popupOverlay.setPosition(null);
            }
            
          });


          //select and sending data
          this.olMap.on('click', function (e) {

            this.forEachFeatureAtPixel(e.pixel, function (feature) {
              selected = feature;

              let local_authority = feature.get('local_authority');

              let features = self.geojson.features.filter((n) => {
                  return n.properties.local_authority === local_authority;
              });

              self.$emit('selectedFeature', features);

              return true;
            });

          });

          
        }catch (error) 
        {
          console.log(error);
        }

      },
      // Get uniq items
      onlyUnique: function (value, index, self) {
        return self.indexOf(value) === index;
      },
    }
  }
</script>

<style scoped>
  #map-container {
    width: 100%;
    height: 100%;
  }

  #popup {
    border-radius: 5px;
    border: 1px solid grey;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2px;
    font-size: 12px;
    width: 300px;
    list-style: none;
  }

  #popup .popup-ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>