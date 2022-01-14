<template>

  <div class="url-container">
    
    <table >
      <tr>
        <td style="width:80%">
            <textarea class="url__input" v-model="url" @input="urlEdit($event.target.value)" type="text" placeholder="WFS URL" />
        </td>
        <td style="width:20%">
            <input
              v-model="baselayer"
              @change="baselayerChanged($event)"
              type="checkbox"
              name="baselayer_checkbox"
              >

            <label for="baselayer_checkbox"> Base Layer</label>
        </td>
      </tr>
    </table>

  </div>

</template>

<script>

  export default {
    name: 'GeojsonUrl',
    emits: ['urlChanged', 'baseChanged'],
    data () {
      return {
        url: '',
        jsondata: '',
        baselayer: false
      }
    },
    mounted()
    {
      setTimeout(() => {
        this.urlEdit("https://www.imis.bfs.de/ogc/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:nuklide_fleisch&CQL_FILTER=(sample_begin%20DURING%202020-12-08T12%3A00%3A00.000Z%2F2021-01-08T12%3A00%3A00.000Z)%20AND%20(nuclide%3D%27Ce-144%27%20OR%20nuclide%3D%27Cs-137%27%20OR%20nuclide%3D%27Cs-134%27%20OR%20nuclide%3D%27Ru-103%27%20OR%20nuclide%3D%27I-131%27%20OR%20nuclide%3D%27K-40%27%20OR%20nuclide%3D%27Co-60%27)&VIEWPARAMS=order:sample_begin;&outputFormat=application%2Fjson");
        //this.urlEdit();
      }, 1000);
    },
    methods:{
      urlEdit: async function(value){
          await fetch(value)
            .then(response => response.json())
            .then(data => { this.jsondata = JSON.stringify(data); } )

          this.$emit('urlChanged', JSON.parse(this.jsondata));
      },
      baselayerChanged: function ($event) {
          this.$emit('baseChanged', $event.target.checked);
      }
    }
  }
</script>

<style scoped>
.url-container{
  display: block;
  position: absolute;
}

.url__input {
  width: 100%;
  height: 100%;
  resize: none;
  display: block;
}

.url-container input {
  font-size: 13px;
}
.url-container label {
  margin-top: 5px;
  font-size: 13px;
}

</style>