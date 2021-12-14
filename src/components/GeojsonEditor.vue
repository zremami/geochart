<template>
  <textarea v-model="geojsonEdit" placeholder="Json Body"></textarea>
</template>

<script>

  export default {
    name: 'GeojsonEditor',
    props: {
      geojson: Object
    },
    computed: {
      geojsonEdit: {
        set(value) {
          this.$emit('change', value)
        },
        get() {
          return JSON.stringify(this.geojson, null, ' ')
        }
      }
    }
  }
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 100%;
    resize: none;
  }
</style>