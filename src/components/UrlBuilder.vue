<template>
  <div>
    <form>
      <fieldset>

        <legend>
            Search
        </legend>

        <table>
          <tr>
            <td>
              Type:
            </td>
            <td>
              <select id="type" v-model="urlBag.type" :class="typeClassName" >
                <option value="" selected>-------------</option>
                <option value="nuklide_fisch">Fisch (Fish)</option>
                <option value="nuklide_fleisch">Fleisch (Meat)</option>
                <option value="nuklide_gemuese">Gemuese (Vegetables)</option>
                <option value="nuklide_gesamtnahrung">Gesamtnahrung (Total nutrition)</option>
                <option value="nuklide_milch">Milch (Milk)</option>
                <option value="nuklide_obst">Obst (Fruit)</option>
                <option value="nuklide_getreide">Getreide (Grain)</option>
                <option value="nuklide_pilze">Pilze (Mushrooms)</option>
                <option value="nuklide_trinkwasser">Trinkwasser (Drinking water)</option>
                <option value="nuklide_sonstige_nahrungsmittel">Sonstige Nahrungsmittel (Other foods)</option>

                <option value="nuklide_abfall">Abfall (Waste)</option>
                <option value="nuklide_pflanzliche_indikatoren">Pflanzliche Indikatoren (Vegetable indicators)</option>

                <option value="nuklide_boden">Boden - nuclidspez. Aktivitätskonzentration (Floor)</option>

                <option value="new_nuklide_bodenoberflaeche">Bodenoberfläche - nuclidspez. Dosisleistung (Floor surface)</option>

                <option value="nuklide_futtermittel">Futtermittel (Feed)</option>
                <option value="nuklide_weide_wiese">Weide- und Wiesenbewuchs (Pasture and meadow vegetation)</option>

              </select>
            </td>
          </tr>
          
          <tr>
            <td>
              Nuclids:
            </td>
            <td>
              <select id="nuclids" v-model="urlBag.nuclids" :class="nuclidsClassName" multiple>
                <option value="K-40">K-40</option>
                <option value="Co-60">Co-60</option>
                <option value="Ru-103">Ru-103</option>
                <option value="I-131">I-131</option>
                <option value="Cs-137">Cs-137</option>
                <option value="Cs-134">Cs-134</option>
                <option value="Ce-144">Ce-144</option>
                <option value="Be-7">Be-7</option>
                <option value="Tl-208">Tl-208</option>
                <option value="Pb-212">Pb-212</option>
                <option value="Pb-214">Pb-214</option>
                <option value="Bi-212">Bi-212</option>
                <option value="Bi-214">Bi-214</option>
                <option value="Ac-228">Ac-228</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>
              Start Date:
            </td>
            <td>
              <input type="datetime-local" v-model="urlBag.startDate" :class="startDateClassName" >
            </td>
          </tr>

          <tr>
            <td>
              End Date:
            </td>
            <td>
              <input type="datetime-local" v-model="urlBag.endDate" :class="endDateClassName">
            </td>
          </tr>

          <tr>
            <td>
            </td>
            <td>
              <button @click.prevent="getFormValues()">Submit</button>
            </td>
          </tr>

        </table>
      </fieldset>
    </form>
  </div>

</template>

<script>

  export default {
    name: 'UrlBuilder',
    emits: ['newUrlChanged'],
    props: {
      urlObject: Object
    },
    data () {
      return {
        baseBFSUrl: 'https://www.imis.bfs.de/ogc/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:',
        newUrl: this.updatedUrl,
        urlBag: this.urlObject,
        typeClassName: '',
        nuclidsClassName: '',
        startDateClassName: '',
        endDateClassName: '',
        errors: [],
      }
    },
    mounted()
    {
      //console.log(this.urlBag)
    },
    methods: {
      getFormValues () {
        this.newUrl = this.updatedUrl();

        if(!this.newUrl)
          return;

        console.log(this.newUrl);

        this.$emit('newUrlChanged', this.newUrl);
      },
      updatedUrl: function() {
        this.errors = [];
        this.typeClassName = '';
        this.nuclidsClassName = '';
        this.startDateClassName = '';
        this.endDateClassName = '';

        if (!this.urlBag.type) {
          this.errors.push("Type required.");
          this.typeClassName = 'error';
        }
        if (this.urlBag.nuclids.length == 0) {
          this.errors.push('Nuclids required.');
          this.nuclidsClassName = 'error';
        }
        if (!this.urlBag.startDate) {
          this.errors.push("start Date required.");
          this.startDateClassName = 'error';
        }
        if (!this.urlBag.endDate) {
          this.errors.push('end Date required.');
          this.endDateClassName = 'error';
        }
        
        if (this.errors.length > 0)
          return;

        let url = "";

        let start = encodeURIComponent(new Date(this.urlBag.startDate).toISOString());
        let end = encodeURIComponent(new Date(this.urlBag.endDate).toISOString());
        let type = this.urlBag.type;
        let nuclids = this.urlBag.nuclids;

        let cQL_FILTERQueryString = 
          "CQL_FILTER=(sample_begin%20DURING%20" +
          start + "%2F" + 
          end + ")%20AND%20" +
          "(" + 
          nuclids.map(e => "nuclide%3D%27" + e ).join("%27%20OR%20")
          + "%27)";

        let endOfQueryString = "VIEWPARAMS=order:sample_begin;&outputFormat=application%2Fjson";

        url = [type, cQL_FILTERQueryString, endOfQueryString].join('&');

        let newUrl = this.baseBFSUrl + url;

        return newUrl;
      }
    }
  }
</script>

<style scoped>
  table{
    line-height: 188%;
  }

  table, select, input, button{
    width: 100%;
  }
  
  textarea {
    width: 100%;
    height: 100%;
    resize: both;
  }

  .error{
    border: 1px solid red;
  }
</style>