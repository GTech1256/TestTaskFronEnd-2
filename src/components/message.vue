<template lang="pug">
  .messagebox(:style="{ 'background-color': getEnumImage.color, 'box-shadow': getEnumImage.shadow}")
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
        succses: { src: 'static/img/checkmark.png', color: '0, 153, 30' },
        info: { src: 'static/img/information.png', color: '98, 177, 208' },
        warning: { src: 'static/img/error.png', color: '232, 184, 81' },
        crash: { src: 'static/img/private.png', color: '196, 47, 47' },
      },
    };
  },
  computed: {
    getEnumImage() {
      const params = this.enumImages[this.message.type];

      const shadow = `6px 10px 10px 2px rgba(${params.color},.7)`;

      const color = `rgb(${params.color})`;

      const { src } = params;

      return {
        color,
        src,
        shadow,
      };
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

  transform: translateY(-3px);


 .messagebox > h1
  font-size 1.5rem
  margin-top 0
  box-shadow 0

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

