<template>
  <textarea  v-model="geojsonEdit"
    disabled
    placeholder="WFS Body(GeoJson)" >
  </textarea>
</template>

<script>

  export default {
    name: 'Editor',
    props: {
      geojson: Object
    },
    computed: {
      geojsonEdit: {
        set(value) {
          this.jsonBack = JSON.parse(value);
          this.$emit('change', JSON.parse(value))
        },
        get() {
          return JSON.stringify(this.geojson, null, ' ');
        }
      }
    }
  }
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 100%;
    resize: both;
  }
</style>