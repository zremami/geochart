<template>
  <div class="url-container">
  <div :class="loaderClass"></div>
    
    <table style="width:100%;">
      <tr style="display:none">
        <td style="width:80%">
            <textarea class="url__input" v-model="url" @input="urlEdit($event.target.value)" type="text" placeholder="WFS URL" disabled />
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
      <tr>
        <td colspan="2" style="width:80%">
          <url-builder 
            :urlObject="urlObject"
             @newUrlChanged="newUrlChangedCallback" >
          </url-builder>
        </td>
      </tr>
    </table>

  </div>

</template>

<script>
  import UrlBuilder from './UrlBuilder'

  export default {
    name: 'Url',
    emits: ['wfsResponse', 'baseChanged'],
    components: {
      UrlBuilder,
    },
    data () {
      return {
        url: '',
        jsondata: '',
        baselayer: false,
        urlObject: {
          startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()).toJSON().replace('Z',''),
          endDate: new Date().toJSON().replace('Z',''),
          type: 'nuklide_fisch',
          nuclids: ["K-40"],
        },
        loaderClass: '',
      }
    },
    mounted()
    {
      const staticUrl = "https://www.imis.bfs.de/ogc/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:" + this.urlObject.type +
        "&CQL_FILTER=(sample_begin%20DURING%20" + encodeURIComponent(this.urlObject.startDate) +
        "%2F" + encodeURIComponent(this.urlObject.endDate) + ")%20AND%20(nuclide%3D%27" + this.urlObject.nuclids[0] + "%27)&VIEWPARAMS=order:sample_begin;&outputFormat=application%2Fjson";

      setTimeout(() => {
        this.urlEdit(staticUrl);
      }, 1000);
    },
    methods:{
      urlEdit: async function(url){

        this.loaderClass = 'loader';
        await fetch(url)
          .then(response => response.json())
          .then(data => { this.jsondata = JSON.stringify(data); } )

        this.loaderClass = '';

        this.$emit('wfsResponse', JSON.parse(this.jsondata));
      },
      baselayerChanged: function ($event) {
          this.$emit('baseChanged', $event.target.checked);
      },
      newUrlChangedCallback: function(value){
        this.url = value;
        this.urlEdit(this.url);
      },
    }
  }
</script>

<style scoped>
.url-container{

  width: 581px;
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

/* loader */
.loader {
  border: 16px solid #888888;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  position: absolute;
  top: 15%;
  left: 75%;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>