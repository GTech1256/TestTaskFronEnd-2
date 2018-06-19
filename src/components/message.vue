<template lang="pug">
  .messagebox(:style="{ 'background-color': getEnumImage.color}")
    img.left.float(:src="getEnumImage.src" :alt="message.type")
    h1 {{ message.text }}
</template>
<script>
export default {
  props: [
    'message',
  ],
  data() {
    return {
      enumImages: {
        succses: { src: 'static/img/checkmark.png', color: 'green' },
        info: { src: 'static/img/information.png', color: '#62B1D0' },
        warning: { src: 'static/img/error.png', color: '#e8b851' },
        crash: { src: 'static/img/private.png', color: 'red' },
      },
    };
  },
  computed: {
    getEnumImage() {
      return this.enumImages[this.message.type];
    },
  },
};
</script>
<style lang="stylus">
.messagebox
  border 1px solid grey
  border-radius 30px
  padding 10px 20px
  margin 20px 0
  background-color: red
  opacity .8

  min-width 10%
  width:300px
  max-width:80%
  min-height 150px
  padding 20px


 .messagebox > h1
  font-size 1.5rem
  margin-top 0

img

  height 75px
  width 75px
  margin 0

.left
  float:left

@media screen and (max-width: 360px)

  .messagebox
    height 300px
    padding 20px


</style>

