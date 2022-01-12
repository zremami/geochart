<template>
  <input v-model="url" @input="urlEdit($event.target.value)" type="text" placeholder="Json URL" />
</template>

<script>

  export default {
    name: 'GeojsonUrl',
    data () {
      return {
        url: this.url,
        jsondata: ''
      }
    },
    methods:{
      urlEdit: 
        async function(url){

          await fetch(url)
            .then(response => response.json())
            .then(data => {
              this.jsondata = JSON.stringify(data);
              } );
          
          this.$emit('urlChanged', this.jsondata);

        }
    },
    computed: {
    }
  }
</script>

<style scoped>
  input {
    width: 100%;
    height: 100%;
    resize: none;
  }
</style>