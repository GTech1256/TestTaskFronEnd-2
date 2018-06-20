<template lang="pug">
  label
    span.checkbox-custom
    span.label Lorem ipsum dolor
</template>
<script>
export default {
  props: [
    'checked',
  ],
  data() {
    return {

    };
  },
};
</script>
<style lang="stylus">

.checkbox
  display none

.checkbox-custom
  width 20px
  height 20px
  border 2px solid #ccc
  border-radius 3px


</style>
